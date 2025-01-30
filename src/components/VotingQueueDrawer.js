import { useVotingQueue } from "@/context/VotingQueueContext";
import { voteForNominees } from "@/utils/voting";
import { useState } from "react";
import { X, ChevronUp, ChevronDown, Award } from "lucide-react";

export function VotingQueueDrawer({ wallet, VoteContract }) {
  const { queue, removeFromQueue, clearQueue } = useVotingQueue();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVoting, setIsVoting] = useState(false);

  const handleVoteAll = async () => {
    setIsVoting(true);
    try {
      await voteForNominees({
        wallet,
        VoteContract,
        candidateData: queue,
      });
      clearQueue();
      window.dispatchEvent(new Event("queueUpdate"));
    } catch (error) {
      console.error("Failed to submit votes:", error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleRemove = (categoryId) => {
    removeFromQueue(categoryId);
  };

  if (!queue || queue.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Bar */}
        <div className="p-4 flex items-center justify-between border-b">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2"
          >
            {isExpanded ? <ChevronDown /> : <ChevronUp />}
            <span>{queue.length} Nominees Selected</span>
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleVoteAll}
              disabled={isVoting}
              className="bg-black text-white px-6 py-2 rounded-full flex items-center"
            >
              {isVoting ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⌛</span> Voting...
                </span>
              ) : (
                <>
                  <Award className="w-4 h-4 mr-2" />
                  Vote All
                </>
              )}
            </button>
            <button onClick={clearQueue}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="p-4 max-h-[40vh] overflow-y-auto">
            {queue.map((nominee) => (
              <div
                key={`${nominee.categoryId}-${nominee.candidateId}`}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
              >
                <div>
                  <p className="font-medium">{nominee.candidateId}</p>
                  <p className="text-sm text-gray-500">
                    {nominee.categoryTitle}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(nominee.categoryId)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
