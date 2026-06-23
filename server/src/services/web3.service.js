/**
 * GoPlus Security API Integration for Web3 Token/Contract Scanning
 */
export async function checkTokenSecurity(chainId, address) {
  try {
    const response = await fetch(`https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${address}`);
    if (!response.ok) {
      throw new Error(`GoPlus API Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("[Web3 Service] Error fetching token security:", err.message);
    throw err;
  }
}
