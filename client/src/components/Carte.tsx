// Carte.tsx
import React, { useState } from 'react';
import type{ Carte as CarteType } from '../model/types.ts';

interface CarteProps {
  carte: CarteType;
  onDragStart: (e: React.DragEvent, carte: CarteType) => void;
  onClick: (e: React.MouseEvent, carte: CarteType) => void;
}

const Carte: React.FC<CarteProps> = ({ carte, onDragStart, onClick }) => {
  const [isDragging, setIsDragging] = useState(false);

  const getPriorityColor = (priorite: number) => {
    switch (priorite) {
      case 3: return '#f44336';
      case 2: return '#ff9800';
      default: return '#4caf50';
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        setIsDragging(true);
        onDragStart(e, carte);
      }}
      onDragEnd={() => setIsDragging(false)}
      onClick={(e) => onClick(e, carte)}
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
        borderLeft: `4px solid ${getPriorityColor(carte.car_priorite)}`
      }}
    >
      <h3 style={{
        margin: '0 0 10px 0',
        color: '#333',
        fontSize: '14px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        {carte.car_nom}
      </h3>

      {carte.car_des && (
        <p style={{
          color: '#666',
          fontSize: '13px',
          margin: '0 0 10px 0',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {carte.car_des}
        </p>
      )}

      {carte.car_dateFin && (
        <div style={{
          fontSize: '11px',
          color: '#999',
          marginTop: '5px'
        }}>
          Échéance: {new Date(carte.car_dateFin).toLocaleDateString('fr-FR')}
        </div>
      )}
    </div>
  );
};

export default Carte;
