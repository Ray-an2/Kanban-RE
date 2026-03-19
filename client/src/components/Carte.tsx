import React from 'react';
import type { Carte as CarteType } from '../model/types.ts';

interface CarteProps {
  carte: CarteType;
  onDragStart: (e: React.DragEvent, carte: CarteType) => void;
  onDragEnd?: () => void;
  onClick: (e: React.MouseEvent, carte: CarteType) => void;
  isDragging?: boolean;
}

const Carte: React.FC<CarteProps> = ({
                                       carte,
                                       onDragStart,
                                       onDragEnd,
                                       onClick,
                                       isDragging = false,
                                     }) => {

  const getPriorityColor = (priorite: number) => {
    switch (priorite) {
      case 3:  return '#f44336'; // haute
      case 2:  return '#ff9800'; // moyenne
      default: return '#4caf50'; // faible
    }
  };

  const isLate = carte.car_dateFin
      ? new Date(carte.car_dateFin) < new Date()
      : false;

  return (
      <div
          draggable
          onDragStart={(e) => onDragStart(e, carte)}
          onDragEnd={onDragEnd}
          onClick={(e) => onClick(e, carte)}
          style={{
            backgroundColor: 'white',
            borderRadius: '6px',
            padding: '12px',
            boxShadow: isDragging
                ? '0 8px 20px rgba(0,0,0,0.2)'
                : '0 1px 3px rgba(0,0,0,0.1)',
            cursor: 'grab',
            opacity: isDragging ? 0.5 : 1,
            borderLeft: `4px solid ${getPriorityColor(carte.car_priorite)}`,
            transition: 'box-shadow 0.15s ease, opacity 0.15s ease',
            userSelect: 'none',
          }}
      >
        {/* Nom de la carte */}
        <h3 style={{
          margin: '0 0 6px 0',
          color: '#333',
          fontSize: '14px',
          fontWeight: '500',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {carte.car_nom}
        </h3>

        {/* Description (2 lignes max) */}
        {carte.car_des && (
            <p style={{
              color: '#666',
              fontSize: '12px',
              margin: '0 0 8px 0',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: '1.4'
            }}>
              {carte.car_des}
            </p>
        )}

        {/* Pied de carte : badges statut + date */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '4px',
          flexWrap: 'wrap',
          gap: '4px'
        }}>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {/* Badge terminé */}
            {carte.car_terminer === 'T' && (
                <span style={{
                  backgroundColor: '#e8f5e9',
                  color: '#2e7d32',
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontWeight: '500'
                }}>
              ✓ Terminé
            </span>
            )}
            {/* Badge archivé */}
            {carte.car_archiver === 'O' && (
                <span style={{
                  backgroundColor: '#f5f5f5',
                  color: '#757575',
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '10px'
                }}>
              Archivé
            </span>
            )}
          </div>

          {/* Date de fin */}
          {carte.car_dateFin && (
              <span style={{
                fontSize: '11px',
                color: isLate ? '#f44336' : '#9e9e9e',
                fontWeight: isLate ? '600' : 'normal'
              }}>
            {isLate ? '⚠ ' : ''}
                {new Date(carte.car_dateFin).toLocaleDateString('fr-FR')}
          </span>
          )}
        </div>
      </div>
  );
};

export default Carte;