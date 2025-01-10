const voteContract = {
  mainnet: 'v1.vote.potlock.near',
  testnet: 'awards.potlock.testnet',
};
const listContract = {
  mainnet: 'lists.potlock.near',
  testnet: 'lists.potlock.testnet',
};
const listCreatorAccount = {
  mainnet: 'plugrel.near',
  testnet: 'potlock.testnet',
};

 const socialContract = {
  mainnet: "social.near",
  testnet: "v1.social08.testnet"
};

// Chains for EVM Wallets 
const evmWalletChains = {
  mainnet: {
    chainId: 397,
    name: "Near Mainnet",
    explorer: "https://eth-explorer.near.org",
    rpc: "https://eth-rpc.mainnet.near.org",
  },
  testnet: {
    chainId: 398,
    name: "Near Testnet",
    explorer: "https://eth-explorer-testnet.near.org",
    rpc: "https://eth-rpc.testnet.near.org",
  },
}

export const NetworkId = 'mainnet';
export const SOCIAL_CONTRACT = socialContract[NetworkId];
export const VoteContract =  voteContract[NetworkId];
export const ListContract = listContract[NetworkId];
export const ListCreator = listCreatorAccount[NetworkId];
export const EVMWalletChain = evmWalletChains[NetworkId];