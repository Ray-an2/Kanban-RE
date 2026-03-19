import type { APIResponse } from '../model/api.ts';

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'auth_token';

// ---- Helpers internes ----------------------------------------

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

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: authHeaders(options.headers as HeadersInit),
    });

    const json = (await response.json()) as APIResponse<T>;

    if (!response.ok || !json.success) {
        const message = json.success ? `HTTP ${response.status}` : json.error.message;
        throw new Error(message);
    }

    return json.data;
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

// ---- Auth ----------------------------------------------------

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

// ---- Tableau -------------------------------------------------

export const tableauApi = {
    getAll:          ()                         => get('/tableau'),
    getById:         (id: string)               => get(`/tableau/${id}`),
    getByCompte:     (cptId: string)            => get(`/tableau/compte/${cptId}`),
    getNombre:       ()                         => get('/tableau/nombre'),
    getTries:        (tri: 'rec' | 'alp')       => get(`/tableau/tri?tri=${tri}`),
    rechercher:      (search: string)           => get(`/tableau/recherche?search=${encodeURIComponent(search)}`),
    create:          (data: unknown)            => post('/tableau', data),
    update:          (id: string, data: unknown)=> put(`/tableau/${id}`, data),
    delete:          (id: string)               => del(`/tableau/${id}`),
    /** Ferme le tableau : tab_etat → 'F' */
    fermer:          (id: string)               => patch(`/tableau/${id}/fermer`),
    /** Ouvre le tableau : tab_etat → 'O' */
    ouvrir:          (id: string)               => patch(`/tableau/${id}/ouvrir`),
};

// ---- Liste ---------------------------------------------------

export const listeApi = {
    getByTableau:    (tabId: string)              => get(`/liste/tableau/${tabId}`),
    getArchivees:    (tabId: string)              => get(`/liste/tableau/${tabId}/archivees`),
    getById:         (id: string)                 => get(`/liste/${id}`),
    create:          (data: unknown)              => post('/liste', data),
    update:          (id: string, data: unknown)  => put(`/liste/${id}`, data),
    delete:          (id: string)                 => del(`/liste/${id}`),
    archiver:        (id: string)                 => patch(`/liste/${id}/archiver`),
    desarchiver:     (id: string)                 => patch(`/liste/${id}/desarchiver`),
    updateOrdre:     (tabId: string, body: unknown) => put(`/liste/tableau/${tabId}/ordre`, body),
    updateOrdreCartes: (lisId: string, body: unknown) => put(`/liste/${lisId}/ordre-cartes`, body),
};

// ---- Carte ---------------------------------------------------
// Champs JSON : car_id, car_nom, car_des, car_archiver, car_terminer,
//               car_ordre, car_priorite, car_dateCreation, car_dateDebut,
//               car_dateFin, car_couverture, lis_id

export const carteApi = {
    getById:         (carId: string)              => get(`/carte/${carId}`),
    getArchivees:    (tabId: string)              => get(`/carte/tableau/${tabId}/archivees`),
    count:           (lisId: string)              => get(`/carte/liste/${lisId}/count`),
    isEnRetard:      (carId: string)              => get(`/carte/${carId}/retard`),
    create:          (data: unknown)              => post('/carte', data),
    update:          (carId: string, data: unknown) => put(`/carte/${carId}`, data),
    delete:          (carId: string)              => del(`/carte/${carId}`),
    archiver:        (carId: string)              => patch(`/carte/${carId}/archiver`),
    terminer:        (carId: string)              => patch(`/carte/${carId}/terminer`),
    moveListe:       (carId: string, newLisId: string) =>
        patch(`/carte/${carId}/move-liste?newLisId=${newLisId}`),
    dragDrop:        (carId: string, body: { sourceLisId: string; targetLisId: string; newOrdre: number }) =>
        patch(`/carte/${carId}/drag-drop`, body),
};

// ---- Rôle ----------------------------------------------------
// Champs JSON (RoleDto) : cptId, tabId, rolRole, cptPseudo, tabNom

export const roleApi = {
    getAll:          ()                               => get('/role'),
    getByCompte:     (cptId: string)                  => get(`/role/compte/${cptId}`),
    getByTableau:    (tabId: string)                  => get(`/role/tableau/${tabId}`),
    associer:        (data: unknown)                  => post('/role', data),
    update:          (tabId: string, cptId: string, rolRole: string) =>
        patch(`/role/tableau/${tabId}/compte/${cptId}`, { rolRole }),
    delete:          (tabId: string, cptId: string)   => del(`/role/tableau/${tabId}/compte/${cptId}`),
};

// ---- Membre --------------------------------------------------
// Champs JSON (MembreDto) : cptId, carId, dateCreation

export const membreApi = {
    getByCarte:      (carId: string)                  => get(`/membre/carte/${carId}`),
    associer:        (data: unknown)                  => post('/membre', data),
    delete:          (carId: string, cptId: string)   => del(`/membre/carte/${carId}/compte/${cptId}`),
};

// ---- Étiquette -----------------------------------------------
// Champs JSON (EtiquetteDto) : id, nom, couleur

export const etiquetteApi = {
    getAll:          ()                               => get('/etiquette'),
    getById:         (id: string)                     => get(`/etiquette/${id}`),
    getByNom:        (nom: string)                    => get(`/etiquette/nom/${encodeURIComponent(nom)}`),
    create:          (data: unknown)                  => post('/etiquette', data),
    update:          (id: string, data: unknown)      => put(`/etiquette/${id}`, data),
    delete:          (id: string)                     => del(`/etiquette/${id}`),
};

// ---- Associer (carte ↔ étiquette) ----------------------------
// Champs JSON (AssocierDto) : carId, etiId, carNom, etiNom

export const associerApi = {
    getByCarte:      (carId: string)                  => get(`/associer/carte/${carId}`),
    getByEtiquette:  (etiId: string)                  => get(`/associer/etiquette/${etiId}`),
    create:          (data: unknown)                  => post('/associer', data),
    delete:          (carId: string, etiId: string)   => del(`/associer/carte/${carId}/etiquette/${etiId}`),
};

// ---- Journal -------------------------------------------------
// Champs JSON (JournalDto) : jou_id, jou_titre, jou_description,
//                            jou_auteur, jou_action, jou_date, jou_etat, tab_id, car_id

export const journalApi = {
    getByTableau:    (tabId: string)                  => get(`/journal/tableau/${tabId}`),
    countByTableau:  (tabId: string)                  => get(`/journal/tableau/${tabId}/count`),
    lastByTableau:   (tabId: string)                  => get(`/journal/tableau/${tabId}/last`),
    getByCarte:      (carId: string)                  => get(`/journal/carte/${carId}`),
};

// ---- Notification --------------------------------------------
// Champs JSON (NotificationDto, pas de @JsonProperty) : id, titre, dateCreation, lien, etat, cptId

export const notificationApi = {
    getAll:          ()                               => get('/notification'),
    getById:         (id: string)                     => get(`/notification/${id}`),
    create:          (data: unknown)                  => post('/notification', data),
    markAsRead:      (id: string)                     => patch(`/notification/${id}/read`),
    delete:          (id: string)                     => del(`/notification/${id}`),
};

// ---- Commentaire ---------------------------------------------
// Champs JSON (CommentaireDto) : id, carteId, auteurId, contenu, dateCreation

export const commentaireApi = {
    getByCarte:      (carteId: string)                => get(`/commentaire?carteId=${carteId}`),
    getById:         (id: string)                     => get(`/commentaire/${id}`),
    create:          (data: unknown)                  => post('/commentaire', data),
    delete:          (id: string)                     => del(`/commentaire/${id}`),
};

// ---- Document ------------------------------------------------
// Champs JSON (DocumentDto) : id, carteId, nomFichier, url, dateCreation

export const documentApi = {
    getByCarte:      (carteId: string)                => get(`/document?carteId=${carteId}`),
    getById:         (id: string)                     => get(`/document/${id}`),
    create:          (data: unknown)                  => post('/document', data),
    update:          (id: string, data: unknown)      => put(`/document/${id}`, data),
    delete:          (id: string)                     => del(`/document/${id}`),
};

// ---- Compte --------------------------------------------------
// Champs JSON (CompteDto) : id, pseudo, role

export const compteApi = {
    getAll:          ()                               => get('/compte'),
    getById:         (id: string)                     => get(`/compte/${id}`),
    isPseudoDisponible: (pseudo: string)              =>
        get<{ disponible: boolean }>(`/compte/pseudo/${encodeURIComponent(pseudo)}/disponible`),
    updatePseudo:    (id: string, pseudo: string)     => patch(`/compte/${id}/pseudo`, { pseudo }),
    updateRole:      (id: string, role: string)       => patch(`/compte/${id}/role`, { role }),
    updateMdp:       (id: string, mdp: string)        => patch(`/compte/${id}/mdp`, { mdp }),
    delete:          (id: string)                     => del(`/compte/${id}`),
};

// ---- Profil --------------------------------------------------
// Champs JSON (ProfilDto) : compteId, nom, prenom, mail, etat, dateCreation

export const profilApi = {
    getById:         (id: string)                     => get(`/profil/${id}`),
    update:          (id: string, data: unknown)      => put(`/profil/${id}`, data),
};