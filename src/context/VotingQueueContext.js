import { createContext, useContext, useState, useEffect } from "react";

const VotingQueueContext = createContext();

export const VotingQueueProvider = ({ children }) => {
  // Initialize queue from localStorage if it exists
  const [queue, setQueue] = useState(() => {
    if (typeof window !== "undefined") {
      const savedQueue = localStorage.getItem("votingQueue");
      return savedQueue ? JSON.parse(savedQueue) : [];
    }
    return [];
  });

  // Update localStorage whenever queue changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("votingQueue", JSON.stringify(queue));
    }
  }, [queue]);

  const clearQueue = () => {
    setQueue([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("votingQueue");
    }
    window.dispatchEvent(new Event("queueUpdate"));
  };

  const removeFromQueue = (categoryId) => {
    setQueue((prevQueue) => {
      const newQueue = prevQueue.filter(
        (item) => item.categoryId !== categoryId
      );
      window.dispatchEvent(new Event("queueUpdate"));
      return newQueue;
    });
  };

  const addToQueue = (nominee) => {
    setQueue((prevQueue) => {
      const newQueue = [...prevQueue, nominee];
      window.dispatchEvent(new Event("queueUpdate"));
      return newQueue;
    });
  };

  const value = {
    queue,
    addToQueue,
    removeFromQueue,
    clearQueue,
  };

  return (
    <VotingQueueContext.Provider value={value}>
      {children}
    </VotingQueueContext.Provider>
  );
};

export const useVotingQueue = () => useContext(VotingQueueContext);
