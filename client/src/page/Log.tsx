import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LogEntry {
  action: string;
  utilisateur: string;
  date: string;
  description: string;
}

const Log: React.FC = () => {
  const navigate = useNavigate();

  // Données en dur pour les logs
  const logs: LogEntry[] = [
    {
      action: 'Création de tableau',
      utilisateur: 'Jean Dupont',
      date: '12/03/2026 14:30',
      description: 'Tableau "Projet Alpha" créé avec 3 colonnes par défaut'
    },
    {
      action: 'Déplacement de carte',
      utilisateur: 'Marie Martin',
      date: '12/03/2026 10:15',
      description: 'Carte "Implémenter API" déplacée de "À faire" vers "En cours"'
    },
    {
      action: 'Modification de carte',
      utilisateur: 'Jean Dupont',
      date: '11/03/2026 16:45',
      description: 'Carte "Corriger bug #42" - description mise à jour et date limite modifiée'
    },
    {
      action: 'Suppression de carte',
      utilisateur: 'Admin',
      date: '11/03/2026 09:30',
      description: 'Carte "Ancienne tâche" supprimée du tableau "Archive"'
    },
    {
      action: 'Ajout de membre',
      utilisateur: 'Marie Martin',
      date: '10/03/2026 11:20',
      description: 'Pierre Durand ajouté au tableau "Projet Alpha" avec rôle "Contributeur"'
    },
    {
      action: 'Création de colonne',
      utilisateur: 'Jean Dupont',
      date: '09/03/2026 15:10',
      description: 'Colonne "Validation" ajoutée au tableau "Projet Alpha"'
    },
    {
      action: 'Modification de tableau',
      utilisateur: 'Admin',
      date: '08/03/2026 14:00',
      description: 'Nom du tableau "Projet Bêta" renommé en "Projet Gamma"'
    },
    {
      action: 'Archivage de tableau',
      utilisateur: 'Marie Martin',
      date: '07/03/2026 16:30',
      description: 'Tableau "Ancien projet" archivé'
    }
  ];

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1000px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>Historique des logs</h1>
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
        >
          Retour au Kanban
        </button>
      </div>

      {logs.length === 0 ? (
        <p>Aucun log disponible.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#ffffff'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#2c3e50',
                color: '#ffffff'
              }}>
                <th style={{
                  padding: '12px 15px',
                  textAlign: 'left',
                  fontWeight: '600'
                }}>Action</th>
                <th style={{
                  padding: '12px 15px',
                  textAlign: 'left',
                  fontWeight: '600'
                }}>Utilisateur</th>
                <th style={{
                  padding: '12px 15px',
                  textAlign: 'left',
                  fontWeight: '600'
                }}>Date</th>
                <th style={{
                  padding: '12px 15px',
                  textAlign: 'left',
                  fontWeight: '600'
                }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log: LogEntry, index: number) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#e9ecef',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d4edda'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#f8f9fa' : '#e9ecef'}
                >
                  <td style={{
                    padding: '12px 15px',
                    borderBottom: '1px solid #dee2e6',
                    color: '#212529'
                  }}>{log.action}</td>
                  <td style={{
                    padding: '12px 15px',
                    borderBottom: '1px solid #dee2e6',
                    color: '#212529'
                  }}>{log.utilisateur}</td>
                  <td style={{
                    padding: '12px 15px',
                    borderBottom: '1px solid #dee2e6',
                    color: '#212529'
                  }}>{log.date}</td>
                  <td style={{
                    padding: '12px 15px',
                    borderBottom: '1px solid #dee2e6',
                    color: '#212529'
                  }}>{log.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Log;
