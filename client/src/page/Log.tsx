import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Journal } from '../model/types.ts';

interface LogEntry extends Journal {
  jou_auteur_id: string;
  jou_auteur_pseudo: string;
}

const TableauLogsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof LogEntry;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'jou_date', direction: 'descending' });

  //à remplacer par un appel API réel
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Simulation de chargement
        await new Promise(resolve => setTimeout(resolve, 800));

        const mockLogs: LogEntry[] = [
          {
            jou_id: '1',
            jou_titre: 'Création de tableau',
            jou_description: 'Tableau "Projet Alpha" créé par Jean Dupont',
            jou_auteur: 'Jean Dupont',
            jou_auteur_id: '1',
            jou_auteur_pseudo: 'jdupont',
            jou_action: 'CREATE_TABLEAU',
            jou_date: '2026-03-12T14:30:00',
            jou_etat: 'SUCCESS'
          },
          {
            jou_id: '2',
            jou_titre: 'Ajout de membre',
            jou_description: 'Marie Martin ajoutée au tableau par Jean Dupont',
            jou_auteur: 'Jean Dupont',
            jou_auteur_id: '1',
            jou_auteur_pseudo: 'jdupont',
            jou_action: 'ADD_MEMBER',
            jou_date: '2026-03-11T10:15:00',
            jou_etat: 'SUCCESS'
          },
          {
            jou_id: '3',
            jou_titre: 'Modification de carte',
            jou_description: 'Carte "Implémenter API" modifiée par Marie Martin',
            jou_auteur: 'Marie Martin',
            jou_auteur_id: '2',
            jou_auteur_pseudo: 'mmartin',
            jou_action: 'UPDATE_CARD',
            jou_date: '2026-03-10T16:45:00',
            jou_etat: 'SUCCESS'
          },
          {
            jou_id: '4',
            jou_titre: 'Suppression de carte',
            jou_description: 'Carte "Ancienne tâche" supprimée par Pierre Durand',
            jou_auteur: 'Pierre Durand',
            jou_auteur_id: '3',
            jou_auteur_pseudo: 'pdurand',
            jou_action: 'DELETE_CARD',
            jou_date: '2026-03-09T09:30:00',
            jou_etat: 'SUCCESS'
          },
          {
            jou_id: '5',
            jou_titre: 'Archivage de tableau',
            jou_description: 'Tableau "Ancien Projet" archivé par Sophie Lambert',
            jou_auteur: 'Sophie Lambert',
            jou_auteur_id: '4',
            jou_auteur_pseudo: 'slambert',
            jou_action: 'ARCHIVE_TABLEAU',
            jou_date: '2026-03-08T14:00:00',
            jou_etat: 'SUCCESS'
          },
          {
            jou_id: '6',
            jou_titre: 'Création de liste',
            jou_description: 'Liste "À faire" créée par Jean Dupont',
            jou_auteur: 'Jean Dupont',
            jou_auteur_id: '1',
            jou_auteur_pseudo: 'jdupont',
            jou_action: 'CREATE_LIST',
            jou_date: '2026-03-07T11:20:00',
            jou_etat: 'SUCCESS'
          },
          {
            jou_id: '7',
            jou_titre: 'Modification de description',
            jou_description: 'Description du tableau mise à jour par Marie Martin',
            jou_auteur: 'Marie Martin',
            jou_auteur_id: '2',
            jou_auteur_pseudo: 'mmartin',
            jou_action: 'UPDATE_TABLEAU',
            jou_date: '2026-03-06T15:45:00',
            jou_etat: 'SUCCESS'
          }
        ];

        setLogs(mockLogs);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des logs:", error);
        setLoading(false);
      }
    };

    fetchLogs();
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
    log.jou_auteur_pseudo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getActionLabel(log.jou_action).toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(log.jou_date).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSortIndicator = (key: keyof LogEntry) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '30px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: 0, color: '#2c3e50' }}>Logs du tableau</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type = "button"
            onClick={() => navigate(`/api/tableau/${id}`)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retour au tableau
          </button>
          <button
            type = "button"
            onClick={() => navigate('/api/compte')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Mon compte
          </button>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
        gap: '20px'
      }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="Rechercher dans les logs (titre, description, auteur, action, date)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 15px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
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
      ) : (
        <>
          {filteredLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
              <p>Aucun log trouvé correspondant à votre recherche.</p>
            </div>
          ) : (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#f8f9fa',
                    borderBottom: '2px solid #e9ecef'
                  }}>
                    <th
                      style={{
                        padding: '15px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#2c3e50',
                        fontSize: '14px',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                      onClick={() => handleSort('jou_date')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>DATE ET HEURE</span>
                        {getSortIndicator('jou_date') && (
                          <span style={{ marginLeft: '5px', fontSize: '16px' }}>
                            {getSortIndicator('jou_date')}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      style={{
                        padding: '15px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#2c3e50',
                        fontSize: '14px',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                      onClick={() => handleSort('jou_titre')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>TITRE</span>
                        {getSortIndicator('jou_titre') && (
                          <span style={{ marginLeft: '5px', fontSize: '16px' }}>
                            {getSortIndicator('jou_titre')}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      style={{
                        padding: '15px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#2c3e50',
                        fontSize: '14px',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                      onClick={() => handleSort('jou_action')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>ACTION</span>
                        {getSortIndicator('jou_action') && (
                          <span style={{ marginLeft: '5px', fontSize: '16px' }}>
                            {getSortIndicator('jou_action')}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      style={{
                        padding: '15px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#2c3e50',
                        fontSize: '14px',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                      onClick={() => handleSort('jou_auteur')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>AUTEUR</span>
                        {getSortIndicator('jou_auteur') && (
                          <span style={{ marginLeft: '5px', fontSize: '16px' }}>
                            {getSortIndicator('jou_auteur')}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      style={{
                        padding: '15px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#2c3e50',
                        fontSize: '14px'
                      }}
                    >
                      DESCRIPTION
                    </th>
                    <th
                      style={{
                        padding: '15px',
                        textAlign: 'center',
                        fontWeight: '600',
                        color: '#2c3e50',
                        fontSize: '14px'
                      }}
                    >
                      STATUT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.jou_id}
                      style={{
                        borderBottom: '1px solid #eee',
                        transition: 'background-color 0.2s'
                      }}
                      onClick={() => {}}
                    >
                      <td style={{ padding: '12px 15px' }}>
                        <div style={{ color: '#666', fontSize: '13px' }}>
                          {new Date(log.jou_date).toLocaleString('fr-FR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
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
                            {log.jou_auteur_pseudo.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: '500', color: '#2c3e50' }}>{log.jou_auteur}</div>
                            <div style={{ color: '#666', fontSize: '12px' }}>@{log.jou_auteur_pseudo}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 15px' }}>
                        <div style={{ color: '#555', fontSize: '14px' }}>{log.jou_description}</div>
                      </td>
                      <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                        <div style={{
                          padding: '4px 8px',
                          backgroundColor: `${getStatusColor(log.jou_etat)}20`,
                          color: getStatusColor(log.jou_etat),
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
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
        </>
      )}
    </div>
  );
};

export default TableauLogsPage;
