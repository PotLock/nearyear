import ResultsTable from "@/components/ResultsTable";
import { VoteContract } from "@/config";
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
  const [voterWithNFT, setVoterWithNFT] = useState(new Map());
  const [listCreators, setListCreators] = useState(new Map());
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
  const fetchAllVotersPerParticipation = useCallback(async () => {
    try {
      const data = await wallet.viewMethod({
        contractId: VoteContract,
        method: "get_all_voter_participation",
      });

      if (!data) {
        throw new Error(`No data returned`);
      }
      setVoterWithNFT(data);
      setLoadingVoters(false);
    } catch (error) {
      console.error("Error fetching voter participation:", error);
    }
  }, [wallet]);

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

  useEffect(() => {
    if (categories) {
      fetchNominees();
    } else {
      setLoading(false);
    }
  }, [categories, fetchNominees]);

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
      voterWithNFT: Array.from(voterWithNFT),
      winnersPerCategory,
      tiesPerCategory,
      listCreators: Array.from(listCreators.values()),
    }),
    [
      voterWithNFT,
      winnersPerCategory,
      tiesPerCategory,
      listCreators,
    ]
  );

  useEffect(() => {
    const fetchVoterParticipation = async () => {
      try {
        const data = await fetchAllVotersPerParticipation();
        const voterParticipationMap = new Map();

        data.forEach(([voter, categories]) => {
          voterParticipationMap.set(voter, categories.length);
        });
      } catch (error) {
        console.error("Error fetching voter participation:", error);
      }
    };

    fetchVoterParticipation();
  }, [fetchAllVotersPerParticipation]);

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
