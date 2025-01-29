import { createContext, useContext, useState } from "react";

const VotingQueueContext = createContext();

export function VotingQueueProvider({ children }) {
  const [votingQueue, setVotingQueue] = useState([]);

  const addToQueue = (nominee) => {
    setVotingQueue((prev) => {
      // Prevent duplicates based on categoryId
      const filtered = prev.filter(
        (item) => item.categoryId !== nominee.categoryId
      );
      return [...filtered, nominee];
    });
  };

  const removeFromQueue = (categoryId) => {
    setVotingQueue((prev) =>
      prev.filter((item) => item.categoryId !== categoryId)
    );
  };

  const clearQueue = () => {
    setVotingQueue([]);
  };

  return (
    <VotingQueueContext.Provider
      value={{
        votingQueue,
        addToQueue,
        removeFromQueue,
        clearQueue,
      }}
    >
      {children}
    </VotingQueueContext.Provider>
  );
}

export const useVotingQueue = () => useContext(VotingQueueContext);
