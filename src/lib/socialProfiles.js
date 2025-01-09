import { providers } from 'near-api-js';
import { socialContract } from '@/config'; // Ensure this is correctly imported

// Example of initializing the wallet object
const wallet = initializeWallet(); // Ensure this function is defined and returns a wallet object

function initializeNetwork(wallet) {
  if (!wallet) {
    console.error('Wallet is not defined');
    return null; // Return null if wallet is not defined
  }

  const NETWORK_ID = wallet.networkId === 'testnet' ? 'testnet' : 'mainnet';
  console.log(`Network: ${NETWORK_ID}`);
  return NETWORK_ID; // Return NETWORK_ID
}

// Call the function with the wallet object
const NETWORK_ID = initializeNetwork(wallet);

/**
 * Fetches the profile data for a given account ID from the NEAR social contract.
 */
function fetchProfile(accountId) {
  if (!NETWORK_ID) {
    console.error('NETWORK_ID is not defined');
    return;
  }

  // Example fetch logic using NETWORK_ID
  console.log(`Fetching profile for ${accountId} on ${NETWORK_ID}`);
  // Add actual fetch logic here
}

// Example usage
fetchProfile('mob.near');

// Example function to initialize the wallet
function initializeWallet() {
  // Replace with actual logic to create and return a wallet object
  return {
    networkId: 'mainnet', // or 'mainnet', depending on your environment
  };
} 