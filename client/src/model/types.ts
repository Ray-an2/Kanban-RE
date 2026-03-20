export interface Compte {
  id: string;
  pseudo: string;
  role: string;
}

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

export interface Tableau {
  tab_id: string;
  tab_nom: string;
  tab_description?: string;
  tab_date: string;
  tab_etat: 'O' | 'F';
  tab_image?: string | null;
}

export interface Liste {
  lis_id: string;
  lis_titre: string;
  lis_ordre: number;
  lis_etat: 'P' | 'A';
  tab_id: string;
  cartes: Carte[];
}

export interface Carte {
  car_id: string;
  car_nom: string;
  car_description?: string;
  car_archiver: 'O' | 'N';
  car_terminer: 'T' | 'N';
  car_ordre: string;
  car_priorite: number;
  car_date_creation: string;
  car_date_debut?: string;
  car_date_fin?: string;
  car_couverture?: string;
  lis_id: string;
}

export interface Etiquette {
  id: string;
  nom: string;
  couleur: string;
}

export interface Associer {
  carId: string;
  etiId: string;
  carNom?: string;
  etiNom?: string;
}

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

export interface Notification {
  id: string;
  titre: string;
  dateCreation: string;
  lien?: string;
  etat: 'L' | 'N';
  cptId: string;
}

export interface Role {
  cptId: string;
  tabId: string;
  rolRole: 'A' | 'M' | 'C' | 'E';
  cptPseudo?: string;
  tabNom?: string;
}

export interface Membre {
  cptId: string;
  carId: string;
  dateCreation: string;
}

export interface Commentaire {
  id: string;
  carteId: string;
  auteurId: string;
  contenu: string;
  dateCreation: string;
}

export interface Document {
  id: string;
  carteId: string;
  nomFichier: string;
  url: string;
  dateCreation: string;
}

export interface AuthUser {
  cpt_id: string;
  cpt_pseudo: string;
  cpt_role: string;
}