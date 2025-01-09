const voteContract = {
  mainnet: 'mpdao.vote.potlock.near',
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
export const HelloNearContract =  voteContract[NetworkId];
export const ListContract = listContract[NetworkId];
export const ListCreator = listCreatorAccount[NetworkId];
export const EVMWalletChain = evmWalletChains[NetworkId];