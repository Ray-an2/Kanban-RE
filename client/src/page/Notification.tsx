import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { NotificationWithDetails } from '../model/types.ts';

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  // Données simulées pour les notifications
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications([
        {
          not_id: '1',
          not_titre: 'Nouvelle carte assignée',
          not_date: '2026-03-12 14:30:00',
          not_lien: '/carte/card-42',
          cpt_id: '1',
          compte: {
            cpt_id: '1',
            cpt_pseudo: 'jdupont',
            cpt_mdp: '',
            cpt_role: 'admin'
          }
        },
        {
          not_id: '2',
          not_titre: 'Tableau mis à jour',
          not_date: '2026-03-11 10:15:00',
          not_lien: '/tableau/2',
          cpt_id: '2',
          compte: {
            cpt_id: '2',
            cpt_pseudo: 'mmartin',
            cpt_mdp: '',
            cpt_role: 'user'
          }
        },
        {
          not_id: '3',
          not_titre: 'Échéance proche',
          not_date: '2026-03-10 16:45:00',
          not_lien: '/carte/card-17',
          cpt_id: null,
          compte: undefined
        }
      ]);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.not_id !== id));
  };

  const getNotificationType = (title: string): string => {
    if (title.includes('Échéance') || title.includes('proche')) return 'warning';
    if (title.includes('erreur') || title.includes('problème')) return 'error';
    if (title.includes('succès') || title.includes('complétée')) return 'success';
    return 'info';
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '30px',
      fontFamily: 'Arial, sans-serif',
      color: '#333'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: 0, color: '#2c3e50' }}>Notifications</h1>
        <button
          type="button"
          onClick={() => navigate('/accueil')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retour à l'accueil
        </button>
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
          <p>Chargement des notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          <p>Aucune notification disponible.</p>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {notifications.map(notification => {
            const type = getNotificationType(notification.not_titre || '');

            return (
              <div
                key={notification.not_id}
                style={{
                  padding: '15px 20px',
                  borderBottom: '1px solid #eee',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'flex-start',
                  position: 'relative'
                }}
              >
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  backgroundColor: type === 'warning' ? '#FF9800' :
                                 type === 'error' ? '#F44336' :
                                 type === 'success' ? '#4CAF50' : '#2196F3'
                }}></div>

                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: `${type === 'warning' ? '#FF9800' :
                                    type === 'error' ? '#F44336' :
                                    type === 'success' ? '#4CAF50' : '#2196F3'}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  flexShrink: 0
                }}>
                  {type === 'info' && 'ℹ️'}
                  {type === 'warning' && '⚠️'}
                  {type === 'error' && '❌'}
                  {type === 'success' && '✅'}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '16px' }}>{notification.not_titre}</h3>
                    <span style={{ color: '#666', fontSize: '12px' }}>
                      {new Date(notification.not_date).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <p style={{ margin: '5px 0', color: '#495057' }}>
                    {notification.not_titre?.includes('assignée') ?
                     `Vous avez été assigné à une nouvelle tâche` :
                     notification.not_titre?.includes('mis à jour') ?
                     `Un tableau a été modifié` :
                     notification.not_titre}
                  </p>

                  {notification.not_lien && (
                    <div style={{ marginTop: '10px' }}>
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: '#e3f2fd',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: '#1976d2'
                      }}>
                        {notification.not_lien.includes('/carte/') ? '📇 Carte' :
                         notification.not_lien.includes('/tableau/') ? '📋 Tableau' : '🔗 Lien'}
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {notification.not_lien && (
                    <button
                      type="button"
                      onClick={() => navigate(notification.not_lien || '')}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Voir
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteNotification(notification.not_id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
