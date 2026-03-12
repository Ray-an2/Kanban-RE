import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LogEntry {
  action: string;
  utilisateur: string;
  date: string;
  description: string;
}

const Log: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logs = location.state?.logs || [];
/*//get
await fetch(VITE_API_URL/tableau/logs);*/
  return (
    <div style={{ padding: '20px' }}>
      <div className="header">
        <h1>Historique des logs</h1>
        <button
          type="button"
          className="log-button"
          onClick={() => navigate('/')}
        >
          Retour au Kanban
        </button>
      </div>

      {logs.length === 0 ? (
        <p>Aucun log disponible.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Action</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Utilisateur</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            
            {logs.map((log: LogEntry, index: number) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{log.action}</td>
                <td style={{ padding: '12px' }}>{log.utilisateur}</td>
                <td style={{ padding: '12px' }}>{log.date}</td>
                <td style={{ padding: '12px' }}>{log.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Log;
