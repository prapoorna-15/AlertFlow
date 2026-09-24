import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function Home() {
  const [incidents, setIncidents] = useState([]);
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState('HIGH');
  const [rawLogs, setRawLogs] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. Fetch initial incidents list from REST API
    const fetchIncidents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/incidents`);
        if (response.data?.data) {
          setIncidents(response.data.data);
        }
      } catch (err) {
        console.error("Failed to load incidents:", err);
      }
    };

    fetchIncidents();

    // 2. Connect Socket.IO for real-time live alert streaming
    const socket = io(API_BASE_URL, {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to AlertFlow Real-Time Engine via Socket.IO');
    });

    socket.on('INCIDENT_CREATED', (newIncident) => {
      setIncidents((prev) => [newIncident, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleCreateIncident = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/incidents`, {
        title,
        severity,
        rawLogs,
      });

      setTitle('');
      setRawLogs('');
    } catch (err) {
      console.error("Failed to dispatch incident:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const getSeverityStyle = (sev) => {
    switch (sev) {
      case 'CRITICAL':
        return { borderLeft: '4px solid #dc2626', badgeColor: '#dc2626' };
      case 'HIGH':
        return { borderLeft: '4px solid #d97706', badgeColor: '#d97706' };
      case 'MEDIUM':
        return { borderLeft: '4px solid #2563eb', badgeColor: '#2563eb' };
      default:
        return { borderLeft: '4px solid #64748b', badgeColor: '#64748b' };
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      
      {/* Top Header Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a', fontWeight: '700' }}>
            ⚡ AlertFlow — Incident Triage Center
          </h1>
          <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Real-time WebSockets & Telemetry Control Room
          </p>
        </div>

        <button 
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '0.875rem',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          Log Out
        </button>
      </div>

      {/* Incident Dispatch Form */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#1e293b' }}>Trigger New Incident</h3>
        <form onSubmit={handleCreateIncident}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Incident Title (e.g., Auth Service Latency Spikes)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                flex: '1 1 300px',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              style={{
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                backgroundColor: '#ffffff',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <textarea
              placeholder="Raw Stack Trace / System Logs"
              value={rawLogs}
              onChange={(e) => setRawLogs(e.target.value)}
              rows="2"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 1.25rem',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Broadcasting...' : '🚨 Dispatch Live Alert'}
          </button>
        </form>
      </div>

      {/* Live Incidents Feed */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#0f172a' }}>
          Active Incidents ({incidents.length})
        </h3>

        {incidents.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No active incidents reported.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {incidents.map((incident) => {
              const { borderLeft, badgeColor } = getSeverityStyle(incident.severity);
              return (
                <div
                  key={incident.id || Math.random()}
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '1.25rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    borderLeft,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', fontSize: '1rem', color: '#1e293b' }}>
                      {incident.title}
                    </span>
                    <span style={{
                      fontWeight: '700',
                      fontSize: '0.75rem',
                      color: badgeColor,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {incident.severity}
                    </span>
                  </div>

                  {incident.rawLogs && (
                    <pre style={{
                      margin: 0,
                      padding: '0.5rem 0.75rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontFamily: 'monospace',
                      color: '#475569',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all'
                    }}>
                      {incident.rawLogs}
                    </pre>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}