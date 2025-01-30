import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const VotingQueueContext = createContext();

export function VotingQueueProvider({ children }) {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const savedQueue = localStorage.getItem("votingQueue");
    if (savedQueue) {
      setQueue(JSON.parse(savedQueue));
    }
  }, []);

  const addToQueue = useCallback((nominee) => {
    setQueue((prevQueue) => {
      const newQueue = [...prevQueue, nominee];
      localStorage.setItem("votingQueue", JSON.stringify(newQueue));
      window.dispatchEvent(new Event("queueUpdate"));
      return newQueue;
    });
  }, []);

  const removeFromQueue = useCallback((categoryId) => {
    setQueue((prevQueue) => {
      const newQueue = prevQueue.filter(
        (item) => item.categoryId !== categoryId
      );
      localStorage.setItem("votingQueue", JSON.stringify(newQueue));
      window.dispatchEvent(new Event("queueUpdate"));
      return newQueue;
    });
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
    localStorage.removeItem("votingQueue");
    window.dispatchEvent(new Event("queueUpdate"));
  }, []);

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
}

export const useVotingQueue = () => useContext(VotingQueueContext);
