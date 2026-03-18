import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import type { Journal } from '../model/types.ts';

interface LogEntry extends Journal {
  jou_auteur_id?: string;
}

const TableauLogsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof LogEntry;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'jou_date', direction: 'descending' });

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(
            `http://localhost:8081/api/journal/tableau/${id}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
        );
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error("Erreur lors du chargement des logs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchLogs();
  }, [id]);

  const getStatusColor = (etat: string) => {
    switch (etat) {
      case 'SUCCESS': return '#4CAF50';
      case 'ERROR': return '#F44336';
      case 'WARNING': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE_TABLEAU':
      case 'CREATE_LIST':
      case 'CREATE_CARD': return '#4CAF50';
      case 'DELETE_CARD':
      case 'DELETE_TABLEAU': return '#F44336';
      case 'UPDATE_CARD':
      case 'UPDATE_TABLEAU': return '#2196F3';
      case 'ADD_MEMBER': return '#FF9800';
      case 'ARCHIVE_TABLEAU': return '#9E9E9E';
      default: return '#607D8B';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'CREATE_TABLEAU': return 'Création de tableau';
      case 'CREATE_LIST': return 'Création de liste';
      case 'CREATE_CARD': return 'Création de carte';
      case 'UPDATE_CARD': return 'Modification de carte';
      case 'UPDATE_TABLEAU': return 'Modification de tableau';
      case 'DELETE_CARD': return 'Suppression de carte';
      case 'DELETE_TABLEAU': return 'Suppression de tableau';
      case 'ADD_MEMBER': return 'Ajout de membre';
      case 'ARCHIVE_TABLEAU': return 'Archivage de tableau';
      default: return action;
    }
  };

  const handleSort = (key: keyof LogEntry) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedLogs = useMemo(() => {
    const sortableLogs = [...logs];
    if (sortConfig !== null) {
      sortableLogs.sort((a, b) => {
        if (sortConfig.key === 'jou_date') {
          const dateA = new Date(a.jou_date).getTime();
          const dateB = new Date(b.jou_date).getTime();
          return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
        }
        if (typeof a[sortConfig.key] === 'string' && typeof b[sortConfig.key] === 'string') {
          return sortConfig.direction === 'ascending'
              ? (a[sortConfig.key] as string).localeCompare(b[sortConfig.key] as string)
              : (b[sortConfig.key] as string).localeCompare(a[sortConfig.key] as string);
        }
        return 0;
      });
    }
    return sortableLogs;
  }, [logs, sortConfig]);

  const filteredLogs = sortedLogs.filter(log =>
      log.jou_titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.jou_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.jou_auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getActionLabel(log.jou_action).toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(log.jou_date).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSortIndicator = (key: keyof LogEntry) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>Logs du tableau</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
                type="button"
                onClick={() => navigate(`/api/tableau/${id}`)}
                style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Retour au tableau
            </button>
            <button
                type="button"
                onClick={() => navigate('/api/compte')}
                style={{ padding: '8px 16px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Mon compte
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <input
              type="text"
              placeholder="Rechercher dans les logs (titre, description, auteur, action, date)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
          />
        </div>

        {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <div style={{
                border: '4px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '50%',
                borderTop: '4px solid #3498db',
                width: '40px',
                height: '40px',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px'
              }}></div>
              <p>Chargement des logs...</p>
            </div>
        ) : filteredLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
              <p>Aucun log trouvé.</p>
            </div>
        ) : (
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
                  <th
                      style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50', fontSize: '14px', cursor: 'pointer' }}
                      onClick={() => handleSort('jou_date')}
                  >
                    DATE ET HEURE {getSortIndicator('jou_date')}
                  </th>
                  <th
                      style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50', fontSize: '14px', cursor: 'pointer' }}
                      onClick={() => handleSort('jou_titre')}
                  >
                    TITRE {getSortIndicator('jou_titre')}
                  </th>
                  <th
                      style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50', fontSize: '14px', cursor: 'pointer' }}
                      onClick={() => handleSort('jou_action')}
                  >
                    ACTION {getSortIndicator('jou_action')}
                  </th>
                  <th
                      style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50', fontSize: '14px', cursor: 'pointer' }}
                      onClick={() => handleSort('jou_auteur')}
                  >
                    AUTEUR {getSortIndicator('jou_auteur')}
                  </th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                    DESCRIPTION
                  </th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                    STATUT
                  </th>
                </tr>
                </thead>
                <tbody>
                {filteredLogs.map((log) => (
                    <tr
                        key={log.jou_id}
                        style={{ borderBottom: '1px solid #eee', transition: 'background-color 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <td style={{ padding: '12px 15px', color: '#666', fontSize: '13px' }}>
                        {new Date(log.jou_date).toLocaleString('fr-FR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td style={{ padding: '12px 15px' }}>
                        <div style={{ fontWeight: '500', color: '#2c3e50' }}>{log.jou_titre}</div>
                      </td>
                      <td style={{ padding: '12px 15px' }}>
                        <div style={{
                          padding: '4px 8px',
                          backgroundColor: `${getActionColor(log.jou_action)}20`,
                          color: getActionColor(log.jou_action),
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500',
                          display: 'inline-block'
                        }}>
                          {getActionLabel(log.jou_action)}
                        </div>
                      </td>
                      <td style={{ padding: '12px 15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            backgroundColor: '#e3f2fd',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: '#1976d2'
                          }}>
                            {log.jou_auteur.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ fontWeight: '500', color: '#2c3e50' }}>{log.jou_auteur}</div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 15px', color: '#555', fontSize: '14px' }}>
                        {log.jou_description}
                      </td>
                      <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                        <div style={{
                          padding: '4px 8px',
                          backgroundColor: `${getStatusColor(log.jou_etat)}20`,
                          color: getStatusColor(log.jou_etat),
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          display: 'inline-block'
                        }}>
                          {log.jou_etat === 'SUCCESS' ? 'Succès' :
                              log.jou_etat === 'ERROR' ? 'Erreur' :
                                  log.jou_etat === 'WARNING' ? 'Avertissement' : log.jou_etat}
                        </div>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}

        <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
      </div>
  );
};

export default TableauLogsPage;