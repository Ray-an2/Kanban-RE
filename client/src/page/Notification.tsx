import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '../model/types.ts';
import { notificationApi } from '../api/apiClient.ts';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    notificationApi.getAll()
        .then(data => setNotifications(data as Notification[]))
        .catch(err => setError(err instanceof Error ? err.message : 'Erreur'))
        .finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      // NotificationDto.etat : 'L' = Lu, 'N' = Non lu
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, etat: 'L' as const } : n));
    } catch (err) {
      console.error('Erreur markAsRead:', err);
    }
  };

  const deleteNotif = async (id: string) => {
    try {
      await notificationApi.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Erreur delete:', err);
    }
  };

  if (loading) return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ border: '4px solid rgba(0,0,0,0.1)', borderRadius: '50%', borderTop: '4px solid #3498db', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
        <p>Chargement des notifications...</p>
        <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
      </div>
  );

  return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>Mes Notifications</h1>
          <button type="button" onClick={() => navigate('/api/tableau')}
                  style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Retour
          </button>
        </div>

        {error && (
            <div style={{ padding: '15px', backgroundColor: '#fdecea', borderRadius: '8px', color: '#e74c3c', marginBottom: '20px' }}>{error}</div>
        )}

        {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>Aucune notification.</div>
        ) : (
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              {notifications.map(n => (
                  <div key={n.id}
                       style={{
                         padding: '15px 20px', borderBottom: '1px solid #eee',
                         display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                         // etat 'N' = Non lu → fond légèrement coloré
                         backgroundColor: n.etat === 'N' ? '#f8f9fa' : 'white',
                         cursor: n.lien ? 'pointer' : 'default',
                       }}
                       onClick={() => { if (n.lien) { navigate(n.lien); markAsRead(n.id); } }}>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        {n.etat === 'N' && (
                            <div style={{ width: '8px', height: '8px', backgroundColor: '#3498db', borderRadius: '50%', marginRight: '10px', flexShrink: 0 }}></div>
                        )}
                        <h3 style={{ margin: 0, color: '#333', fontSize: '15px' }}>{n.titre}</h3>
                      </div>
                      <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>
                        {new Date(n.dateCreation).toLocaleString('fr-FR')}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginLeft: '15px', flexShrink: 0 }}>
                      {n.etat === 'N' && (
                          <button type="button" onClick={e => { e.stopPropagation(); markAsRead(n.id); }}
                                  style={{ padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                            Lu
                          </button>
                      )}
                      <button type="button" onClick={e => { e.stopPropagation(); deleteNotif(n.id); }}
                              style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                        ×
                      </button>
                    </div>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
};

export default Notifications;