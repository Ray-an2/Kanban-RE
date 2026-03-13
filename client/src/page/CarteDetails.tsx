import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type{ Carte as CarteType, Etiquette } from '../model/types.ts';

const CarteDetail: React.FC = () => {
  const { id, cardId } = useParams<{ id: string; cardId: string }>();
  const navigate = useNavigate();

  const [carte, setCarte] = useState<CarteType | null>(null);
  const [etiquettes, setEtiquettes] = useState<Etiquette[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarteData = async () => {
      try {
        setLoading(true);

        await new Promise(resolve => setTimeout(resolve, 800));

        const mockCarte: CarteType = {
          car_id: cardId || '1',
          car_nom: 'Créer la maquette',
          car_des: 'Créer la maquette de l\'application mobile avec Figma. Doit inclure toutes les vues principales et les états des composants.',
          car_archiver: 'N',
          car_terminer: 'N',
          car_priorite: 2,
          car_ordre: 1,
          car_dateCreation: new Date().toISOString(),
          car_dateDebut: new Date().toISOString(),
          car_dateFin: new Date(Date.now() + 86400000).toISOString(),
          lis_id: '1'
        };

        const mockEtiquettes: Etiquette[] = [
          { eti_id: '1', eti_nom: 'Frontend', eti_couleur: '#3498db' },
          { eti_id: '2', eti_nom: 'Design', eti_couleur: '#9b59b6' }
        ];

        setCarte(mockCarte);
        setEtiquettes(mockEtiquettes);
      } catch (error) {
        console.error("Erreur lors du chargement de la carte:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarteData();
  }, [id, cardId]);

  const getPriorityInfo = (priorite: number) => {
    switch (priorite) {
      case 3: return { bg: '#f44336', text: 'Haute' };
      case 2: return { bg: '#ff9800', text: 'Moyenne' };
      default: return { bg: '#4caf50', text: 'Faible' };
    }
  };

  const getStatusInfo = (terminer: 'O' | 'N') => {
    return terminer === 'O' ? { bg: '#4CAF50', text: 'Terminé' } : { bg: '#ff9800', text: 'En cours' };
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
        <p>Chargement de la carte...</p>
      </div>
    );
  }

  if (!carte) {
    return <div>Carte non trouvée</div>;
  }

  return (
    <div style={{
      maxWidth: '1000px',
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
        <div>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>{carte.car_nom}</h1>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <div style={{
              padding: '4px 8px',
              backgroundColor: getPriorityInfo(carte.car_priorite).bg,
              color: 'white',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              {getPriorityInfo(carte.car_priorite).text}
            </div>
            <div style={{
              padding: '4px 8px',
              backgroundColor: getStatusInfo(carte.car_terminer).bg,
              color: 'white',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              {getStatusInfo(carte.car_terminer).text}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/tableau/${id}`)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#95a5a6',
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
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '30px',
        marginBottom: '30px'
      }}>
        <div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h2 style={{ margin: '0 0 15px 0', color: '#333' }}>Description</h2>
            <p style={{ whiteSpace: 'pre-line', color: '#555' }}>
              {carte.car_des || 'Aucune description'}
            </p>
          </div>
        </div>

        <div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h2 style={{ margin: '0 0 15px 0', color: '#333' }}>Étiquettes</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {etiquettes.map(etiquette => (
                <div
                  key={etiquette.eti_id}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: etiquette.eti_couleur,
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                >
                  {etiquette.eti_nom}
                </div>
              ))}
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ margin: '0 0 15px 0', color: '#333' }}>Dates</h2>
            <div style={{ marginBottom: '10px' }}>
              <strong>Création:</strong> {new Date(carte.car_dateCreation).toLocaleString('fr-FR')}
            </div>
            {carte.car_dateDebut && (
              <div style={{ marginBottom: '10px' }}>
                <strong>Début:</strong> {new Date(carte.car_dateDebut).toLocaleString('fr-FR')}
              </div>
            )}
            {carte.car_dateFin && (
              <div style={{ marginBottom: '10px' }}>
                <strong>Échéance:</strong> {new Date(carte.car_dateFin).toLocaleString('fr-FR')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarteDetail;
