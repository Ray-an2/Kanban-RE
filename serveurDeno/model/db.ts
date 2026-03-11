import { SQLOutputValue } from "node:sqlite";
import { VoteCastMessage } from "./webSocket.ts";
import { User } from "./user.ts";

/**
 * Database Row Types
 */
// Compte
export interface CompteRow {
    cpt_pseudo: string;
    cpt_mdp: string;
    cpt_role: string;
    [key: string]: SQLOutputValue; // Index signature
}

// Profil
export interface ProfilRow {
    pfl_nom: string;
    pfl_prenom: string;
    pfl_dateCreation: string;
    pfl_mail: string;
    cpt_pseudo: string;
    [key: string]: SQLOutputValue; // Index signature
}

// Role (compte <-> tableau)
export interface RoleRow {
    cpt_pseudo: string;
    tab_id: string;
    rol_role: string;
    [key: string]: SQLOutputValue; // Index signature
}

// Membre (compte <-> carte)
export interface MembreRow {
    cpt_pseudo: string;
    car_id: string;
    mem_date: string;
    [key: string]: SQLOutputValue; // Index signature
}

// Associer (carte <-> etiquette)
export interface AssocierRow {
    car_id: string;
    eti_id: string;
    [key: string]: SQLOutputValue; // Index signature
}

/**
 * Type de garde
 */
// Compte
export function isCompteRow(obj: Record<string, SQLOutputValue>): obj is CompteRow {
    return !!obj &&
        typeof obj === "object" &&
        "cpt_pseudo" in obj && typeof obj.cpt_pseudo === "string" &&
        "cpt_mdp" in obj && typeof obj.cpt_mdp === "string" &&
        "cpt_role" in obj && typeof obj.cpt_role === "string";
}

// Profil
export function isProfilRow(obj: Record<string, SQLOutputValue>): obj is ProfilRow {
    return !!obj &&
        typeof obj === "object" &&
        "pfl_nom" in obj && typeof obj.pfl_nom === "string" &&
        "pfl_prenom" in obj && typeof obj.pfl_prenom === "string" &&
        "pfl_dateCreation" in obj && typeof obj.pfl_dateCreation === "string" &&
        "pfl_mail" in obj && typeof obj.pfl_mail === "string" &&
        "cpt_pseudo" in obj && typeof obj.cpt_pseudo === "string";
}

// Role
export function isRoleRow(obj: Record<string, SQLOutputValue>): obj is RoleRow {
    return !!obj &&
        typeof obj === "object" &&
        "cpt_pseudo" in obj && typeof obj.cpt_pseudo === "string" &&
        "tab_id" in obj && typeof obj.tab_id === "string" &&
        "rol_role" in obj && typeof obj.rol_role === "string";
}

// Membre
export function isMembreRow(obj: Record<string, SQLOutputValue>): obj is MembreRow {
    return !!obj &&
        typeof obj === "object" &&
        "cpt_pseudo" in obj && typeof obj.cpt_pseudo === "string" &&
        "car_id" in obj && typeof obj.car_id === "string" &&
        "mem_date" in obj && typeof obj.mem_date === "string";
}

// Associer
export function isAssocierRow(obj: Record<string, SQLOutputValue>): obj is AssocierRow {
    return !!obj &&
        typeof obj === "object" &&
        "car_id" in obj && typeof obj.car_id === "string" &&
        "eti_id" in obj && typeof obj.eti_id === "string";
}

// Message ...

/**
 * Convertion Helpers
 */

// Compte vers API
export function compteRowToApi(row: CompteRow): User {
    return {
        cpt_pseudo: row.cpt_pseudo,
        cpt_role: row.cpt_role,
    };
}
