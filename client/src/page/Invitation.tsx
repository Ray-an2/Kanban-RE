import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import { roleApi } from '../api/apiClient.ts';

const Invitation: React.FC = () => {
    const { hash } = useParams<{ hash: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [tabId, setTabId] = useState<string | null>(null);
    const [roleCible, setRoleCible] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'accepted' | 'refused' | 'error' | 'already_used'>('idle');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            // Sauvegarder le lien pour y revenir après connexion
            localStorage.setItem('redirect_after_login', `/invitation/${hash}`);
            navigate('/auth/login');
            return;
        }

        if (!hash) { setStatus('error'); return; }

        try {
            const decoded = atob(hash);
            const [tid, role] = decoded.split(':');
            if (!tid || !role) throw new Error('Lien invalide');
            setTabId(tid);
            setRoleCible(role);
        } catch {
            setStatus('error');
            setErrorMsg('Lien d\'invitation invalide ou corrompu.');
        }
    }, [hash, isAuthenticated]);

    const handleAccepter = async () => {
        if (!tabId || !roleCible || !user) return;
        setStatus('loading');
        try {
            await roleApi.accepterInvitation(tabId, user.cpt_id, roleCible);
            setStatus('accepted');
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Erreur';
            if (msg.toLowerCase().includes('introuvable') || msg.includes('400')) {
                setStatus('already_used');
            } else {
                setStatus('error');
                setErrorMsg(msg);
            }
        }
    };

    const handleRefuser = async () => {
        if (!tabId || !user) return;
        setStatus('loading');
        try {
            await roleApi.refuserInvitation(tabId, user.cpt_id);
            setStatus('refused');
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Erreur';
            if (msg.toLowerCase().includes('introuvable') || msg.includes('400')) {
                setStatus('already_used');
            } else {
                setStatus('error');
                setErrorMsg(msg);
            }
        }
    };

    const roleLabel = roleCible === 'A' ? 'Administrateur' : 'Membre';

    const cardStyle: React.CSSProperties = {
        maxWidth: '480px', margin: '80px auto', padding: '40px',
        backgroundColor: 'white', borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        fontFamily: 'Arial, sans-serif', textAlign: 'center',
    };

    if (status === 'error') return (
        <div style={cardStyle}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h2 style={{ color: '#e74c3c' }}>Lien invalide</h2>
            <p style={{ color: '#666' }}>{errorMsg ?? 'Ce lien d\'invitation est invalide.'}</p>
            <button type="button" onClick={() => navigate('/api/tableau')}
                    style={{ marginTop: '20px', padding: '10px 24px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Retour à l'accueil
            </button>
        </div>
    );

    if (status === 'already_used') return (
        <div style={cardStyle}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
            <h2 style={{ color: '#95a5a6' }}>Invitation déjà traitée</h2>
            <p style={{ color: '#666' }}>Cette invitation a déjà été acceptée ou refusée et ne peut plus être utilisée.</p>
            <button type="button" onClick={() => navigate('/api/tableau')}
                    style={{ marginTop: '20px', padding: '10px 24px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Retour à l'accueil
            </button>
        </div>
    );

    if (status === 'accepted') return (
        <div style={cardStyle}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ color: '#2e7d32' }}>Invitation acceptée !</h2>
            <p style={{ color: '#555' }}>
                Tu as rejoint le tableau en tant que <strong>{roleLabel}</strong>.
            </p>
            <button type="button" onClick={() => navigate(`/api/tableau/${tabId}`)}
                    style={{ marginTop: '20px', padding: '10px 24px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Voir le tableau
            </button>
        </div>
    );

    if (status === 'refused') return (
        <div style={cardStyle}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👋</div>
            <h2 style={{ color: '#555' }}>Invitation refusée</h2>
            <p style={{ color: '#666' }}>Tu as refusé l'invitation. Elle ne sera plus accessible.</p>
            <button type="button" onClick={() => navigate('/api/tableau')}
                    style={{ marginTop: '20px', padding: '10px 24px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Retour à l'accueil
            </button>
        </div>
    );

    // Statut idle ou loading — afficher la carte d'invitation
    return (
        <div style={cardStyle}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <h2 style={{ color: '#2c3e50', marginBottom: '8px' }}>Invitation à un tableau</h2>
            <p style={{ color: '#555', marginBottom: '8px' }}>
                Bonjour <strong>{user?.cpt_pseudo}</strong>,
            </p>
            <p style={{ color: '#555', marginBottom: '24px' }}>
                Tu as été invité(e) à rejoindre un tableau Kanban en tant que{' '}
                <strong style={{ color: roleCible === 'A' ? '#e74c3c' : '#3498db' }}>
                    {roleLabel}
                </strong>.
            </p>

            {status === 'loading' ? (
                <p style={{ color: '#666' }}>Traitement en cours...</p>
            ) : (
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <button type="button" onClick={handleRefuser}
                            style={{
                                padding: '12px 24px', backgroundColor: 'white', color: '#e74c3c',
                                border: '2px solid #e74c3c', borderRadius: '6px', cursor: 'pointer', fontWeight: '600',
                            }}>
                        ✕ Refuser
                    </button>
                    <button type="button" onClick={handleAccepter}
                            style={{
                                padding: '12px 24px', backgroundColor: '#4CAF50', color: 'white',
                                border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600',
                            }}>
                        ✓ Accepter
                    </button>
                </div>
            )}
        </div>
    );
};

export default Invitation;