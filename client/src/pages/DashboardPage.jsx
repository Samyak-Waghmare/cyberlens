import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    threatsBlocked: 14285,
    activeScans: 34,
    globalAlerts: 8
  });

  // Simulate live updating numbers
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        threatsBlocked: prev.threatsBlocked + Math.floor(Math.random() * 3),
        activeScans: 20 + Math.floor(Math.random() * 20)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-container">
      <div className="cyber-header">
        <h1><span className="cyber-icon">🌐</span> SECURITY COMMAND CENTER</h1>
        <p className="cyber-subtitle">Unified Overview of All CyberLens Protection Modules</p>
      </div>

      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        
        {/* Status Panel */}
        <div className="cyber-card">
          <h3 className="cyber-card-title">SYSTEM STATUS</h3>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-dim)' }}>Scam Analyzer</span>
              <span style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>[ ONLINE ]</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-dim)' }}>Threat Logs Engine</span>
              <span style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>[ ONLINE ]</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-dim)' }}>Password Lab</span>
              <span style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>[ SECURE ]</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-dim)' }}>Privacy Guard</span>
              <span style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>[ ACTIVE ]</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-dim)' }}>Web3 Crypto Scanner</span>
              <span style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>[ ONLINE ]</span>
            </div>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="cyber-card" style={{ borderColor: 'var(--primary-color)' }}>
          <h3 className="cyber-card-title">LIVE METRICS</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '2.5rem', color: 'var(--primary-color)', fontFamily: 'monospace' }}>
                {stats.threatsBlocked.toLocaleString()}
              </div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>TOTAL THREATS NEUTRALIZED</div>
            </div>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div>
                <div style={{ fontSize: '1.5rem', color: '#fff', fontFamily: 'monospace' }}>{stats.activeScans}</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>ACTIVE SCANS</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', color: 'var(--danger-color)', fontFamily: 'monospace' }}>{stats.globalAlerts}</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>GLOBAL ALERTS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="cyber-card terminal-window" style={{ gridColumn: '1 / -1' }}>
          <div className="terminal-header">
            <span className="terminal-dot red"></span>
            <span className="terminal-dot yellow"></span>
            <span className="terminal-dot green"></span>
            <span className="terminal-title">global_threat_feed.log</span>
          </div>
          <div className="terminal-content" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <div className="log-line"><span className="log-time">[14:02:45]</span> <span className="log-info">INFO:</span> Phishing URL detected from IP 45.22.11.9 - <span style={{color: 'var(--success-color)'}}>BLOCKED</span></div>
            <div className="log-line"><span className="log-time">[14:03:12]</span> <span className="log-warn">WARN:</span> Suspicious PDF hash 8e89363e5b... submitted for analysis.</div>
            <div className="log-line"><span className="log-time">[14:05:01]</span> <span className="log-error">CRITICAL:</span> SQL Injection attempt on /login - payload: ' OR '1'='1 - <span style={{color: 'var(--success-color)'}}>NEUTRALIZED</span></div>
            <div className="log-line"><span className="log-time">[14:05:55]</span> <span className="log-info">INFO:</span> Web3 smart contract 0x7a25... scanned. Status: <span style={{color: 'var(--danger-color)'}}>HONEYPOT DETECTED</span></div>
            <div className="log-line"><span className="log-time">[14:06:20]</span> <span className="log-info">INFO:</span> Password strength check performed.</div>
            <div className="log-line"><span className="log-time">[14:07:05]</span> <span className="log-warn">WARN:</span> Multiple failed login attempts tracked from botnet proxy.</div>
            <div className="log-line"><span className="log-time">[{new Date().toLocaleTimeString()}]</span> <span className="log-info">INFO:</span> System health check complete. All modules optimal.</div>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-dim)', marginBottom: '1rem' }}>Want to scan a specific threat?</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/analyzer" className="cyber-button">SCAM ANALYZER</Link>
          <Link to="/crypto" className="cyber-button secondary">WEB3 SCANNER</Link>
          <Link to="/logs" className="cyber-button secondary">THREAT LOGS</Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
