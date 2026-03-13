import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Tableau } from '../model/types.ts';

interface BoardWithLogs extends Tableau {
  logsCount: number;
  lastLogDate?: string;
}

const AdminLogsPage: React.FC = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState<BoardWithLogs[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof BoardWithLogs; direction: 'ascending' | 'descending' } | null>({
    key: 'tab_date',
    direction: 'descending'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));

        const mockBoards: BoardWithLogs[] = [
          {
            tab_id: '1',
            tab_nom: 'Projet Alpha',
            tab_description: 'Développement de la nouvelle application mobile',
            tab_date: '2026-02-15T09:00:00',
            tab_etat: 'A',
            tab_image: null,
            logsCount: 42,
            lastLogDate: '2026-03-12T14:30:00'
          },
          {
            tab_id: '2',
            tab_nom: 'Marketing 2026',
            tab_description: 'Campagnes marketing pour le Q2 2026',
            tab_date: '2026-01-10T10:00:00',
            tab_etat: 'A',
            tab_image: null,
            logsCount: 18,
            lastLogDate: '2026-03-10T16:45:00'
          },
          {
            tab_id: '3',
            tab_nom: 'Support Client',
            tab_description: 'Gestion des tickets clients',
            tab_date: '2025-12-01T14:30:00',
            tab_etat: 'A',
            tab_image: null,
            logsCount: 87,
            lastLogDate: '2026-03-15T09:15:00'
          },
          {
            tab_id: '4',
            tab_nom: 'RH - Recrutement',
            tab_description: 'Processus de recrutement 2026',
            tab_date: '2025-11-15T11:20:00',
            tab_etat: 'A',
            tab_image: null,
            logsCount: 12,
            lastLogDate: '2026-02-28T11:30:00'
          },
          {
            tab_id: '5',
            tab_nom: 'Ancien Projet',
            tab_description: 'Projet archivé en 2025',
            tab_date: '2025-05-10T08:00:00',
            tab_etat: 'I',
            tab_image: null,
            logsCount: 124,
            lastLogDate: '2025-12-30T17:00:00'
          }
        ];

        setBoards(mockBoards);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (key: keyof BoardWithLogs) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedBoards = React.useMemo(() => {
    const sortableBoards = [...boards];
    if (sortConfig !== null) {
      sortableBoards.sort((a, b) => {
        if (sortConfig.key === 'tab_date' || sortConfig.key === 'lastLogDate') {
          const dateA = a[sortConfig.key] ? new Date(a[sortConfig.key] as string).getTime() : 0;
          const dateB = b[sortConfig.key] ? new Date(b[sortConfig.key] as string).getTime() : 0;
          return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
        }

        if (sortConfig.key === 'logsCount') {
          return sortConfig.direction === 'ascending'
            ? (a[sortConfig.key] as number) - (b[sortConfig.key] as number)
            : (b[sortConfig.key] as number) - (a[sortConfig.key] as number);
        }

        if (typeof a[sortConfig.key] === 'string' && typeof b[sortConfig.key] === 'string') {
          return sortConfig.direction === 'ascending'
            ? (a[sortConfig.key] as string).localeCompare(b[sortConfig.key] as string)
            : (b[sortConfig.key] as string).localeCompare(a[sortConfig.key] as string);
        }

        return 0;
      });
    }
    return sortableBoards;
  }, [boards, sortConfig]);

  const filteredBoards = sortedBoards.filter(board =>
    board.tab_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    board.tab_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (board.lastLogDate && new Date(board.lastLogDate).toLocaleDateString().includes(searchTerm)) ||
    board.logsCount.toString().includes(searchTerm)
  );

  const getStatusStyle = (etat: 'A' | 'I') => {
    return {
      color: etat === 'A' ? '#4CAF50' : '#9E9E9E',
      backgroundColor: etat === 'A' ? '#E8F5E9' : '#FAFAFA',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold' as const
    };
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
        <h1 style={{ margin: 0, color: '#2c3e50' }}>Logs par tableau</h1>
        <button
          type = "button"
          onClick={() => navigate('/compte')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retour à mon compte
        </button>
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
            placeholder="Rechercher un tableau..."
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
          <p>Chargement des tableaux...</p>
        </div>
      ) : (
        <>
          {filteredBoards.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
              <p>Aucun tableau trouvé correspondant à votre recherche.</p>
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
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{
                      padding: '12px 15px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontWeight: '600' as const
                    }}
                    onClick={() => handleSort('tab_nom')}>
                      Nom du tableau
                    </th>
                    <th style={{
                      padding: '12px 15px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontWeight: '600' as const
                    }}
                    onClick={() => handleSort('tab_description')}>
                      Description
                    </th>
                    <th style={{
                      padding: '12px 15px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontWeight: '600' as const
                    }}
                    onClick={() => handleSort('tab_date')}>
                      Date de création
                    </th>
                    <th style={{
                      padding: '12px 15px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      fontWeight: '600' as const
                    }}
                    onClick={() => handleSort('logsCount')}>
                      Nombre de logs
                    </th>
                    <th style={{
                      padding: '12px 15px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      fontWeight: '600' as const
                    }}
                    onClick={() => handleSort('lastLogDate')}>
                      Dernier log
                    </th>
                    <th style={{
                      padding: '12px 15px',
                      textAlign: 'center',
                      fontWeight: '600' as const
                    }}>
                      Statut
                    </th>
                    <th style={{
                      padding: '12px 15px',
                      textAlign: 'center',
                      fontWeight: '600' as const
                    }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBoards.map((board) => (
                    <tr
                      key={board.tab_id}
                      style={{
                        borderBottom: '1px solid #eee',
                        transition: 'background-color 0.2s',
                        cursor: 'pointer'
                      }}
                      onClick={() => navigate(`/tableau/${board.tab_id}/log`)}
                    >
                      <td style={{ padding: '12px 15px' }}>
                        <div style={{ fontWeight: '500', color: '#2c3e50' }}>{board.tab_nom}</div>
                      </td>
                      <td style={{ padding: '12px 15px' }}>
                        <div style={{ color: '#555', fontSize: '14px' }}>
                          {board.tab_description || 'Aucune description'}
                        </div>
                      </td>
                      <td style={{ padding: '12px 15px' }}>
                        <div style={{ color: '#666', fontSize: '13px' }}>
                          {new Date(board.tab_date).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                        <div style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          backgroundColor: '#E3F2FD',
                          color: '#1976D2',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold' as const
                        }}>
                          {board.logsCount}
                        </div>
                      </td>
                      <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                        <div style={{ color: '#666', fontSize: '13px' }}>
                          {board.lastLogDate
                            ? new Date(board.lastLogDate).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })
                            : 'Aucun log'}
                        </div>
                      </td>
                      <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                        <div style={getStatusStyle(board.tab_etat)}>
                          {board.tab_etat === 'A' ? 'ACTIF' : 'INACTIF'}
                        </div>
                      </td>
                      <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/tableau/${board.tab_id}/log`);
                          }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Voir les logs
                        </button>
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

export default AdminLogsPage;
