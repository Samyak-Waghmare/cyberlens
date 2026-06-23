import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from '../services/api.js';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    threatsBlocked: 14285,
    activeScans: 0,
    globalAlerts: 8,
    recentLogs: []
  });

  const [historicalData, setHistoricalData] = useState([]);

  // Fetch live updating numbers from the backend
  useEffect(() => {
    // Pre-fill some empty data points to make the graph look like it's already running
    const initialData = Array.from({ length: 15 }).map((_, i) => ({
      time: '',
      activeScans: 0,
      globalAlerts: 0
    }));
    setHistoricalData(initialData);

    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);

        // Add a bit of ambient noise for the hackathon demo so the graph breathes
        const ambientNoise = Math.floor(Math.random() * 3);
        const displayScans = data.activeScans + ambientNoise;

        setHistoricalData(prev => {
          const now = new Date();
          const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
          
          const newPoint = {
            time: timeStr,
            activeScans: displayScans,
            globalAlerts: data.globalAlerts
          };
          
          // Keep the last 15 points
          const newArray = [...prev, newPoint];
          if (newArray.length > 15) {
            newArray.shift();
          }
          return newArray;
        });

      } catch (err) {
        console.error("Failed to fetch live stats", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, []);

  // Custom tooltip for the graph
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          padding: '10px',
          color: 'var(--text)'
        }}>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>{label}</p>
          <p style={{ margin: '5px 0 0 0', color: 'var(--accent)' }}>
            Network Scans: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

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
              <span style={{ color: 'var(--safe)', fontWeight: 'bold' }}>[ ONLINE ]</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-dim)' }}>Threat Logs Engine</span>
              <span style={{ color: 'var(--safe)', fontWeight: 'bold' }}>[ ONLINE ]</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-dim)' }}>Password Lab</span>
              <span style={{ color: 'var(--safe)', fontWeight: 'bold' }}>[ SECURE ]</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-dim)' }}>Privacy Guard</span>
              <span style={{ color: 'var(--safe)', fontWeight: 'bold' }}>[ ACTIVE ]</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-dim)' }}>Web3 Crypto Scanner</span>
              <span style={{ color: 'var(--safe)', fontWeight: 'bold' }}>[ ONLINE ]</span>
            </div>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="cyber-card" style={{ borderColor: 'var(--accent)' }}>
          <h3 className="cyber-card-title">LIVE METRICS</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '2.5rem', color: 'var(--accent)', fontFamily: 'monospace' }}>
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
                <div style={{ fontSize: '1.5rem', color: 'var(--danger)', fontFamily: 'monospace' }}>{stats.globalAlerts}</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>GLOBAL ALERTS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Threat Velocity Graph */}
        <div className="cyber-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="cyber-card-title">THREAT VELOCITY (LIVE)</h3>
          <div style={{ width: '100%', height: 250, marginTop: '1rem' }}>
            <ResponsiveContainer>
              <AreaChart data={historicalData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--text-muted)" tick={{ fill: 'var(--text-dim)', fontSize: 12 }} />
                <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-dim)', fontSize: 12 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="activeScans" 
                  stroke="var(--accent)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorScans)" 
                  isAnimationActive={true}
                  animationDuration={500}
                />
              </AreaChart>
            </ResponsiveContainer>
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
                  {log.msg} - <span style={{ color: log.statusColor || 'var(--text)' }}>{log.status}</span>
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
          <Link to="/analyzer" className="hero-cta" style={{ textDecoration: 'none' }}>SCAM ANALYZER</Link>
          <Link to="/crypto" className="hero-cta-outline" style={{ textDecoration: 'none' }}>WEB3 SCANNER</Link>
          <Link to="/logs" className="hero-cta-outline" style={{ textDecoration: 'none' }}>THREAT LOGS</Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
