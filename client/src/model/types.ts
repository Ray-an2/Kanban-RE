
// --- Compte (CompteDto — pas de @JsonProperty) ---
export interface Compte {
  id: string;
  pseudo: string;
  role: string;
}

// --- Profil (ProfilDto — pas de @JsonProperty) ---
export interface Profil {
  compteId: string;
  nom?: string;
  prenom?: string;
  mail?: string;
  etat: 'A' | 'D';
  dateCreation?: string;
}

export interface UserWithProfile {
  compte: Compte;
  profil?: Profil;
}

// --- Tableau (TableauDto — @JsonProperty snake_case) ---
export interface Tableau {
  tab_id: string;
  tab_nom: string;
  tab_description?: string;
  tab_date: string;
  /** 'O' = Ouvert, 'F' = Fermé */
  tab_etat: 'O' | 'F';
  tab_image?: string | null;
}

// --- Liste (ListeDto — @JsonProperty snake_case) ---
export interface Liste {
  lis_id: string;
  lis_titre: string;
  lis_ordre: number;
  lis_etat: 'P' | 'A';
  tab_id: string;
  cartes: Carte[];
}

// --- Carte (CarteDto — @JsonProperty snake_case) ---
export interface Carte {
  car_id: string;
  car_nom: string;
  /** @JsonProperty("car_des") dans CarteDto.java */
  car_des?: string;
  car_archiver: 'O' | 'N';
  /** 'T' = Terminé, 'N' = Non terminé */
  car_terminer: 'T' | 'N';
  car_ordre: string;
  car_priorite: number;
  car_dateCreation: string;
  car_dateDebut?: string;
  car_dateFin?: string;
  car_couverture?: string;
  lis_id: string;
}

// --- Étiquette (EtiquetteDto — pas de @JsonProperty) ---
export interface Etiquette {
  id: string;
  nom: string;
  couleur: string;
}

// --- Associer (AssocierDto — pas de @JsonProperty) ---
export interface Associer {
  carId: string;
  etiId: string;
  carNom?: string;
  etiNom?: string;
}

// --- Journal (JournalDto — @JsonProperty snake_case) ---
export interface Journal {
  jou_id: string;
  jou_titre: string;
  jou_description: string;
  jou_auteur: string;
  jou_action: string;
  jou_date: string;
  jou_etat: string;
  tab_id?: string;
  car_id?: string;
}

// --- Notification (NotificationDto — pas de @JsonProperty) ---
export interface Notification {
  id: string;
  titre: string;
  dateCreation: string;
  lien?: string;
  /** 'L' = Lu, 'N' = Non lu */
  etat: 'L' | 'N';
  cptId: string;
}

// --- Rôle (RoleDto — pas de @JsonProperty) ---
export interface Role {
  cptId: string;
  tabId: string;
  /** 'A' = Admin, 'M' = Membre, 'C' = Créateur, 'E' = En attente */
  rolRole: 'A' | 'M' | 'C' | 'E';
  cptPseudo?: string;
  tabNom?: string;
}

// --- Membre (MembreDto — pas de @JsonProperty) ---
export interface Membre {
  cptId: string;
  carId: string;
  dateCreation: string;
}

// --- Commentaire (CommentaireDto — pas de @JsonProperty) ---
export interface Commentaire {
  id: string;
  carteId: string;
  auteurId: string;
  contenu: string;
  dateCreation: string;
}

// --- Document (DocumentDto — pas de @JsonProperty) ---
export interface Document {
  id: string;
  carteId: string;
  nomFichier: string;
  url: string;
  dateCreation: string;
}

// --- Auth (local, pas de DTO Tomcat) ---
export interface AuthUser {
  cpt_id: string;
  cpt_pseudo: string;
  cpt_role: string;
}