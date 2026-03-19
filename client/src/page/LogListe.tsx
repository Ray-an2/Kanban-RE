import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Tableau } from '../model/types.ts';
import { tableauApi, journalApi } from '../api/apiClient.ts';

interface BoardWithLogs extends Tableau {
  logsCount: number;
  lastLogDate?: string;
}

const AdminLogsPage: React.FC = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState<BoardWithLogs[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tableaux = await tableauApi.getAll() as Tableau[];
        const boardsWithLogs = await Promise.all(
            tableaux.map(async (t) => {
              const [count, last] = await Promise.all([
                journalApi.countByTableau(t.tab_id).catch(() => 0),
                journalApi.lastByTableau(t.tab_id).catch(() => null),
              ]);
              return {
                ...t,
                logsCount: count as number,
                lastLogDate: (last as any)?.jou_date,
              };
            })
        );
        setBoards(boardsWithLogs);
      } catch (err) {
        console.error('Erreur chargement logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = boards.filter(b =>
      b.tab_nom.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.tab_date).getTime() - new Date(a.tab_date).getTime());

  return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>Logs par tableau</h1>
          <button type="button" onClick={() => navigate('/api/admin/tableaux')}
                  style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Retour à l'administration
          </button>
        </div>

        <input type="text" placeholder="Rechercher un tableau..." value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               style={{ width: '100%', maxWidth: '400px', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', marginBottom: '20px' }} />

        {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <div style={{ border: '4px solid rgba(0,0,0,0.1)', borderRadius: '50%', borderTop: '4px solid #3498db', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
              <p>Chargement...</p>
            </div>
        ) : (
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  {['Tableau', 'Description', 'Créé le', 'Logs', 'Dernier log', 'Statut', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>{h}</th>
                  ))}
                </tr>
                </thead>
                <tbody>
                {filtered.map(board => (
                    <tr key={board.tab_id} style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }}
                        onClick={() => navigate(`/api/tableau/${board.tab_id}/log`)}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}>
                      <td style={{ padding: '12px 15px', fontWeight: '500', color: '#2c3e50' }}>{board.tab_nom}</td>
                      <td style={{ padding: '12px 15px', color: '#555', fontSize: '14px' }}>{board.tab_description ?? '—'}</td>
                      <td style={{ padding: '12px 15px', color: '#666', fontSize: '13px' }}>{new Date(board.tab_date).toLocaleDateString('fr-FR')}</td>
                      <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                    <span style={{ padding: '4px 8px', backgroundColor: '#E3F2FD', color: '#1976D2', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                      {board.logsCount}
                    </span>
                      </td>
                      <td style={{ padding: '12px 15px', color: '#666', fontSize: '13px' }}>
                        {board.lastLogDate ? new Date(board.lastLogDate).toLocaleDateString('fr-FR') : '—'}
                      </td>
                      <td style={{ padding: '12px 15px' }}>
                    <span style={{ color: board.tab_etat === 'O' ? '#4CAF50' : '#9E9E9E', backgroundColor: board.tab_etat === 'O' ? '#E8F5E9' : '#FAFAFA', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                      {board.tab_etat === 'O' ? 'OUVERT' : 'FERME'}
                    </span>
                      </td>
                      <td style={{ padding: '12px 15px' }}>
                        <button type="button" onClick={e => { e.stopPropagation(); navigate(`/api/tableau/${board.tab_id}/log`); }}
                                style={{ padding: '6px 12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                          Voir les logs
                        </button>
                      </td>
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

export default AdminLogsPage;