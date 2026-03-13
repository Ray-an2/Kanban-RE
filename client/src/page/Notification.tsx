import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type{ Notification as NotificationType } from '../model/types.ts';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);

        //à remplacer par un vrai appel
        await new Promise(resolve => setTimeout(resolve, 800));

        const mockNotifications: NotificationType[] = [
          {
            not_id: '1',
            not_titre: 'Nouvelle tâche assignée',
            not_date: new Date().toISOString(),
            not_lien: '/tableau/1/carte/3',
            not_lue: 'N',
            cpt_id: '1' 
          },
          {
            not_id: '2',
            not_titre: 'Commentaire sur votre carte',
            not_date: new Date(Date.now() - 3600000).toISOString(),
            not_lien: '/tableau/2/carte/5',
            not_lue: 'N',
            cpt_id: '1'
          },
          {
            not_id: '3',
            not_titre: 'Tableau mis à jour',
            not_date: new Date(Date.now() - 86400000).toISOString(),
            not_lien: '/tableau/1',
            not_lue: 'O',
            cpt_id: '1'
          }
        ];

        setNotifications(mockNotifications);
      } catch (error) {
        console.error("Erreur lors du chargement des notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(not =>
        not.not_id === notificationId ? { ...not, not_lue: 'O' } : not
      )
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(not => not.not_id !== notificationId)
    );
  };

  if (loading) {
    return (
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
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
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
        <h1 style={{ margin: 0, color: '#2c3e50' }}>Mes Notifications</h1>
        <button
          type="button"
          onClick={() => navigate('/api/tableau')}
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

      {notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          <p>Aucune notification.</p>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          {notifications.map(notification => (
            <div
              key={notification.not_id}
              style={{
                padding: '15px 20px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: notification.not_lue === 'N' ? '#f8f9fa' : 'white',
                transition: 'background-color 0.2s'
              }}
              onClick={() => {
                if (notification.not_lien) {
                  navigate(notification.not_lien);
                  markAsRead(notification.not_id);
                }
              }}
            >
              <div style={{ flex: 1, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  {notification.not_lue === 'N' && (
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#3498db',
                      borderRadius: '50%',
                      marginRight: '10px'
                    }}></div>
                  )}
                  <h3 style={{ margin: 0, color: '#333' }}>{notification.not_titre}</h3>
                </div>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                  {new Date(notification.not_date).toLocaleString('fr-FR')}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notification.not_id);
                }}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  marginLeft: '10px'
                }}
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
