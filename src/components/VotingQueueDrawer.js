import { useVotingQueue } from "@/context/VotingQueueContext";
import { voteForNominees } from "@/utils/voting";
import { useState } from "react";
import { X, ChevronUp, ChevronDown, Award } from "lucide-react";
import Image from "next/image";

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

  const QueuedCandidateCard = ({ candidate }) => {
    const [isError, setIsError] = useState(false);

    const handleImageError = () => {
      if (!isError) {
        setIsError(true);
      }
    };

    return (
      <div className="relative bg-white rounded-lg p-4 mb-3 group transition-all duration-300 hover:shadow-md overflow-hidden">
        {/* Gradient borders */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400" />
        <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-blue-400 via-purple-400 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-teal-400" />
        <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-blue-400 via-purple-400 to-transparent" />

        <div className="relative flex items-center space-x-3">
          <div className="relative w-12 h-12 rounded-full border-2 border-gray-100 overflow-hidden">
            <Image
              src={
                isError
                  ? `https://robohash.org/${candidate.candidateId}.png`
                  : `https://i.near.social/magic/thumbnail/https://near.social/magic/img/account/${candidate.candidateId}`
              }
              alt={candidate.candidateId}
              fill
              className="object-cover"
              onError={handleImageError}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {candidate.candidateId}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {candidate.categoryTitle}
            </p>
          </div>
          
          <button
            onClick={() => handleRemove(candidate.categoryId)}
            className="text-red-500 hover:text-red-600 transition-colors duration-200 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Bar */}
        <div className="p-4 flex items-center justify-between border-b">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            {isExpanded ? <ChevronDown /> : <ChevronUp />}
            <span>{queue.length} Nominees Selected</span>
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleVoteAll}
              disabled={isVoting}
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-full flex items-center hover:shadow-lg transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed"
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
            <button
              onClick={clearQueue}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="p-4 max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {queue.map((nominee) => (
              <QueuedCandidateCard
                key={`${nominee.categoryId}-${nominee.candidateId}`}
                candidate={nominee}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
