import { useState, useEffect } from 'react';
import { ListContract } from '@/config'; // Ensure this is correctly imported
import { NearContext } from '@/wallets/near'; // Import NearContext if needed
import { useContext } from 'react'; // Import useContext

export const useLists = ({ account }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { wallet } = useContext(NearContext); // Use NearContext to get the wallet

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!wallet) throw new Error("Wallet not available");

        const categories = await wallet.viewMethod({
          contractId: ListContract,
          method: 'get_lists_for_owner',
          args: { owner_id: account },
        });

        setData(categories);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (account) {
      fetchData();
    }
  }, [account, wallet]);

  return { data, error, isLoading };
}; 