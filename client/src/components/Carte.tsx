import React from 'react';
import type { Carte as CarteType } from '../model/types.ts';

interface CarteProps {
    carte: CarteType;
    listId?: string;
    onDragStart: (e: React.DragEvent, carte: CarteType, listId: string) => void;
    onDragEnd?: () => void;
    onClick: (e: React.MouseEvent, carte: CarteType) => void;
    isDragging?: boolean;
    /** Ouvre le popup membres de la carte */
    onClickMembres?: () => void;
}

const Carte: React.FC<CarteProps> = ({
                                         carte, onDragStart, onDragEnd, onClick,
                                         isDragging = false, listId = '', onClickMembres,
                                     }) => {
    const priorityColor = carte.car_priorite === 3
        ? '#f44336' : carte.car_priorite === 2
            ? '#ff9800' : '#4caf50';

    const isLate = carte.car_date_fin
        ? new Date(carte.car_date_fin) < new Date()
        : false;

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, carte, listId)}
            onDragEnd={onDragEnd}
            onClick={(e) => onClick(e, carte)}
            style={{
                position: 'relative',
                backgroundColor: 'white',
                borderRadius: '6px',
                padding: '12px',
                boxShadow: isDragging
                    ? '0 8px 20px rgba(0,0,0,0.25)'
                    : '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'grab',
                opacity: isDragging ? 0.5 : 1,
                borderLeft: `4px solid ${priorityColor}`,
                transition: 'box-shadow 0.15s, opacity 0.15s',
                userSelect: 'none',
            }}
        >
            {/* Bouton membres */}
            {onClickMembres && (
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onClickMembres(); }}
                    title="Voir les membres"
                    style={{
                        position: 'absolute', top: '8px', right: '8px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '13px', opacity: 0.5, padding: '2px',
                        lineHeight: 1,
                    }}
                >
                    👥
                </button>
            )}

            {/* Nom */}
            <h3 style={{
                margin: '0 0 6px 0', color: '#333', fontSize: '14px', fontWeight: '500',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                paddingRight: onClickMembres ? '22px' : '0',
            }}>
                {carte.car_nom}
            </h3>

            {/* Description */}
            {carte.car_description && (
                <p style={{
                    color: '#666', fontSize: '12px', margin: '0 0 8px 0',
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                    {carte.car_description}
                </p>
            )}

            {/* Badges et date */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {carte.car_terminer === 'T' && (
                        <span style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', fontSize: '10px', padding: '2px 6px', borderRadius: '10px' }}>
              ✓ Terminé
            </span>
                    )}
                    {carte.car_archiver === 'O' && (
                        <span style={{ backgroundColor: '#f5f5f5', color: '#757575', fontSize: '10px', padding: '2px 6px', borderRadius: '10px' }}>
              Archivé
            </span>
                    )}
                </div>
                {carte.car_date_fin && (
                    <span style={{
                        fontSize: '11px',
                        color: isLate ? '#f44336' : '#9e9e9e',
                        fontWeight: isLate ? '600' : 'normal',
                    }}>
            {isLate ? '⚠ ' : ''}{new Date(carte.car_date_fin).toLocaleDateString('fr-FR')}
          </span>
                )}
            </div>
        </div>
    );
};

export default Carte;