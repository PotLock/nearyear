import { VoteContract } from "@/config";
import { NearContext } from "@/wallets/near";
import React, { useContext, useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";

const ResultsTable = ({
  voterWithNFT,
  winnersPerCategory,
  tiesPerCategory,
  listCreators,
  loadingVoters,
}) => {
  const { wallet } = useContext(NearContext);
  const [voterResults, setVoterResults] = useState([]);

  const checkVoteStatus = async ({ id, accountId }) => {
    if (!id || !accountId) return;

    const hasParticipated = await wallet.viewMethod({
      contractId: VoteContract,
      method: "has_voter_participated",
      args: {
        election_id: Number(id),
        voter: accountId,
      },
    });
    return hasParticipated;
  };

  useEffect(() => {
    const allVoterResults = {};

    const fetchVoterResults = async () => {
      const allVoterPromises = voterWithNFT.map(async (voter) => {
        const categoryPromises =
          winnersPerCategory &&
          winnersPerCategory.map(async (category) => {
            try {
              const hasVoted = await checkVoteStatus({
                id: category.id,
                accountId: voter.voter,
              });

              if (hasVoted) {
                console.log(voter.voter, "voted for", category.title);
                if (!allVoterResults[voter.voter]) {
                  allVoterResults[voter.voter] = [];
                }
                allVoterResults[voter.voter].push(category.title);
              }
            } catch (error) {
              console.error("Error checking vote status:", error);
            }
          });

        await Promise.all(categoryPromises);
      });

      await Promise.all(allVoterPromises);

      const results = Object.keys(allVoterResults).map((voter) => ({
        voter,
        categories: allVoterResults[voter],
      }));

      setVoterResults(results);
      console.log({ allVoterResults });
    };

    fetchVoterResults();
  }, [voterWithNFT, winnersPerCategory]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 mt-8">Winners Per Category</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4 border-b text-left">Category</th>
              <th className="py-2 px-4 border-b text-left">Winners</th>
            </tr>
          </thead>
          <tbody>
            {winnersPerCategory.map((category, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{category.title}</td>
                <td className="py-2 px-4 border-b">
                  {category.winners
                    .map((winner) => winner.account_id)
                    .join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-8">Categories with Ties</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4 border-b text-left">Category</th>
              <th className="py-2 px-4 border-b text-left">Winners</th>
            </tr>
          </thead>
          <tbody>
            {tiesPerCategory.map((category, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{category.title}</td>
                <td className="py-2 px-4 border-b">
                  {category.winners
                    .map((winner) => winner.account_id)
                    .join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold my-4">Voters with NFT Qualification</h2>
      <div className="overflow-x-auto">
        {loadingVoters ? (
          <div className="flex justify-center items-center">
            <Audio height="80" width="80" color="grey" ariaLabel="loading" />
          </div>
        ) : (
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 border-b text-left">Voter</th>
                <th className="py-2 px-4 border-b text-left">Is Qualified</th>
                <th className="py-2 px-4 border-b text-left">
                  Is List Creator
                </th>
                <th className="py-2 px-4 border-b text-left">
                  Voted Categories
                </th>
              </tr>
            </thead>
            <tbody>
              {voterWithNFT.map((voter, index) => {
                const voterResult = voterResults.find(
                  (result) => result.voter === voter.voter
                );
                const votedCategories = voterResult
                  ? voterResult.categories.join(", ")
                  : "None";

                return (
                  <tr
                    key={index}
                    className={`hover:bg-gray-100 ${
                      listCreators.find(
                        (creator) => creator.voter === voter.voter
                      )?.isCreator
                        ? "bg-green-100"
                        : ""
                    }`}
                  >
                    <td className="py-2 px-4 border-b">{voter.voter}</td>
                    <td className="py-2 px-4 border-b">
                      {voter.isQualified ? "Yes" : "No"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {listCreators.find(
                        (creator) => creator.voter === voter.voter
                      )?.isCreator
                        ? "Yes"
                        : "No"}
                    </td>
                    <td className="py-2 px-4 border-b">{votedCategories}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ResultsTable;