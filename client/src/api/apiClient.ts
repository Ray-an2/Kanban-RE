/**
 * Client API centralisé — toutes les requêtes passent par le serveur Deno (VITE_API_URL).
 * Le token JWT est injecté automatiquement depuis localStorage.
 */

import type { APIResponse } from '../model/api.ts';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
const TOKEN_KEY = 'auth_token';

function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

function authHeaders(extra?: HeadersInit): HeadersInit {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(extra ?? {}),
    };
}

/**
 * Fonction fetch centrale.
 *
 * Gère deux formats de réponse :
 *  - Format Deno (auth) : { success: true, data: T } ou { success: false, error: { message } }
 *  - Format Tomcat direct : T (tableau, liste, carte...) retourné sans wrapper
 *
 * Gère aussi les réponses 204 No Content et les body vides.
 */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: authHeaders(options.headers as HeadersInit),
    });

    // 204 No Content ou body vide explicite : retourner null
    const contentLength = response.headers.get('content-length');
    if (response.status === 204 || contentLength === '0') {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return null as unknown as T;
    }

    // Lire le body une seule fois
    const text = await response.text();

    if (!text || text.trim() === '') {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return null as unknown as T;
    }

    let parsed: unknown;
    try {
        parsed = JSON.parse(text);
    } catch {
        throw new Error(`Réponse non-JSON du serveur (${response.status}): ${text.slice(0, 100)}`);
    }

    // --- Réponse en erreur ---
    if (!response.ok) {
        const raw = parsed as Record<string, unknown>;
        const errorObj = raw?.error as Record<string, unknown> | undefined;
        const message =
            (errorObj?.message as string) ||
            (raw?.message as string) ||
            `Erreur HTTP ${response.status}`;
        throw new Error(message);
    }

    // --- Format Deno : { success: true/false, data?, error? } ---
    // On détecte ce format par la présence de la propriété "success"
    if (parsed !== null && typeof parsed === 'object' && 'success' in (parsed as object)) {
        const wrapped = parsed as APIResponse<T>;
        if (!wrapped.success) {
            const message = wrapped.error?.message ?? `Erreur HTTP ${response.status}`;
            throw new Error(message);
        }
        return wrapped.data;
    }

    // --- Format Tomcat direct : la donnée est retournée telle quelle ---
    return parsed as T;
}

function get<T = unknown>(path: string): Promise<T> {
    return request<T>(path, { method: 'GET' });
}
function post<T = unknown>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, {
        method: 'POST',
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
}
function put<T = unknown>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, {
        method: 'PUT',
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
}
function patch<T = unknown>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, {
        method: 'PATCH',
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
}
function del<T = unknown>(path: string): Promise<T> {
    return request<T>(path, { method: 'DELETE' });
}

// ---- Auth (préfixe /auth — géré directement par Deno, sans /api) ----
export const authApi = {
    login: (pseudo: string, motDePasse: string) =>
        post<{ token: string; user: { cpt_id: string; cpt_pseudo: string; cpt_role: string } }>(
            '/auth/login', { pseudo, motDePasse }
        ),
    inscription: (data: {
        pseudo: string; motDePasse: string; email: string; nom: string; prenom: string;
    }) => post('/auth/inscription', data),
    validate: () =>
        get<{ valid: true; user: { cpt_id: string; cpt_pseudo: string; cpt_role: string } }>(
            '/auth/validate'
        ),
};

// ---- Tableau ----
export const tableauApi = {
    getAll:      ()                           => get('/api/tableau'),
    getById:     (id: string)                => get(`/api/tableau/${id}`),
    getByCompte: (cptId: string)             => get(`/api/tableau/compte/${cptId}`),
    getNombre:   ()                           => get('/api/tableau/nombre'),
    getTries:    (tri: 'rec' | 'alp')        => get(`/api/tableau/tri?tri=${tri}`),
    rechercher:  (search: string)             => get(`/api/tableau/recherche?search=${encodeURIComponent(search)}`),
    create:      (data: unknown)              => post('/api/tableau', data),
    update:      (id: string, data: unknown) => put(`/api/tableau/${id}`, data),
    delete:      (id: string)                => del(`/api/tableau/${id}`),
    fermer:      (id: string)                => patch(`/api/tableau/${id}/fermer`),
    ouvrir:      (id: string)                => patch(`/api/tableau/${id}/ouvrir`),
};

// ---- Liste ----
export const listeApi = {
    getByTableau:      (tabId: string)                 => get(`/api/liste/tableau/${tabId}`),
    getArchivees:      (tabId: string)                 => get(`/api/liste/tableau/${tabId}/archivees`),
    getById:           (id: string)                    => get(`/api/liste/${id}`),
    create:            (data: unknown)                 => post('/api/liste', data),
    update:            (id: string, data: unknown)     => put(`/api/liste/${id}`, data),
    delete:            (id: string)                    => del(`/api/liste/${id}`),
    archiver:          (id: string)                    => patch(`/api/liste/${id}/archiver`),
    desarchiver:       (id: string)                    => patch(`/api/liste/${id}/desarchiver`),
    updateOrdre:       (tabId: string, body: unknown)  => put(`/api/liste/tableau/${tabId}/ordre`, body),
    updateOrdreCartes: (lisId: string, body: unknown)  => put(`/api/liste/${lisId}/ordre-cartes`, body),
};

// ---- Carte ----
export const carteApi = {
    getById:     (carId: string)                => get(`/api/carte/${carId}`),
    getArchivees:(tabId: string)                => get(`/api/carte/tableau/${tabId}/archivees`),
    count:       (lisId: string)                => get(`/api/carte/liste/${lisId}/count`),
    isEnRetard:  (carId: string)                => get(`/api/carte/${carId}/retard`),
    create:      (data: unknown)                => post('/api/carte', data),
    update:      (carId: string, data: unknown) => put(`/api/carte/${carId}`, data),
    delete:      (carId: string)                => del(`/api/carte/${carId}`),
    archiver:    (carId: string)                => patch(`/api/carte/${carId}/archiver`),
    terminer:    (carId: string)                => patch(`/api/carte/${carId}/terminer`),
    moveListe:   (carId: string, newLisId: string) =>
        patch(`/api/carte/${carId}/move-liste?newLisId=${newLisId}`),
    dragDrop:    (carId: string, body: { sourceLisId: string; targetLisId: string; newOrdre: number }) =>
        patch(`/api/carte/${carId}/drag-drop`, body),
};

// ---- Rôle ----
export const roleApi = {
    getAll:       ()                                        => get('/api/role'),
    getByCompte:  (cptId: string)                          => get(`/api/role/compte/${cptId}`),
    getByTableau: (tabId: string)                          => get(`/api/role/tableau/${tabId}`),
    associer:     (data: unknown)                          => post('/api/role', data),
    update:       (tabId: string, cptId: string, rolRole: string) =>
        patch(`/api/role/tableau/${tabId}/compte/${cptId}`, { rolRole }),
    delete:       (tabId: string, cptId: string)           => del(`/api/role/tableau/${tabId}/compte/${cptId}`),
};

// ---- Membre ----
export const membreApi = {
    getByCarte: (carId: string)                  => get(`/api/membre/carte/${carId}`),
    associer:   (data: unknown)                  => post('/api/membre', data),
    delete:     (carId: string, cptId: string)   => del(`/api/membre/carte/${carId}/compte/${cptId}`),
};

// ---- Étiquette ----
export const etiquetteApi = {
    getAll:   ()                                => get('/api/etiquette'),
    getById:  (id: string)                      => get(`/api/etiquette/${id}`),
    getByNom: (nom: string)                     => get(`/api/etiquette/nom/${encodeURIComponent(nom)}`),
    create:   (data: unknown)                   => post('/api/etiquette', data),
    update:   (id: string, data: unknown)       => put(`/api/etiquette/${id}`, data),
    delete:   (id: string)                      => del(`/api/etiquette/${id}`),
};

// ---- Associer (carte <-> étiquette) ----
export const associerApi = {
    getByCarte:     (carId: string)                => get(`/api/associer/carte/${carId}`),
    getByEtiquette: (etiId: string)                => get(`/api/associer/etiquette/${etiId}`),
    create:         (data: unknown)                => post('/api/associer', data),
    delete:         (carId: string, etiId: string) => del(`/api/associer/carte/${carId}/etiquette/${etiId}`),
};

// ---- Journal ----
export const journalApi = {
    getByTableau:   (tabId: string) => get(`/api/journal/tableau/${tabId}`),
    countByTableau: (tabId: string) => get(`/api/journal/tableau/${tabId}/count`),
    lastByTableau:  (tabId: string) => get(`/api/journal/tableau/${tabId}/last`),
    getByCarte:     (carId: string) => get(`/api/journal/carte/${carId}`),
};

// ---- Notification ----
export const notificationApi = {
    getAll:     ()               => get('/api/notification'),
    getById:    (id: string)     => get(`/api/notification/${id}`),
    create:     (data: unknown)  => post('/api/notification', data),
    markAsRead: (id: string)     => patch(`/api/notification/${id}/read`),
    delete:     (id: string)     => del(`/api/notification/${id}`),
};

// ---- Commentaire ----
export const commentaireApi = {
    getByCarte: (carteId: string)            => get(`/api/commentaire?carteId=${carteId}`),
    getById:    (id: string)                 => get(`/api/commentaire/${id}`),
    create:     (data: unknown)              => post('/api/commentaire', data),
    delete:     (id: string)                 => del(`/api/commentaire/${id}`),
};

// ---- Document ----
export const documentApi = {
    getByCarte: (carteId: string)            => get(`/api/document?carteId=${carteId}`),
    getById:    (id: string)                 => get(`/api/document/${id}`),
    create:     (data: unknown)              => post('/api/document', data),
    update:     (id: string, data: unknown)  => put(`/api/document/${id}`, data),
    delete:     (id: string)                 => del(`/api/document/${id}`),
};

// ---- Compte ----
export const compteApi = {
    getAll:             ()                => get('/api/compte'),
    getById:            (id: string)      => get(`/api/compte/${id}`),
    isPseudoDisponible: (pseudo: string)  =>
        get<{ disponible: boolean }>(`/api/compte/pseudo/${encodeURIComponent(pseudo)}/disponible`),
    updatePseudo: (id: string, pseudo: string) => patch(`/api/compte/${id}/pseudo`, { pseudo }),
    updateRole:   (id: string, role: string)   => patch(`/api/compte/${id}/role`, { role }),
    updateMdp:    (id: string, mdp: string)    => patch(`/api/compte/${id}/mdp`, { mdp }),
    delete:       (id: string)                 => del(`/api/compte/${id}`),
};

// ---- Profil ----
export const profilApi = {
    getById: (id: string)                => get(`/api/profil/${id}`),
    update:  (id: string, data: unknown) => put(`/api/profil/${id}`, data),
};