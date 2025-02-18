import { useEffect, useState, useContext, useCallback } from "react";
import { NearContext } from "@/wallets/near";
import { VoteContract } from "@/config";
import { Audio } from "react-loader-spinner";
import Image from "next/image";
import { toast } from "react-hot-toast";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // Import Tippy.js CSS for basic styling
import ProfileImage from "@/components/ProfileImage";

const WinnersPage = () => {
  const { wallet } = useContext(NearContext);
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nominees, setNominees] = useState([]);
  const [categories, setCategories] = useState([]);

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

  const getWinners = useCallback((nominees) => {
    if (!nominees.length) return [];
    const maxVotes = Math.max(...nominees.map((n) => n.votes_received));
    if (maxVotes === 0) return [];
    return nominees.filter((n) => n.votes_received === maxVotes);
  }, []);

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
    setNominees(structuredCatsNominees);
  }, [categories, wallet]);

  useEffect(() => {
    if (wallet) {
      fetchCategories();
    }
  }, [wallet, fetchCategories]);

  useEffect(() => {
    if (categories.length > 0) {
      fetchNominees();
    }
  }, [categories, fetchNominees]);

  useEffect(() => {
    if (nominees.length > 0) {
      const winnerMap = new Map();
      nominees.forEach((category) => {
        const winners = getWinners(category.nominees);
        winners.forEach((winner) => {
          if (winnerMap.has(winner.account_id)) {
            winnerMap.get(winner.account_id).categories.push(category.title);
          } else {
            winnerMap.set(winner.account_id, {
              ...winner,
              categories: [category.title],
            });
          }
        });
      });

      setWinners(Array.from(winnerMap.values()));
      setLoading(false);
    }
  }, [nominees, getWinners]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Audio height="80" width="80" color="grey" ariaLabel="loading" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Winners Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 lg:px-6">
        {winners.map((winner) => (
          <div
            key={winner.account_id}
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 p-6"
          >
            <div className="flex justify-center mb-4">
              <ProfileImage
                accountId={winner.account_id}
                fallbackImage={`https://robohash.org/${winner.account_id}.png`}
              />
            </div>
            <h3 className="text-xl font-semibold text-center mb-4 break-words">
              {winner.account_id}
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {winner.categories.map((category, index) => (
                <Tippy key={index} content={category} placement="top">
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-800 truncate max-w-xs">
                    {category}
                  </span>
                </Tippy>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WinnersPage;
