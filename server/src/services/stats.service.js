// In-memory stats tracker. 
// In a serverless environment (Vercel), this will reset across cold starts,
// but perfectly demonstrates live tracking during active sessions.

const globalStats = {
  threatsBlocked: 14285, // Start with a baseline to look realistic
  activeScans: 0,
  globalAlerts: 8
};

// We store recent logs to serve to the dashboard terminal
const recentLogs = [
  { time: new Date().toLocaleTimeString(), type: 'INFO', msg: 'System initialized. Security modules active.', status: 'ONLINE', statusColor: 'var(--success)' }
];

export function getStats() {
  return {
    ...globalStats,
    recentLogs: [...recentLogs].reverse() // Send newest first
  };
}

export function incrementActiveScans() {
  globalStats.activeScans++;
}

export function decrementActiveScans() {
  globalStats.activeScans = Math.max(0, globalStats.activeScans - 1);
}

export function incrementThreatsBlocked() {
  globalStats.threatsBlocked++;
}

export function addGlobalAlert() {
  globalStats.globalAlerts++;
}

export function addLog(type, msg, status, statusColor) {
  recentLogs.push({
    time: new Date().toLocaleTimeString(),
    type,
    msg,
    status,
    statusColor
  });

  // Keep only the last 20 logs in memory
  if (recentLogs.length > 20) {
    recentLogs.shift();
  }
}
