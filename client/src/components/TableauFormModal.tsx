import React, { useState, useEffect } from 'react';
import { tableauApi } from '../api/apiClient.ts';
import type { Tableau } from '../model/types.ts';

interface Props {
    /** null = mode création, Tableau = mode édition */
    tableau?: Tableau | null;
    onClose: () => void;
    /** Appelé après création ou modification avec le tableau résultant */
    onSuccess: (tableau: Tableau) => void;
}

/**
 * Modal réutilisable pour créer ou modifier un tableau.
 * Utilisé dans TableauAdmin.tsx (admin) et Accueil.tsx (utilisateur).
 */
const TableauFormModal: React.FC<Props> = ({ tableau, onClose, onSuccess }) => {
    const isEdit = tableau != null;

    const [formData, setFormData] = useState({
        tab_nom: '',
        tab_description: '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Préremplir si édition
    useEffect(() => {
        if (tableau) {
            setFormData({
                tab_nom: tableau.tab_nom,
                tab_description: tableau.tab_description ?? '',
            });
        }
    }, [tableau]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.tab_nom.trim()) { setError('Le nom du tableau est requis.'); return; }
        setSaving(true);
        setError(null);
        try {
            let result: Tableau;
            if (isEdit && tableau) {
                result = await tableauApi.update(tableau.tab_id, formData) as Tableau;
            } else {
                result = await tableauApi.create(formData) as Tableau;
            }
            onSuccess(result);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '10px', border: '1px solid #ddd',
        borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box',
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
        }}>
            <div style={{
                backgroundColor: 'white', padding: '30px', borderRadius: '8px',
                width: '480px', maxWidth: '90%', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}>
                <h2 style={{ marginTop: 0, color: '#2c3e50' }}>
                    {isEdit ? 'Modifier le tableau' : 'Nouveau tableau'}
                </h2>

                {error && (
                    <div style={{ padding: '8px 12px', backgroundColor: '#fdecea', color: '#e74c3c', borderRadius: '4px', marginBottom: '15px', fontSize: '13px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                            Nom du tableau *
                        </label>
                        <input
                            type="text"
                            value={formData.tab_nom}
                            onChange={e => setFormData(p => ({ ...p, tab_nom: e.target.value }))}
                            placeholder="Ex : Projet Alpha..."
                            required
                            autoFocus
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                            Description (optionnelle)
                        </label>
                        <textarea
                            value={formData.tab_description}
                            onChange={e => setFormData(p => ({ ...p, tab_description: e.target.value }))}
                            placeholder="Décrivez le but de ce tableau..."
                            rows={3}
                            style={{ ...inputStyle, resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" onClick={onClose}
                                style={{ padding: '8px 16px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Annuler
                        </button>
                        <button type="submit" disabled={saving}
                                style={{
                                    padding: '8px 16px', backgroundColor: saving ? '#95a5a6' : '#4CAF50',
                                    color: 'white', border: 'none', borderRadius: '4px',
                                    cursor: saving ? 'not-allowed' : 'pointer',
                                }}>
                            {saving ? 'Enregistrement...' : (isEdit ? 'Enregistrer' : 'Créer')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TableauFormModal;