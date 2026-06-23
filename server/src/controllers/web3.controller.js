import { checkTokenSecurity } from "../services/web3.service.js";

export async function scanContract(req, res) {
  try {
    const { address, chainId = "1" } = req.body;
    if (!address) {
      return res.status(400).json({ error: "Missing contract address" });
    }

    const lowerAddress = address.toLowerCase();
    const data = await checkTokenSecurity(chainId, lowerAddress);

    if (data.code !== 1 || !data.result || !data.result[lowerAddress]) {
      // If GoPlus doesn't know it, or it's not a valid token contract
      return res.status(404).json({
        error: "Contract not found or not supported on this chain.",
      });
    }

    const tokenInfo = data.result[lowerAddress];
    
    // Map GoPlus raw data to our Threat format
    const threats = [];
    
    if (tokenInfo.is_honeypot === "1") {
      threats.push({
        name: "Honeypot Detected",
        desc: "Highly malicious signature. Users can buy this token but cannot sell it."
      });
    }
    
    if (tokenInfo.is_open_source === "0") {
      threats.push({
        name: "Unverified Contract",
        desc: "The source code is not open or verified. The developer can hide malicious logic."
      });
    }
    
    const sellTax = parseFloat(tokenInfo.sell_tax || "0");
    if (sellTax > 0.1) {
      threats.push({
        name: "High Sell Tax",
        desc: `This contract extracts a massive fee (${(sellTax * 100).toFixed(1)}%) when you try to sell or transfer it.`
      });
    }

    if (tokenInfo.cannot_sell_all === "1") {
      threats.push({
        name: "Cannot Sell All",
        desc: "Contract prevents users from selling all their tokens at once."
      });
    }
    
    if (tokenInfo.owner_change_balance === "1") {
      threats.push({
        name: "Owner Can Change Balances",
        desc: "The contract owner can arbitrarily mint or drain tokens from user wallets."
      });
    }

    if (tokenInfo.hidden_owner === "1") {
      threats.push({
        name: "Hidden Ownership",
        desc: "The contract uses an unverified or hidden developer address, a common sign of a rug pull."
      });
    }

    const score = threats.length > 0 ? 98 : 0;
    const status = threats.length > 0 ? "DANGEROUS" : "SAFE";

    res.json({
      status,
      score,
      contract: address,
      name: tokenInfo.token_name ? `${tokenInfo.token_name} (${tokenInfo.token_symbol})` : "Unknown Token",
      threats,
      raw_data: tokenInfo
    });

  } catch (error) {
    console.error("[Web3 Controller] Error:", error);
    res.status(500).json({ error: "Failed to perform smart contract security scan." });
  }
}
