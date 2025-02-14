import ResultsTable from "@/components/ResultsTable";
import { VoteContract } from "@/config";
import { fetchWhitelistedVoters } from "@/utils/fetchWhitelistedVoters";
import { isListCreator, isValidVoter } from "@/utils/voterUtils";
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
  const [tiesPerCategory, setTiesPerCategory] = useState([]);
  const [voterWithNFT, setVoterWithNFT] = useState([]);
  const [listCreators, setListCreators] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingVoters, setLoadingVoters] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await wallet.viewMethod({
        contractId: VoteContract,
        method: "get_elections",
      });
      setCategories(data);
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
      return isWhitelisted ? owners : [];
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
    if (!categories || categories.length === 0) {
      setLoading(false);
      return;
    }

    const structuredCatsNominees = [];
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
        }
      } catch (error) {
        console.error(`Error fetching nominees for category ${title}:`, error);
      }
    });
    await Promise.all(promises);
    setNomineesPerCategory(structuredCatsNominees);
  }, [categories, wallet]);

  const fetchVoters = useCallback(async () => {
    const voterWithNFT = [];
    const listCreators = [];

    try {
      const allVoters = await fetchAndReturnVoters();
      if (allVoters && allVoters.length > 0) {
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
      }
    } catch (error) {
      console.error("Error fetching voters:", error);
    }

    setVoterWithNFT(voterWithNFT);
    setListCreators(listCreators);
    setLoadingVoters(false);
  }, [fetchAndReturnVoters, wallet]);

  useEffect(() => {
    if (categories) {
      fetchNominees();
    } else {
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
    const maxVotes = Math.max(...nominees.map((n) => n.votes_received));
    if (maxVotes === 0) return [];
    return nominees.filter((n) => n.votes_received === maxVotes);
  }, []);

  useEffect(() => {
    if (nomineesPerCategory.length > 0) {
      const winnersPerCategory = nomineesPerCategory.map((category) => {
        const winners = getWinners(category.nominees);
        return { id: category.id, title: category.title, winners };
      });

      const ties = winnersPerCategory.filter(
        (category) => category.winners.length > 1
      );

      setWinnersPerCategory(winnersPerCategory);
      setTiesPerCategory(ties);
    }
  }, [nomineesPerCategory, getWinners]);

  const memoizedResults = useMemo(
    () => ({
      voterWithNFT,
      winnersPerCategory,
      tiesPerCategory,
      listCreators,
    }),
    [voterWithNFT, winnersPerCategory, tiesPerCategory, listCreators]
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