import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Journal } from '../model/types.ts';
import { journalApi } from '../api/apiClient.ts';

const TableauLogsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Journal; direction: 'asc' | 'desc' } | null>(
      { key: 'jou_date', direction: 'desc' }
  );

  useEffect(() => {
    if (!id) return;
    journalApi.getByTableau(id)
        .then(data => setLogs(data as Journal[]))
        .catch(err => console.error('Erreur logs:', err))
        .finally(() => setLoading(false));
  }, [id]);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Création':    return '#4CAF50';
      case 'Suppression': return '#F44336';
      case 'Modification':return '#2196F3';
      case 'Déplacement': return '#FF9800';
      default:            return '#607D8B';
    }
  };

  const handleSort = (key: keyof Journal) => {
    setSortConfig(prev =>
        prev?.key === key
            ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
            : { key, direction: 'asc' }
    );
  };

  const sorted = useMemo(() => {
    const arr = [...logs];
    if (!sortConfig) return arr;
    return arr.sort((a, b) => {
      if (sortConfig.key === 'jou_date') {
        const diff = new Date(a.jou_date).getTime() - new Date(b.jou_date).getTime();
        return sortConfig.direction === 'asc' ? diff : -diff;
      }
      const va = String(a[sortConfig.key] ?? '');
      const vb = String(b[sortConfig.key] ?? '');
      return sortConfig.direction === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }, [logs, sortConfig]);

  const filtered = sorted.filter(log =>
      [log.jou_titre, log.jou_description, log.jou_auteur, log.jou_action]
          .some(v => v?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const arrow = (key: keyof Journal) =>
      sortConfig?.key === key ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : '';

  return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>Logs du tableau</h1>
          <button type="button" onClick={() => navigate(`/api/tableau/${id}`)}
                  style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Retour au tableau
          </button>
        </div>

        <input type="text" placeholder="Rechercher..." value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               style={{ width: '100%', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', marginBottom: '20px' }} />

        {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <div style={{ border: '4px solid rgba(0,0,0,0.1)', borderRadius: '50%', borderTop: '4px solid #3498db', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
              <p>Chargement des logs...</p>
            </div>
        ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>Aucun log trouvé.</div>
        ) : (
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  {[['jou_date', 'Date'], ['jou_titre', 'Titre'], ['jou_action', 'Action'], ['jou_auteur', 'Auteur']].map(([key, label]) => (
                      <th key={key} onClick={() => handleSort(key as keyof Journal)}
                          style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50', cursor: 'pointer' }}>
                        {label}{arrow(key as keyof Journal)}
                      </th>
                  ))}
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Description</th>
                </tr>
                </thead>
                <tbody>
                {filtered.map(log => (
                    <tr key={log.jou_id} style={{ borderBottom: '1px solid #eee' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}>
                      <td style={{ padding: '12px 15px', color: '#666', fontSize: '13px' }}>
                        {new Date(log.jou_date).toLocaleString('fr-FR')}
                      </td>
                      <td style={{ padding: '12px 15px', fontWeight: '500', color: '#2c3e50' }}>{log.jou_titre}</td>
                      <td style={{ padding: '12px 15px' }}>
                    <span style={{ padding: '4px 8px', backgroundColor: `${getActionColor(log.jou_action)}20`, color: getActionColor(log.jou_action), borderRadius: '4px', fontSize: '12px' }}>
                      {log.jou_action}
                    </span>
                      </td>
                      <td style={{ padding: '12px 15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: '#1976d2' }}>
                            {log.jou_auteur?.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ color: '#2c3e50' }}>{log.jou_auteur}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 15px', color: '#555', fontSize: '14px' }}>{log.jou_description}</td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}
        <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
      </div>
  );
};

export default TableauLogsPage;