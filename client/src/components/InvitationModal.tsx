import React, { useState } from 'react';
import { compteApi, roleApi, notificationApi } from '../api/apiClient.ts';
import type { Compte } from '../model/types.ts';

interface Props {
    tableauId: string;
    tableauNom: string;
    onClose: () => void;
}

/**
 * Modal d'invitation d'un utilisateur à un tableau.
 *
 * Flux :
 *  1. Admin saisit le pseudo de l'utilisateur
 *  2. On trouve le cptId via GET /api/compte/pseudo/:pseudo
 *  3. On crée un rôle 'E' (en attente) dans t_role_rol
 *  4. On crée une notification pour l'utilisateur avec le lien haché
 *  5. L'utilisateur voit la notification → clique Accepter ou Refuser
 */
const InvitationModal: React.FC<Props> = ({ tableauId, tableauNom, onClose }) => {
    const [pseudo, setPseudo] = useState('');
    const [roleCible, setRoleCible] = useState<'M' | 'A'>('M');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleInviter = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // 1. Trouver le compte par pseudo
            const compte = await compteApi.getByPseudo(pseudo) as Compte;

            // 2. Créer le rôle 'E' (en attente) — le roleCible est stocké dans not_lien
            await roleApi.inviter({ tabId: tableauId, cptId: compte.id, roleCible });

            // 3. Créer le lien haché : tabId + roleCible encodés en base64
            //    Format : base64(tabId:roleCible) — simple et décodable côté client
            const lienData = `${tableauId}:${roleCible}`;
            const lienHash = btoa(lienData);
            const lien = `/invitation/${lienHash}`;

            // 4. Envoyer la notification à l'utilisateur
            await notificationApi.create({
                titre: `Invitation au tableau "${tableauNom}"`,
                lien,
                cptId: compte.id,
                etat: 'N',
            });

            setSuccess(`Invitation envoyée à ${pseudo} (rôle : ${roleCible === 'M' ? 'Membre' : 'Administrateur'})`);
            setPseudo('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de l\'invitation');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '8px 12px', border: '1px solid #ddd',
        borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box',
    };

    return (
        <div style={{
            backgroundColor: 'white', padding: '30px', borderRadius: '8px',
            width: '420px', maxWidth: '90%', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '18px' }}>
                    Inviter un utilisateur
                </h2>
                <button type="button" onClick={onClose}
                        style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666' }}>
                    ✕
                </button>
            </div>

            <p style={{ color: '#555', fontSize: '14px', marginBottom: '20px' }}>
                Tableau : <strong>{tableauNom}</strong>
            </p>

            {error && (
                <div style={{ padding: '10px', backgroundColor: '#fdecea', color: '#e74c3c', borderRadius: '4px', marginBottom: '15px', fontSize: '13px' }}>
                    {error}
                </div>
            )}
            {success && (
                <div style={{ padding: '10px', backgroundColor: '#e8f5e9', color: '#2e7d32', borderRadius: '4px', marginBottom: '15px', fontSize: '13px' }}>
                    {success}
                </div>
            )}

            <form onSubmit={handleInviter}>
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#555' }}>
                        Pseudo de l'utilisateur *
                    </label>
                    <input
                        type="text"
                        value={pseudo}
                        onChange={e => setPseudo(e.target.value)}
                        placeholder="Ex: bosswaza"
                        required
                        style={inputStyle}
                    />
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#555' }}>
                        Rôle attribué
                    </label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {(['M', 'A'] as const).map(r => (
                            <label key={r} style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '10px 16px', borderRadius: '6px', cursor: 'pointer',
                                border: `2px solid ${roleCible === r ? '#3498db' : '#ddd'}`,
                                backgroundColor: roleCible === r ? '#EBF5FB' : 'white',
                                flex: 1, justifyContent: 'center',
                            }}>
                                <input type="radio" name="role" value={r} checked={roleCible === r}
                                       onChange={() => setRoleCible(r)} style={{ margin: 0 }} />
                                <span style={{ fontWeight: roleCible === r ? '600' : 'normal', color: '#2c3e50' }}>
                  {r === 'M' ? 'Membre' : 'Admin'}
                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" onClick={onClose}
                            style={{ padding: '8px 16px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Fermer
                    </button>
                    <button type="submit" disabled={loading || !pseudo.trim()}
                            style={{
                                padding: '8px 16px', backgroundColor: loading ? '#95a5a6' : '#3498db',
                                color: 'white', border: 'none', borderRadius: '4px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}>
                        {loading ? 'Envoi...' : 'Envoyer l\'invitation'}
                    </button>
                </div>
            </form>
        </div>
    );
};
export default InvitationModal;