import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  date: string;
  read: boolean;
  relatedTo: {
    type: 'board' | 'card' | 'user' | 'system';
    id: string;
    name: string;
  };
}

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);

  // Données simulées pour les notifications
  useEffect(() => {
    // Simulation de chargement
    const timer = setTimeout(() => {
      setNotifications([
        {
          id: '1',
          title: 'Nouvelle carte assignée',
          message: 'Vous avez été assigné à la carte "Implémenter l\'API de paiement" dans le tableau "Projet Alpha"',
          type: 'info',
          date: '12/03/2026 14:30',
          read: false,
          relatedTo: { type: 'card', id: 'card-42', name: 'Implémenter l\'API de paiement' }
        },
        {
          id: '2',
          title: 'Tableau mis à jour',
          message: 'Le tableau "Marketing 2026" a été modifié par Marie Martin. Une nouvelle colonne "Validation" a été ajoutée.',
          type: 'info',
          date: '11/03/2026 10:15',
          read: true,
          relatedTo: { type: 'board', id: 'board-2', name: 'Marketing 2026' }
        },
        {
          id: '3',
          title: 'Échéance proche',
          message: 'La carte "Corriger bug #42" dans le tableau "Support Client" arrive à échéance demain.',
          type: 'warning',
          date: '10/03/2026 16:45',
          read: false,
          relatedTo: { type: 'card', id: 'card-17', name: 'Corriger bug #42' }
        },
        {
          id: '4',
          title: 'Nouveau membre',
          message: 'Pierre Durand a rejoint le tableau "Projet Alpha".',
          type: 'success',
          date: '09/03/2026 09:30',
          read: true,
          relatedTo: { type: 'board', id: 'board-1', name: 'Projet Alpha' }
        },
        {
          id: '5',
          title: 'Maintenance prévue',
          message: 'Une maintenance du système est prévue le 15/03/2026 de 2h à 4h. Certains services pourraient être indisponibles.',
          type: 'warning',
          date: '08/03/2026 14:00',
          read: false,
          relatedTo: { type: 'system', id: 'system', name: 'Système' }
        },
        {
          id: '6',
          title: 'Carte complétée',
          message: 'La carte "Créer les endpoints backend" a été marquée comme complétée dans le tableau "Projet Alpha".',
          type: 'success',
          date: '07/03/2026 11:20',
          read: true,
          relatedTo: { type: 'card', id: 'card-12', name: 'Créer les endpoints backend' }
        },
        {
          id: '7',
          title: 'Problème de connexion',
          message: 'Une tentative de connexion a échoué depuis une nouvelle adresse IP. Si ce n\'était pas vous, veuillez vérifier votre sécurité.',
          type: 'error',
          date: '06/03/2026 16:30',
          read: false,
          relatedTo: { type: 'user', id: 'user-1', name: 'Votre compte' }
        }
      ]);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({
      ...notif,
      read: true
    })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'info': return '#2196F3';
      case 'warning': return '#FF9800';
      case 'error': return '#F44336';
      case 'success': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(notif => !notif.read);

  const unreadCount = notifications.filter(notif => !notif.read).length;

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
          type = "button"
          onClick={() => navigate('/tableau')}
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

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button
            type = "button"
            onClick={() => setFilter('all')}
            style={{
              padding: '8px 16px',
              backgroundColor: filter === 'all' ? '#3498db' : '#f1f1f1',
              color: filter === 'all' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Toutes ({notifications.length})
          </button>
          <button
            type = "button"
            onClick={() => setFilter('unread')}
            style={{
              padding: '8px 16px',
              backgroundColor: filter === 'unread' ? '#3498db' : '#f1f1f1',
              color: filter === 'unread' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            Non lues
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#f44336',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px'
              }}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            type = "button"
            onClick={markAllAsRead}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Tout marquer comme lu
          </button>
        )}
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
      ) : filteredNotifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          <p>Aucune notification {filter === 'unread' ? 'non lue' : ''} disponible.</p>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {filteredNotifications.map(notification => (
            <div
              key={notification.id}
              style={{
                padding: '15px 20px',
                borderBottom: '1px solid #eee',
                backgroundColor: notification.read ? 'white' : '#f8f9fa',
                display: 'flex',
                alignItems: 'flex-start',
                position: 'relative'
              }}
            >
              {!notification.read && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  backgroundColor: getNotificationColor(notification.type)
                }}></div>
              )}

              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: `${getNotificationColor(notification.type)}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px',
                flexShrink: 0
              }}>
                {notification.type === 'info' && 'ℹ️'}
                {notification.type === 'warning' && '⚠️'}
                {notification.type === 'error' && '❌'}
                {notification.type === 'success' && '✅'}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '16px' }}>{notification.title}</h3>
                  <span style={{ color: '#666', fontSize: '12px' }}>{notification.date}</span>
                </div>

                <p style={{ margin: '5px 0', color: '#495057' }}>{notification.message}</p>

                {notification.relatedTo.type !== 'system' && (
                  <div style={{ marginTop: '10px' }}>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: '#e3f2fd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: '#1976d2'
                    }}>
                      {notification.relatedTo.type === 'board' && '📋 Tableau'}
                      {notification.relatedTo.type === 'card' && '📇 Carte'}
                      {notification.relatedTo.type === 'user' && '👤 Utilisateur'}
                      : {notification.relatedTo.name}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {!notification.read && (
                  <button
                    type = "button"
                    onClick={() => markAsRead(notification.id)}
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
                    Marquer comme lu
                  </button>
                )}

                <button
                  type = "button"
                  onClick={() => {
                    if (notification.relatedTo.type === 'board') {
                      navigate(`/tableau/${notification.relatedTo.id}`);
                    } else if (notification.relatedTo.type === 'card') {
                      navigate(`/carte/${notification.relatedTo.id}`);
                    }
                  }}
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

                <button
                  type = "button"
                  onClick={() => deleteNotification(notification.id)}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
