import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface CardDetails {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  assignee: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  comments: Array<{
    id: string;
    author: string;
    date: string;
    content: string;
  }>;
  checklist: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  attachments: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
}

const CardDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Données simulées pour une carte
  const [card, setCard] = useState<CardDetails>({
    id: id || '1',
    title: 'Implémenter l\'API de paiement',
    description: 'Il faut implémenter l\'API de paiement Stripe pour le nouveau module de facturation. Cela inclut:\n\n1. Création des endpoints backend\n2. Intégration front-end avec React\n3. Tests unitaires et d\'intégration\n4. Documentation technique',
    dueDate: '15/03/2026',
    assignee: 'Jean Dupont',
    status: 'En cours',
    priority: 'high',
    comments: [
      {
        id: '1',
        author: 'Marie Martin',
        date: '10/03/2026 14:30',
        content: 'Jean, as-tu besoin d\'aide pour l\'intégration front-end?'
      },
      {
        id: '2',
        author: 'Jean Dupont',
        date: '10/03/2026 15:45',
        content: 'Merci Marie, je gère pour l\'instant. Je te tiens au courant si j\'ai besoin d\'aide.'
      }
    ],
    checklist: [
      { id: '1', text: 'Créer les endpoints backend', completed: true },
      { id: '2', text: 'Intégrer Stripe au front-end', completed: false },
      { id: '3', text: 'Écrire les tests unitaires', completed: false },
      { id: '4', text: 'Rédiger la documentation', completed: false }
    ],
    attachments: [
      { id: '1', name: 'api_specs.pdf', url: '#', type: 'pdf' },
      { id: '2', name: 'mockup.png', url: '#', type: 'image' }
    ]
  });

  const [newComment, setNewComment] = useState('');
  const [newChecklistItem, setNewChecklistItem] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      const updatedCard = {
        ...card,
        comments: [
          ...card.comments,
          {
            id: Date.now().toString(),
            author: 'Utilisateur actuel',
            date: new Date().toLocaleString(),
            content: newComment
          }
        ]
      };
      setCard(updatedCard);
      setNewComment('');
    }
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const updatedCard = {
        ...card,
        checklist: [
          ...card.checklist,
          {
            id: Date.now().toString(),
            text: newChecklistItem,
            completed: false
          }
        ]
      };
      setCard(updatedCard);
      setNewChecklistItem('');
    }
  };

  const toggleChecklistItem = (id: string) => {
    const updatedCard = {
      ...card,
      checklist: card.checklist.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    };
    setCard(updatedCard);
  };

  const getPriorityColor = () => {
    switch (card.priority) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffd166';
      case 'low': return '#06d6a0';
      default: return '#999';
    }
  };

  const getStatusColor = () => {
    switch (card.status) {
      case 'À faire': return '#999';
      case 'En cours': return '#3498db';
      case 'Terminé': return '#06d6a0';
      default: return '#999';
    }
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#333'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: 0, color: '#2c3e50' }}>Détails de la carte</h1>
        <button
          type="button"
          onClick={() => navigate('/')}
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
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        padding: '25px',
        marginBottom: '30px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '15px'
          }}>
            <h2 style={{ margin: 0, color: '#2c3e50' }}>{card.title}</h2>
            <div style={{
              display: 'flex',
              gap: '10px'
            }}>
              <span style={{
                padding: '4px 8px',
                backgroundColor: getPriorityColor(),
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                Priorité: {card.priority}
              </span>
              <span style={{
                padding: '4px 8px',
                backgroundColor: getStatusColor(),
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                {card.status}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <p style={{ margin: '5px 0', color: '#555' }}>
              <strong>Assigné à:</strong> {card.assignee}
            </p>
            <p style={{ margin: '5px 0', color: '#555' }}>
              <strong>Date limite:</strong> {card.dueDate}
            </p>
          </div>

          <div style={{
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            borderLeft: '4px solid #3498db'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Description</h3>
            <div style={{
              whiteSpace: 'pre-line',
              color: '#495057',
              lineHeight: '1.6'
            }}>
              {card.description}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Liste de contrôle</h3>
          <div style={{ marginBottom: '15px' }}>
            {card.checklist.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px',
                  padding: '8px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px'
                }}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleChecklistItem(item.id)}
                  style={{ marginRight: '10px' }}
                />
                <span style={{
                  color: item.completed ? '#999' : '#495057',
                  textDecoration: item.completed ? 'line-through' : 'none'
                }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={newChecklistItem}
              onChange={(e) => setNewChecklistItem(e.target.value)}
              placeholder="Ajouter un élément..."
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            <button
              type="button"
              onClick={handleAddChecklistItem}
              style={{
                padding: '8px 12px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Ajouter
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Commentaires</h3>
          <div style={{ marginBottom: '20px' }}>
            {card.comments.map(comment => (
              <div
                key={comment.id}
                style={{
                  marginBottom: '15px',
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  borderLeft: '3px solid #3498db'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '5px'
                }}>
                  <strong style={{ color: '#2c3e50' }}>{comment.author}</strong>
                  <span style={{ color: '#999', fontSize: '12px' }}>{comment.date}</span>
                </div>
                <p style={{ margin: 0, color: '#495057' }}>{comment.content}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            <button
              type="button"
              onClick={handleAddComment}
              style={{
                padding: '8px 12px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Publier
            </button>
          </div>
        </div>

        {card.attachments.length > 0 && (
          <div>
            <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Pièces jointes</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {card.attachments.map(attachment => (
                <div
                  key={attachment.id}
                  style={{
                    padding: '10px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {attachment.type === 'pdf' ? '📄' : '🖼️'}
                  <a
                    href={attachment.url}
                    style={{ color: '#3498db', textDecoration: 'none' }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {attachment.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDetailsPage;
