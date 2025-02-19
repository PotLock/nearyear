export const fetchWhitelistedVoters = async (signedAccountId) => {
  const query = `
    query MyQuery {
      mb_views_nft_owned_tokens(
        where: {
          nft_contract_id: { _eq: "claim.sharddog.near" },
          token_id: { _regex: "^151:" }
        }
      ) {
        owner
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
    const owners = [
      ...new Set(
        data.data.mb_views_nft_owned_tokens.map((token) => token.owner)
      ),
    ];

    return { owners, isWhitelisted: owners.includes(signedAccountId) };
  } catch (error) {
    console.error("Error fetching whitelisted voters:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};
