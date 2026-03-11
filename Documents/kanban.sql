PRAGMA foreign_keys = ON;
BEGIN TRANSACTION;

CREATE TABLE t_compte_cpt (
  cpt_pseudo TEXT NOT NULL,
  cpt_mdp TEXT NOT NULL,
  cpt_role TEXT NOT NULL,
  PRIMARY KEY (cpt_pseudo)
);

CREATE TABLE t_tableau_tab (
  tab_id TEXT NOT NULL,
  tab_nom TEXT NOT NULL,
  tab_description TEXT,
  tab_date TEXT NOT NULL,
  tab_etat TEXT NOT NULL,
  tab_image TEXT,
  PRIMARY KEY (tab_id)
);

CREATE TABLE t_liste_lis (
  lis_id TEXT NOT NULL,
  lis_titre TEXT NOT NULL,
  lis_ordre INTEGER NOT NULL,
  lis_etat TEXT NOT NULL,
  tab_id TEXT NOT NULL,
  PRIMARY KEY (lis_id),
  FOREIGN KEY (tab_id) REFERENCES t_tableau_tab(tab_id) ON DELETE CASCADE
);

CREATE TABLE t_carte_car (
  car_id TEXT NOT NULL,
  car_nom TEXT NOT NULL,
  car_des TEXT,
  car_archiver TEXT NOT NULL,
  car_terminer TEXT NOT NULL,
  car_priorite INTEGER,
  car_dateCreation TEXT NOT NULL,
  car_dateDebut TEXT,
  car_dateFin TEXT,
  car_couverture TEXT,
  lis_id TEXT NOT NULL,
  PRIMARY KEY (car_id),
  FOREIGN KEY (lis_id) REFERENCES t_liste_lis(lis_id) ON DELETE CASCADE
);

CREATE TABLE t_etiquette_eti (
  eti_id TEXT NOT NULL,
  eti_nom TEXT NOT NULL,
  eti_couleur TEXT,
  PRIMARY KEY (eti_id)
);

CREATE TABLE t_associer_as (
  eti_id TEXT NOT NULL,
  car_id TEXT NOT NULL,
  PRIMARY KEY (eti_id, car_id),
  FOREIGN KEY (car_id) REFERENCES t_carte_car(car_id) ON DELETE CASCADE,
  FOREIGN KEY (eti_id) REFERENCES t_etiquette_eti(eti_id) ON DELETE CASCADE
);

CREATE TABLE t_membre_mem (
  cpt_pseudo TEXT NOT NULL,
  car_id TEXT NOT NULL,
  mem_date TEXT NOT NULL,
  PRIMARY KEY (cpt_pseudo, car_id),
  FOREIGN KEY (cpt_pseudo) REFERENCES t_compte_cpt(cpt_pseudo) ON DELETE CASCADE,
  FOREIGN KEY (car_id) REFERENCES t_carte_car(car_id) ON DELETE CASCADE
);

CREATE TABLE t_notification_not (
  not_id TEXT NOT NULL,
  not_titre TEXT,
  not_date TEXT NOT NULL,
  not_lien TEXT,
  cpt_pseudo TEXT,
  PRIMARY KEY (not_id),
  FOREIGN KEY (cpt_pseudo) REFERENCES t_compte_cpt(cpt_pseudo)
);

CREATE TABLE t_profil_pfl (
  pfl_nom TEXT,
  pfl_prenom TEXT,
  pfl_mail TEXT,
  pfl_date TEXT,
  cpt_pseudo TEXT NOT NULL,
  PRIMARY KEY (cpt_pseudo),
  FOREIGN KEY (cpt_pseudo) REFERENCES t_compte_cpt(cpt_pseudo) ON DELETE CASCADE
);

CREATE TABLE t_role_rol (
  cpt_pseudo TEXT NOT NULL,
  tab_id TEXT NOT NULL,
  rol_role TEXT NOT NULL,
  PRIMARY KEY (cpt_pseudo, tab_id),
  FOREIGN KEY (tab_id) REFERENCES t_tableau_tab(tab_id) ON DELETE CASCADE,
  FOREIGN KEY (cpt_pseudo) REFERENCES t_compte_cpt(cpt_pseudo) ON DELETE CASCADE
);

CREATE TABLE t_journal_jou (
  jou_id TEXT NOT NULL,
  jou_titre TEXT NOT NULL,
  jou_description TEXT NOT NULL,
  jou_auteur TEXT NOT NULL,
  jou_action TEXT NOT NULL,
  jou_date TEXT NOT NULL,
  jou_etat TEXT NOT NULL,
  PRIMARY KEY (jou_id)
);

CREATE INDEX idx_associer_car_id ON t_associer_as (car_id);
CREATE INDEX idx_carte_lis_id ON t_carte_car (lis_id);
CREATE INDEX idx_liste_tab_id ON t_liste_lis (tab_id);
CREATE INDEX idx_membre_car_id ON t_membre_mem (car_id);
CREATE INDEX idx_notif_cpt_pseudo ON t_notification_not (cpt_pseudo);
CREATE INDEX idx_role_tab_id ON t_role_rol (tab_id);

COMMIT;
