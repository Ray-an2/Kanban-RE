export interface Compte {
  cpt_id: string;
  cpt_pseudo: string;
  cpt_mdp: string;
}

export interface Profil {
  pfl_nom?: string;
  pfl_prenom?: string;
  pfl_mail?: string;
  pfl_etat: 'A' | 'D';
  pfl_date?: string;
  cpt_id: string;
}

export interface UserWithProfile extends Compte {
  profil?: Profil;
}

export interface Tableau {
  tab_id: string;
  tab_nom: string;
  tab_description?: string;
  tab_date: string;
  tab_etat: 'A' | 'I';
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
  car_des?: string;
  car_archiver: 'O' | 'N';
  car_terminer: 'O' | 'N';
  car_priorite: number;
  car_ordre: number;
  car_dateCreation: string;
  car_dateDebut?: string;
  car_dateFin?: string;
  car_couverture?: string;
  lis_id: string;
}

export interface Etiquette {
  eti_id: string;
  eti_nom: string;
  eti_couleur: string;
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

export interface Role {
  cpt_id: string;
  tab_id: string;
  rol_role: 'admin' | 'user' | 'lecteur';
}

export interface Notification {
  not_id: string;
  not_titre: string;
  not_date: string;
  not_lien?: string;
  not_lue: 'O' | 'N';
  cpt_id: string;
}
