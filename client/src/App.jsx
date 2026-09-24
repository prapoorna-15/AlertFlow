import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const socket = io(SOCKET_URL);

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState('HIGH');
  const [rawLogs, setRawLogs] = useState('');

  useEffect(() => {
    axios.get(`${SOCKET_URL}/api/incidents`)
      .then(res => setIncidents(res.data.data || []))
      .catch(err => console.error("Error fetching incidents:", err));

    socket.on('INCIDENT_CREATED', (newIncident) => {
      setIncidents((prev) => [newIncident, ...prev]);
    });

    return () => socket.off('INCIDENT_CREATED');
  }, []);

  const handleCreateIncident = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${SOCKET_URL}/api/incidents`, { title, severity, rawLogs });
      setTitle('');
      setRawLogs('');
    } catch (err) {
      console.error("Failed to trigger incident:", err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1>⚡ AlertFlow — Incident Triage Center</h1>
      <p style={{ color: '#666' }}>Real-time WebSockets & Telemetry Control Room</p>

      {/* Trigger Form */}
      <form onSubmit={handleCreateIncident} style={{ background: '#f4f4f5', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3>Trigger New Incident</h3>
        <div style={{ marginBottom: '1rem' }}>
          <input 
            type="text" 
            placeholder="Incident Title (e.g., Auth Service Latency Spikes)" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
          />
          <select value={severity} onChange={(e) => setSeverity(e.target.value)} style={{ padding: '0.5rem', marginRight: '0.5rem' }}>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
          <input 
            type="text" 
            placeholder="Raw Stack Trace / System Logs" 
            value={rawLogs} 
            onChange={(e) => setRawLogs(e.target.value)} 
            style={{ width: '60%', padding: '0.5rem' }}
          />
        </div>
        <button type="submit" style={{ padding: '0.6rem 1.2rem', backgroundColor: '#e11d48', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          🚨 Dispatch Live Alert
        </button>
      </form>

      {/* Incident Stream */}
      <h3>Active Incidents ({incidents.length})</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {incidents.map((item) => (
          <div key={item.id} style={{ borderLeft: item.severity === 'CRITICAL' ? '5px solid #e11d48' : '5px solid #f59e0b', padding: '1rem', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0 }}>{item.title}</h4>
              <span style={{ fontWeight: 'bold', color: item.severity === 'CRITICAL' ? '#e11d48' : '#f59e0b' }}>{item.severity}</span>
            </div>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#444' }}><code>{item.rawLogs || 'No logs attached.'}</code></p>
          </div>
        ))}
      </div>
    </div>
  );
}