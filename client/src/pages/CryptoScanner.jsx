import React, { useState } from 'react';
import LoadingState from '../components/analyzer/LoadingState';
import PageHeader from '../components/common/PageHeader.jsx';

const CryptoScanner = () => {
  const [address, setAddress] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = (e) => {
    e.preventDefault();
    if (!address) return;
    
    setIsScanning(true);
    setResult(null);

    // Simulate blockchain scan
    setTimeout(() => {
      setIsScanning(false);
      // Hardcoded "Honeypot" result for the demo
      setResult({
        status: 'DANGEROUS',
        score: 98,
        contract: address,
        name: 'PepeSafe Moon (PPSM)',
        threats: [
          { name: 'Hidden Mint Function', desc: 'Contract owner can mint infinite tokens, diluting value to zero.' },
          { name: 'Sell Tax 100%', desc: 'A honeypot trap. You can buy the token, but the contract prevents you from ever selling it.' },
          { name: 'Liquidity Not Locked', desc: 'The developer can pull all funds from the liquidity pool at any time (Rug Pull).' }
        ]
      });
    }, 4500); // Wait 4.5 seconds to show off the loading animation
  };

  const loadSample = () => {
    setAddress('0x4b78... (Malicious Honeypot Contract)');
  };

  return (
    <div className="page-container">
      <PageHeader
        icon="🪙"
        title="Web3 / Crypto Scanner"
        description="Detect Wallet Drainers, Honeypots, and Malicious Smart Contracts before you sign a transaction."
      />

      {!isScanning && !result && (
        <section className="tool card" style={{ maxWidth: '800px', margin: '0 auto', marginTop: '2rem' }}>
          <form onSubmit={handleScan}>
            <div className="analyzer-header" style={{ marginBottom: '1rem' }}>
              <label className="analyzer-label">
                SMART CONTRACT OR WALLET ADDRESS
              </label>
            </div>
            <div className="pw-field">
              <input 
                type="text" 
                className="pw-input"
                placeholder="Paste Ethereum, BSC, or Polygon address (0x...)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ width: '100%', paddingLeft: '1rem' }}
                spellCheck="false"
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
              <button type="button" onClick={loadSample} className="tool-btn">
                [TRY A DEMO CONTRACT]
              </button>
              <button type="submit" className="action-btn primary" disabled={!address}>
                AUDIT CONTRACT
              </button>
            </div>
          </form>
        </section>
      )}

      {isScanning && (
        <LoadingState 
          message="Auditing Smart Contract..." 
          subMessage="Decompiling EVM bytecode and scanning for honeypot signatures..." 
        />
      )}

      {result && (
        <div className="result-container" style={{ marginTop: '2rem', maxWidth: '800px', margin: '2rem auto 0 auto' }}>
          <div className="card" style={{ borderColor: 'var(--danger)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <div style={{ fontSize: '3rem' }}>🚨</div>
              <div>
                <h2 style={{ color: 'var(--danger)', margin: '0 0 0.5rem 0' }}>CRITICAL THREAT DETECTED</h2>
                <p>This smart contract contains highly malicious code signatures consistent with a Honeypot / Rug Pull.</p>
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderLeft: '4px solid var(--danger)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>CONTRACT NAME:</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>{result.name}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '2rem' }}>
            <h3 className="block-title" style={{ marginTop: 0 }}>AUDIT FINDINGS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
              {result.threats.map((threat, index) => (
                <div key={index} style={{ padding: '1rem', border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)' }}>
                  <h4 style={{ color: 'var(--danger)', margin: '0 0 0.5rem 0' }}>[X] {threat.name}</h4>
                  <p style={{ margin: 0, color: 'var(--text)' }}>{threat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <button onClick={() => {setResult(null); setAddress('');}} className="action-btn">SCAN ANOTHER CONTRACT</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoScanner;
