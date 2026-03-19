import { SQLOutputValue } from "node:sqlite";
import { User } from "./user.ts";
import { Tableau } from "./tableau.ts";
import { Liste } from "./liste.ts";
import { Carte } from "./carte.ts";
import { Journal } from "./journal.ts";
import { Etiquette } from "./etiquette.ts";
import { Notification } from "./notification.ts";

/**
 * Database Row Types
 */
// Compte
export interface CompteRow {
    cpt_id: string;
    cpt_pseudo: string;
    cpt_mdp: string;
    cpt_role: string;
    [key: string]: SQLOutputValue; // Index signature
}

// Profil
export interface ProfilRow {
    pfl_nom: string;
    pfl_prenom: string;
    pfl_mail: string;
    pfl_etat: string;
    pfl_dateCreation: string;
    cpt_id: string;
    [key: string]: SQLOutputValue; // Index signature
}

// Role (compte <-> tableau)
export interface RoleRow {
    cpt_id: string;
    tab_id: string;
    rol_role: string;
    [key: string]: SQLOutputValue; // Index signature
}

// Membre (compte <-> carte)
export interface MembreRow {
    cpt_id: string;
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

// Tableau
export interface TableauRow {
    tab_id: string;
    tab_nom: string;
    tab_description: string | null;
    tab_date: string;
    tab_etat: string;
    tab_image: string | null;
    [key: string]: SQLOutputValue; // Index signature
}

// Liste
export interface ListeRow {
    lis_id: string;
    lis_titre: string;
    lis_ordre: number;
    lis_etat: string;
    tab_id: string;
    [key: string]: SQLOutputValue; // Index signature
}

// Carte
export interface CarteRow {
    car_id: string;
    car_nom: string;
    car_description: string | null;
    car_archiver: string;
    car_terminer: string;
    car_priorite: number | null;
    car_ordre: string;
    car_date_creation: string;
    car_date_debut: string | null;
    car_date_fin: string | null;
    car_couverture: string | null;
    lis_id: string;
    [key: string]: SQLOutputValue; // Index signature
}

// Journal
export interface JournalRow {
    jou_id: string;
    jou_titre: string;
    jou_description: string;
    jou_auteur: string;
    jou_action: string;
    jou_date: string;
    jou_etat: string;
    tab_id: string | null;
    car_id: string | null;
    [key: string]: SQLOutputValue; // Index signature
}

// Etiquette
export interface EtiquetteRow {
    eti_id: string;
    eti_nom: string;
    eti_couleur: string;
    [key: string]: SQLOutputValue; // Index signature
}

// Notification
export interface NotificationRow {
    not_id: string;
    not_titre: string;
    not_date: string;
    not_lien: string;
    cpt_id: string | null;
    [key: string]: SQLOutputValue; // Index signature
}

/**
 * Type de garde
 */
// Compte
export function isCompteRow(obj: Record<string, SQLOutputValue>): obj is CompteRow {
    return !!obj &&
        typeof obj === "object" &&
        "cpt_id" in obj && typeof obj.cpt_id === "string" &&
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
        "pfl_mail" in obj && typeof obj.pfl_mail === "string" &&
        "pfl_etat" in obj && typeof obj.pfl_etat === "string" &&
        "pfl_dateCreation" in obj && typeof obj.pfl_dateCreation === "string" &&
        "cpt_id" in obj && typeof obj.cpt_id === "string";
}

// Role
export function isRoleRow(obj: Record<string, SQLOutputValue>): obj is RoleRow {
    return !!obj &&
        typeof obj === "object" &&
        "cpt_id" in obj && typeof obj.cpt_id === "string" &&
        "tab_id" in obj && typeof obj.tab_id === "string" &&
        "rol_role" in obj && typeof obj.rol_role === "string";
}

// Membre
export function isMembreRow(obj: Record<string, SQLOutputValue>): obj is MembreRow {
    return !!obj &&
        typeof obj === "object" &&
        "cpt_id" in obj && typeof obj.cpt_id === "string" &&
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

// Tableau
export function isTableauRow(obj: Record<string, SQLOutputValue>): obj is TableauRow {
    return !!obj &&
        typeof obj === "object" &&
        "tab_id" in obj && typeof obj.tab_id === "string" &&
        "tab_nom" in obj && typeof obj.tab_nom === "string" &&
        "tab_description" in obj && (typeof obj.tab_description === "string" || obj.tab_description === null) &&
        "tab_date" in obj && typeof obj.tab_date === "string" &&
        "tab_etat" in obj && typeof obj.tab_etat === "string" &&
        "tab_image" in obj && (typeof obj.tab_image === "string" || obj.tab_image === null);
}

// Liste
export function isListeRow(obj: Record<string, SQLOutputValue>): obj is ListeRow {
    return !!obj &&
        typeof obj === "object" &&
        "lis_id" in obj && typeof obj.lis_id === "string" &&
        "lis_titre" in obj && typeof obj.lis_titre === "string" &&
        "lis_ordre" in obj && typeof obj.lis_ordre === "number" &&
        "lis_etat" in obj && typeof obj.lis_etat === "string" &&
        "tab_id" in obj && typeof obj.tab_id === "string";
}

// Carte
export function isCarteRow(obj: Record<string, SQLOutputValue>): obj is CarteRow {
    return !!obj &&
        typeof obj === "object" &&
        "car_id" in obj && typeof obj.car_id === "string" &&
        "car_nom" in obj && typeof obj.car_nom === "string" &&
        "car_description" in obj && (typeof obj.car_description === "string" || obj.car_description === null) &&
        "car_archiver" in obj && typeof obj.car_archiver === "string" &&
        "car_terminer" in obj && typeof obj.car_terminer === "string" &&
        "car_priorite" in obj && (typeof obj.car_priorite === "number" || obj.car_priorite === null) &&
        "car_ordre" in obj && typeof obj.car_ordre === "string" &&
        "car_date_creation" in obj && typeof obj.car_date_creation === "string" &&
        "car_date_debut" in obj && (typeof obj.car_date_debut === "string" || obj.car_date_debut === null) &&
        "car_date_fin" in obj && (typeof obj.car_date_fin === "string" || obj.car_date_fin === null) &&
        "car_couverture" in obj && (typeof obj.car_couverture === "string" || obj.car_couverture === null) &&
        "lis_id" in obj && typeof obj.lis_id === "string";
}

// Journal
export function isJournalRow(obj: Record<string, SQLOutputValue>): obj is JournalRow {
    return !!obj &&
        typeof obj === "object" &&
        "jou_id" in obj && typeof obj.jou_id === "string" &&
        "jou_titre" in obj && typeof obj.jou_titre === "string" &&
        "jou_description" in obj && typeof obj.jou_description === "string" &&
        "jou_auteur" in obj && typeof obj.jou_auteur === "string" &&
        "jou_action" in obj && typeof obj.jou_action === "string" &&
        "jou_date" in obj && typeof obj.jou_date === "string" &&
        "jou_etat" in obj && typeof obj.jou_etat === "string" &&
        "tab_id" in obj && (typeof obj.tab_id === "string" || obj.tab_id === null) &&
        "car_id" in obj && (typeof obj.car_id === "string" || obj.car_id === null);
}

// Etiquette
export function isEtiquetteRow(obj: Record<string, SQLOutputValue>): obj is EtiquetteRow {
    return !!obj &&
        typeof obj === "object" &&
        "eti_id" in obj && typeof obj.eti_id === "string" &&
        "eti_nom" in obj && typeof obj.eti_nom === "string" &&
        "eti_couleur" in obj && (typeof obj.eti_couleur === "string" || obj.eti_couleur === null);
}

// Notification
export function isNotificationRow(obj: Record<string, SQLOutputValue>): obj is NotificationRow {
    return !!obj &&
        typeof obj === "object" &&
        "not_id" in obj && typeof obj.not_id === "string" &&
        "not_titre" in obj && (typeof obj.not_titre === "string" || obj.not_titre === null) &&
        "not_date" in obj && typeof obj.not_date === "string" &&
        "not_lien" in obj && (typeof obj.not_lien === "string" || obj.not_lien === null) &&
        "cpt_id" in obj && (typeof obj.cpt_id === "string" || obj.cpt_id === null);
}

// Message ...

/**
 * Convertion Helpers
 */

// Compte vers API
export function compteRowToApi(row: CompteRow): User {
    return {
        cpt_id: row.cpt_id,
        cpt_pseudo: row.cpt_pseudo,
        cpt_role: row.cpt_role,
    };
}

// Profil vers API
export function tableauRowToApi(row: TableauRow): Tableau {
    return {
        tab_id: row.tab_id,
        tab_nom: row.tab_nom,
        tab_description: row.tab_description ?? "",
        tab_date: row.tab_date,
        tab_etat: row.tab_etat,
        tab_image: row.tab_image ?? "",
    };
}

// Liste vers API
export function listeRowToApi(row: ListeRow): Liste {
    return {
        lis_id: row.lis_id,
        lis_titre: row.lis_titre,
        lis_ordre: row.lis_ordre,
        lis_etat: row.lis_etat,
        tab_id: row.tab_id,
    };
}

// Carte vers API
export function carteRowToApi(row: CarteRow): Carte {
    return {
        car_id: row.car_id,
        car_nom: row.car_nom,
        car_description: row.car_description ?? "",
        car_archiver: row.car_archiver,
        car_terminer: row.car_terminer,
        car_priorite: row.car_priorite ?? 0,
        car_ordre: row.car_ordre,
        car_date_creation: row.car_date_creation,
        car_date_debut: row.car_date_debut ?? "",
        car_date_fin: row.car_date_fin ?? "",
        car_couverture: row.car_couverture ?? "",
        lis_id: row.lis_id,
    };
}

// Journal vers API
export function journalRowToApi(row: JournalRow): Journal {
    return {
        jou_id: row.jou_id,
        jou_titre: row.jou_titre,
        jou_description: row.jou_description,
        jou_auteur: row.jou_auteur,
        jou_action: row.jou_action,
        jou_date: row.jou_date,
        jou_etat: row.jou_etat,
        tab_id: row.tab_id ?? null,
        car_id: row.car_id ?? null,
    };
}

// Etiquette vers API
export function etiquetteRowToApi(row: EtiquetteRow): Etiquette {
    return {
        eti_id: row.eti_id,
        eti_nom: row.eti_nom,
        eti_couleur: row.eti_couleur,
    };
}
// Notification vers API
export function notificationRowToApi(row: NotificationRow): Notification {
    return {
        not_id: row.not_id,
        not_titre: row.not_titre,
        not_lien: row.not_lien,
        not_date: row.not_date,
        cpt_id: row.cpt_id,
    };
}
