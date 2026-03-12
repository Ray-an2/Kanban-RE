// Compte (t_compte_cpt)
export interface Compte {
  cpt_id: string;
  cpt_pseudo: string;
  cpt_mdp: string;
  cpt_role: string;
}

// Tableau (t_tableau_tab)
export interface Tableau {
  tab_id: string;
  tab_nom: string;
  tab_description: string | null;
  tab_date: string; // Format: YYYY-MM-DD HH:MM:SS
  tab_etat: 'A' | 'I'; // A=Actif, I=Inactif
  tab_image: string | null;
}

// Liste (t_liste_lis)
export interface Liste {
  lis_id: string;
  lis_titre: string;
  lis_ordre: number;
  lis_etat: 'P' | 'A'; // P=Privée, A=Archivée
  tab_id: string;
}

// Carte (t_carte_car)
export interface Carte {
  car_id: string;
  car_nom: string;
  car_des: string | null;
  car_archiver: 'O' | 'N'; // O=Oui, N=Non
  car_terminer: 'O' | 'N'; // O=Oui, N=Non
  car_priorite: number; // 0=aucune, 1=faible, 2=moyenne, 3=élevée
  car_ordre: number;
  car_dateCreation: string; // Format: YYYY-MM-DD HH:MM:SS
  car_dateDebut: string | null; // Format: YYYY-MM-DD HH:MM:SS
  car_dateFin: string | null; // Format: YYYY-MM-DD HH:MM:SS
  car_couverture: string | null;
  lis_id: string;
}

// Étiquette (t_etiquette_eti)
export interface Etiquette {
  eti_id: string;
  eti_nom: string;
  eti_couleur: string;
}

// Association Étiquette-Carte (t_associer_as)
export interface AssociationEtiquette {
  eti_id: string;
  car_id: string;
}

// Membre (t_membre_mem)
export interface Membre {
  cpt_id: string;
  car_id: string;
  mem_date: string; // Format: YYYY-MM-DD HH:MM:SS
}

// Notification (t_notification_not)
export interface Notification {
  not_id: string;
  not_titre: string | null;
  not_date: string; // Format: YYYY-MM-DD HH:MM:SS
  not_lien: string | null;
  cpt_id: string | null;
}

// Profil (t_profil_pfl)
export interface Profil {
  pfl_nom: string | null;
  pfl_prenom: string | null;
  pfl_mail: string | null;
  pfl_etat: 'A' | 'D'; // A=Actif, D=Désactivé
  pfl_date: string | null; // Format: YYYY-MM-DD HH:MM:SS
  cpt_id: string;
}

// Rôle (t_role_rol)
export interface Role {
  cpt_id: string;
  tab_id: string;
  rol_role: 'admin' | 'membre' | 'lecteur'; // Rôles possibles
}

// Journal (t_journal_jou)
export interface Journal {
  jou_id: string;
  jou_titre: string;
  jou_description: string;
  jou_auteur: string;
  jou_action: string;
  jou_date: string; // Format: YYYY-MM-DD HH:MM:SS
  jou_etat: string;
}

// Types pour les données combinées (pour les pages)
export interface UserWithProfile extends Compte {
  profil?: Profil;
}

export interface BoardWithLists extends Tableau {
  listes?: Liste[];
}

export interface CardWithDetails extends Carte {
  etiquettes?: Etiquette[];
  membres?: Compte[];
  liste?: Liste;
}

export interface NotificationWithDetails extends Notification {
  compte?: Compte;
}
