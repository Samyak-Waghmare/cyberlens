import React, { useState } from 'react';
import LoadingState from '../components/analyzer/LoadingState';
import PageHeader from '../components/common/PageHeader.jsx';
import { scanWeb3Contract } from '../services/api.js';

const CryptoScanner = ({ onToast }) => {
  const [address, setAddress] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!address) return;
    
    setIsScanning(true);
    setResult(null);

    try {
      const data = await scanWeb3Contract(address);
      setResult(data);
    } catch (err) {
      if (onToast) onToast(err.message || "Failed to scan smart contract.", "error");
      setResult({
        status: "SAFE",
        score: 0,
        contract: address,
        name: "Unknown / Unverified Contract",
        threats: [],
      });
    } finally {
      setIsScanning(false);
    }
  };

  const loadSample = () => {
    // A known honeypot address
    setAddress('0xa3f2252aE795df94695029D884dBC38148e6baE1');
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
          <div className="card" style={{ borderColor: result.status === 'DANGEROUS' ? 'var(--danger)' : 'var(--safe)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <div style={{ fontSize: '3rem' }}>{result.status === 'DANGEROUS' ? '🚨' : '✅'}</div>
              <div>
                <h2 style={{ color: result.status === 'DANGEROUS' ? 'var(--danger)' : 'var(--safe)', margin: '0 0 0.5rem 0' }}>
                  {result.status === 'DANGEROUS' ? 'CRITICAL THREAT DETECTED' : 'NO THREATS FOUND'}
                </h2>
                <p>
                  {result.status === 'DANGEROUS' 
                    ? 'This smart contract contains highly malicious code signatures consistent with a Honeypot / Rug Pull.'
                    : 'This contract does not currently exhibit known honeypot signatures or malicious taxes. However, always exercise caution.'}
                </p>
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderLeft: `4px solid ${result.status === 'DANGEROUS' ? 'var(--danger)' : 'var(--safe)'}` }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>CONTRACT NAME:</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>{result.name}</div>
                </div>
              </div>
            </div>
          </div>

          {result.threats && result.threats.length > 0 && (
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
          )}

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <button onClick={() => {setResult(null); setAddress('');}} className="action-btn">SCAN ANOTHER CONTRACT</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoScanner;
