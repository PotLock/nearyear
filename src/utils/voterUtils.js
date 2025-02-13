import { ListContract, VoteContract } from "@/config";
import { useContext } from "react";
import { NearContext } from "@/wallets/near"; // Import NearContext
import { fetchWhitelistedVoters } from "./fetchWhitelistedVoters";

export const isListCreator = async (wallet, accountId) => {
  try {
    if (
      !accountId ||
      typeof accountId !== "string" ||
      !accountId.match(/^[a-z0-9._-]+$/)
    ) {
      throw new Error("Invalid account ID format");
    }

    const lists = await wallet.viewMethod({
      contractId: ListContract,
      method: "get_lists_for_owner",
      args: { owner_id: accountId },
    });

    return lists.length > 0;
  } catch (error) {
    console.error("Error checking list creator status:", error);
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
    if (
      !accountId ||
      typeof accountId !== "string" ||
      !accountId.match(/^[a-z0-9._-]+$/)
    ) {
      throw new Error("Invalid account ID format");
    }

    const lists = await wallet.viewMethod({
      contractId: ListContract,
      method: "get_lists_for_owner",
      args: { owner_id: accountId },
    });

    return lists;
  } catch (error) {
    console.error("Error retrieving lists for owner:", error);
    return [];
  }
};

export const fetchVoters = async ({ wallet, signedAccountId }) => {
  try {
    const { owners, isWhitelisted } = await fetchWhitelistedVoters(
      wallet,
      signedAccountId
    );
    // setWhitelistedVoters(owners);
    // setIsWhitelisted(isWhitelisted);

    // Calculate dynamic values
    const totalCategories = 49; // Replace with actual logic if needed
    const totalNominees = owners.length; // Assuming each owner is a nominee
    const totalVoters = owners.length; // Assuming each owner is a voter

    // Create summary data
    const summaryData = createSummaryData(
      totalCategories,
      totalNominees,
      totalVoters
    );

    // Check if each owner is a list creator
    const listCreatorStatus = await Promise.all(
      owners.map(async (owner) => {
        const isCreator = await isListCreator(wallet, owner);
        return { owner, isListCreator: isCreator };
      })
    );

    const listCreatorsMap = listCreatorStatus.reduce(
      (acc, { owner, isListCreator }) => {
        acc[owner] = isListCreator;
        return acc;
      },
      {}
    );

    // setListCreators(listCreatorsMap);

    return {
      // owners,
      isWhitelisted,
      summaryData,
      listCreatorsMap,
    };
  } catch (error) {
    console.error("Error fetching whitelisted voters:", error);
  }
};

export const getAllVotedCategories = async ({ voters, data }) => {
  const voterCategories = [];

  if (Array.isArray(voters)) {
    for (const voter of voters) {
      const promises = data.map((category) =>
        wallet.viewMethod({
          contractId: VoteContract,
          method: "has_voter_participated",
          args: {
            election_id: Number(category.id),
            voter: voter,
          },
        })
      );

      const results = await Promise.all(promises);

      const votedCategories = data
        .filter((_, index) => results[index])
        .map((category) => category.id.toString());

      console.log({ voter, votedCategories });

      voterCategories.push({ voter, votedCategories });
    }
  }

  return voterCategories;
};
