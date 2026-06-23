import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from '../services/api.js';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    threatsBlocked: 14285,
    activeScans: 0,
    globalAlerts: 8,
    recentLogs: []
  });

  // Fetch live updating numbers from the backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch live stats", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 3000); // Poll every 3s
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
            {stats.recentLogs && stats.recentLogs.length > 0 ? (
              stats.recentLogs.map((log, i) => (
                <div className="log-line" key={i}>
                  <span className="log-time">[{log.time}]</span>{" "}
                  <span className={`log-${log.type.toLowerCase()}`}>{log.type}:</span>{" "}
                  {log.msg} - <span style={{ color: log.statusColor }}>{log.status}</span>
                </div>
              ))
            ) : (
              <div className="log-line"><span className="log-time">[{new Date().toLocaleTimeString()}]</span> <span className="log-info">INFO:</span> System health check complete. All modules optimal.</div>
            )}
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
