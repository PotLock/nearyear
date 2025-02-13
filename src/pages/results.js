import ResultsTable from "@/components/ResultsTable";
import { VoteContract } from "@/config";
import { fetchWhitelistedVoters } from "@/utils/fetchWhitelistedVoters";
import {
  getAllVotedCategories,
  isListCreator,
  isValidVoter,
} from "@/utils/voterUtils";
import { NearContext } from "@/wallets/near";
import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import toast from "react-hot-toast";
import { Audio } from "react-loader-spinner";

const ResultsPage = () => {
  const { wallet, signedAccountId } = useContext(NearContext);
  const [nomineesPerCategory, setNomineesPerCategory] = useState([]);
  const [winnersPerCategory, setWinnersPerCategory] = useState([]);
  const [allUserVotedCategories, setAllUserVotedCategories] = useState([]);
  const [voterWithNFT, setVoterWithNFT] = useState([]);
  const [tiesPerCategory, setTiesPerCategory] = useState([]);
  const [listCreators, setListCreators] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voterCategories, setVoterCategories] = useState(new Set());
  const [loadingVoters, setLoadingVoters] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await wallet.viewMethod({
        contractId: VoteContract,
        method: "get_elections",
      });
      setCategories(data);
      console.log({ categories: data });
    } catch (error) {
      console.error("Error fetching categories", error);
      toast.error("Failed to fetch categories. Please try again later.");
    }
  }, [wallet]);

  const fetchAndReturnVoters = useCallback(async () => {
    try {
      const { owners, isWhitelisted } = await fetchWhitelistedVoters(
        wallet,
        signedAccountId
      );

      if (isWhitelisted) {
        return owners;
      }
      return [];
    } catch (error) {
      console.error("Error fetching whitelisted voters", error);
      toast.error("Failed to fetch voters. Please try again later.");
      return [];
    }
  }, [wallet, signedAccountId]);

  useEffect(() => {
    if (!wallet) return;
    fetchCategories();
  }, [wallet, fetchCategories]);

  const fetchNominees = useCallback(async () => {
    const structuredCatsNominees = [];
    console.log("Fetching nominees...");

    if (!categories || categories.length === 0) {
      console.log("No categories available.");
      setLoading(false);
      return;
    }

    const promises = categories.map(async (category) => {
      const { id, title } = category;
      try {
        const nominees = await wallet.viewMethod({
          contractId: VoteContract,
          method: "get_election_candidates",
          args: { election_id: Number(id) },
        });
        if (nominees && nominees.length > 0) {
          structuredCatsNominees.push({ id, title, nominees });
        } else {
          console.log(`No nominees found for category ${title}.`);
        }
      } catch (error) {
        console.error(`Error fetching nominees for category ${title}:`, error);
      }
    });
    await Promise.all(promises);
    setNomineesPerCategory(structuredCatsNominees);
    console.log("Structured categories with nominees:", structuredCatsNominees);
  }, [categories, wallet]);

  const fetchVoters = useCallback(async () => {
    const voterWithNFT = [];
    const listCreators = [];
    const categoriesUserVotedIn = [];

    console.log("Fetching voters...");

    try {
      const allVoters = await fetchAndReturnVoters();
      if (allVoters && allVoters.length > 0) {
        console.log("Fetched voters:", allVoters);

        const qualificationPromises = allVoters.map(async (voter) => {
          try {
            const isValid = await isValidVoter(voter);
            voterWithNFT.push({ voter, isQualified: isValid });
          } catch (error) {
            console.error(
              `Error checking qualification for voter ${voter}:`,
              error
            );
            voterWithNFT.push({ voter, isQualified: false });
          }
        });

        const creatorPromises = allVoters.map(async (voter) => {
          try {
            const isCreator = await isListCreator(wallet, voter);
            listCreators.push({ voter, isCreator });
          } catch (error) {
            console.error(
              `Error checking list creator for voter ${voter}:`,
              error
            );
            listCreators.push({ voter, isCreator: false });
          }
        });

        await Promise.all([...qualificationPromises, ...creatorPromises]);

        const votedCategories = await getAllVotedCategories({
          voters: allVoters,
          data: categories,
        });
        setVoterCategories(votedCategories);

        console.log("Fetched voted categories:", voterCategories);
        categoriesUserVotedIn.push(...votedCategories);
      } else {
        console.log("No voters found.");
      }
    } catch (error) {
      console.error("Error fetching voters or voted categories:", error);
    }

    setVoterWithNFT(voterWithNFT.slice(0, 10));
    setListCreators(listCreators);
    setAllUserVotedCategories(categoriesUserVotedIn);
    setLoadingVoters(false);
    console.log("Voters with NFT qualification:", voterWithNFT);
    console.log("List creators:", listCreators);
  }, [categories, fetchAndReturnVoters, wallet]);

  useEffect(() => {
    if (categories) {
      fetchNominees();
    } else {
      console.log("Categories are not available.");
      setLoading(false);
    }
  }, [categories, fetchNominees]);

  useEffect(() => {
    if (nomineesPerCategory.length > 0) {
      fetchVoters();
    }
  }, [nomineesPerCategory, fetchVoters]);

  const getWinners = useCallback((nominees) => {
    if (!nominees.length) return [];
    // Get the highest vote count
    const maxVotes = Math.max(...nominees.map((n) => n.votes_received));
    if (maxVotes === 0) return [];
    // Get all nominees with the highest vote count (could be multiple in case of tie)
    const winners = nominees.filter((n) => n.votes_received === maxVotes);
    return winners;
  }, []);

  useEffect(() => {
    if (nomineesPerCategory.length > 0) {
      const winnersPerCategory = nomineesPerCategory.map((category) => {
        const winners = getWinners(category.nominees);
        return { id: category.id, title: category.title, winners };
      });

      const tiesPerCategory = winnersPerCategory.filter(
        (category) => category.winners.length > 1
      );

      setWinnersPerCategory(winnersPerCategory);
      setTiesPerCategory(tiesPerCategory);
      console.log("Calculated winners per category:", winnersPerCategory);
      console.log("Categories with ties:", tiesPerCategory);
    }
  }, [nomineesPerCategory, getWinners]);

  const memoizedResults = useMemo(
    () => ({
      voterWithNFT,
      winnersPerCategory,
      tiesPerCategory,
      listCreators,
      voterCategories,
    }),
    [
      voterWithNFT,
      winnersPerCategory,
      tiesPerCategory,
      listCreators,
      voterCategories,
    ]
  );

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Election Results</h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <Audio height="80" width="80" color="grey" ariaLabel="loading" />
        </div>
      ) : (
        <ResultsTable {...memoizedResults} loadingVoters={loadingVoters} />
      )}
    </div>
  );
};

export default ResultsPage;
