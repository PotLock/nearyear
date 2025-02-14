export const voteForNominees = async ({
  wallet,
  VoteContract,
  candidateData,
}) => {
  if (Array.isArray(candidateData)) {
    try {
      const trxs = candidateData.map((item) => {
        return {
          receiverId: VoteContract,
          actions: [
            {
              type: "FunctionCall",
              params: {
                methodName: "vote",
                args: {
                  election_id: Number(item.categoryId),
                  vote: [item.candidateId, 1],
                },
                gas: "30000000000000",
                deposit: "10000000000000000000000",
              },
            },
          ],
        };
      });
      await wallet.signAndSendTransactions({ transactions: trxs });
    } catch (error) {
      console.error("Multiple voting failed:", error);
      throw error;
    }
  } else {
    // Handle single vote
    try {
      await wallet.callMethod({
        contractId: VoteContract,
        method: "vote",
        args: {
          election_id: Number(candidateData.categoryId),
          vote: [candidateData.candidateId, 1],
        },
        deposit: "10000000000000000000000",
      });
    } catch (error) {
      console.error("Voting failed:", error);
      throw error;
    }
  }
};


