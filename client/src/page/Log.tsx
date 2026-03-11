import React from 'react';

const Log: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Historique des logs</h1>
      <button onClick={() => window.history.back()}>Retour au Kanban</button>
      <ul>
        <li>Log 1: Action effectuée à 10:00</li>
        <li>Log 2: Action effectuée à 11:00</li>
      </ul>
    </div>
  );
};

export default Log;
