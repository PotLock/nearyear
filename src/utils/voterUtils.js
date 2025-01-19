import { ListContract } from '@/config';
import { useContext } from 'react';
import { NearContext } from '@/wallets/near'; // Import NearContext

export const isListCreator = async (wallet, accountId) => {
  try {
    if (!accountId || typeof accountId !== 'string' || !accountId.match(/^[a-z0-9._-]+$/)) {
      throw new Error('Invalid account ID format');
    }

    console.log('Wallet object:', wallet); // Debugging line

    const lists = await wallet.viewMethod({
      contractId: ListContract,
      method: 'get_lists_for_owner',
      args: { owner_id: accountId },
    });

    return lists.length > 0;
  } catch (error) {
    console.error('Error checking list creator status:', error);
    return false;
  }
};

export const isValidVoter = async (accountId) => {
  const query = `
    query MyQuery {
      mb_views_nft_tokens(
        limit: 1
        where: {
          nft_contract_id: { _eq: "claim.sharddog.near" },
          token_id: { _regex: "^151:" },
          owner: { _eq: "${accountId}" }
        }
      ) {
        token_id
      }
    }
  `;

  try {
    const response = await fetch("https://graph.mintbase.xyz/mainnet", {
      method: "POST",
      headers: {
        "mb-api-key": "omni-site",
        "Content-Type": "application/json",
        "x-hasura-role": "anonymous",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data.mb_views_nft_tokens.length > 0;
  } catch (error) {
    console.error("Error checking voter eligibility:", error);
    return false;
  }
};

export const getListsByOwner = async (wallet, accountId) => {
  try {
    if (!accountId || typeof accountId !== 'string' || !accountId.match(/^[a-z0-9._-]+$/)) {
      throw new Error('Invalid account ID format');
    }

    const lists = await wallet.viewMethod({
      contractId: ListContract,
      method: 'get_lists_for_owner',
      args: { owner_id: accountId },
    });

    return lists;
  } catch (error) {
    console.error('Error retrieving lists for owner:', error);
    return [];
  }
}; 