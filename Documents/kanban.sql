PRAGMA foreign_keys = ON;
BEGIN TRANSACTION;

CREATE TABLE t_compte_cpt (
  cpt_id TEXT NOT NULL,
  cpt_pseudo TEXT NOT NULL,
  cpt_mdp TEXT NOT NULL,
  cpt_role TEXT NOT NULL,
  PRIMARY KEY (cpt_id),
  UNIQUE (cpt_pseudo)
);

CREATE TABLE t_tableau_tab (
  tab_id TEXT NOT NULL,
  tab_nom TEXT NOT NULL,
  tab_description TEXT,
  tab_date TEXT NOT NULL,
  tab_etat TEXT NOT NULL DEFAULT 'A',
  tab_image TEXT,
  PRIMARY KEY (tab_id)
);

CREATE TABLE t_liste_lis (
  lis_id TEXT NOT NULL,
  lis_titre TEXT NOT NULL,
  lis_ordre INTEGER NOT NULL,
  lis_etat TEXT NOT NULL DEFAULT 'P',
  tab_id TEXT NOT NULL,
  PRIMARY KEY (lis_id),
  FOREIGN KEY (tab_id) REFERENCES t_tableau_tab(tab_id) ON DELETE CASCADE
);

CREATE TABLE t_carte_car (
  car_id TEXT NOT NULL,
  car_nom TEXT NOT NULL,
  car_des TEXT,
  car_archiver TEXT NOT NULL DEFAULT 'N',
  car_terminer TEXT NOT NULL DEFAULT 'N',
  car_priorite INTEGER DEFAULT 0,
  car_ordre INTEGER NOT NULL DEFAULT 0,
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
  cpt_id TEXT NOT NULL,
  car_id TEXT NOT NULL,
  mem_date TEXT NOT NULL,
  PRIMARY KEY (cpt_id, car_id),
  FOREIGN KEY (cpt_id) REFERENCES t_compte_cpt(cpt_id) ON DELETE CASCADE,
  FOREIGN KEY (car_id) REFERENCES t_carte_car(car_id) ON DELETE CASCADE
);

CREATE TABLE t_notification_not (
  not_id TEXT NOT NULL,
  not_titre TEXT,
  not_date TEXT NOT NULL,
  not_lien TEXT,
  cpt_id TEXT,
  PRIMARY KEY (not_id),
  FOREIGN KEY (cpt_id) REFERENCES t_compte_cpt(cpt_id) ON DELETE SET NULL
);

CREATE TABLE t_profil_pfl (
  pfl_nom TEXT,
  pfl_prenom TEXT,
  pfl_mail TEXT,
  pfl_etat TEXT NOT NULL DEFAULT 'D',
  pfl_date TEXT,
  cpt_id TEXT NOT NULL,
  PRIMARY KEY (cpt_id),
  FOREIGN KEY (cpt_id) REFERENCES t_compte_cpt(cpt_id) ON DELETE CASCADE
);

CREATE TABLE t_role_rol (
  cpt_id TEXT NOT NULL,
  tab_id TEXT NOT NULL,
  rol_role TEXT NOT NULL,
  PRIMARY KEY (cpt_id, tab_id),
  FOREIGN KEY (tab_id) REFERENCES t_tableau_tab(tab_id) ON DELETE CASCADE,
  FOREIGN KEY (cpt_id) REFERENCES t_compte_cpt(cpt_id) ON DELETE CASCADE
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
CREATE INDEX idx_notif_cpt_id ON t_notification_not (cpt_id);
CREATE INDEX idx_role_tab_id ON t_role_rol (tab_id);

INSERT INTO t_compte_cpt (cpt_id, cpt_pseudo, cpt_mdp, cpt_role) VALUES
  ('cpt_001', 'a.martin', '7f3f2b1c5d6e7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2', 'A'),
  ('cpt_002', 'l.dupont', '9c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1', 'U'),
  ('cpt_003', 's.bernard', '1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f8', 'U'),
  ('cpt_004', 'p.legrand', '0f1e2d3c4b5a69788796a5b4c3d2e1f00112233445566778899aabbccddeeff', 'U');

INSERT INTO t_profil_pfl (pfl_nom, pfl_prenom, pfl_mail, pfl_etat, pfl_date, cpt_id) VALUES
  ('Martin', 'Alice', 'alice.martin@acme-consulting.fr', 'D', '2026-03-01T09:10:00Z', 'cpt_001'),
  ('Dupont', 'Lucas', 'lucas.dupont@acme-consulting.fr', 'D', '2026-03-02T10:05:00Z', 'cpt_002'),
  ('Bernard', 'Sophie', 'sophie.bernard@acme-consulting.fr', 'D', '2026-03-03T08:45:00Z', 'cpt_003'),
  ('Legrand', 'Paul', 'paul.legrand@acme-consulting.fr', 'D', '2026-03-04T11:20:00Z', 'cpt_004');

INSERT INTO t_tableau_tab (tab_id, tab_nom, tab_description, tab_date, tab_etat, tab_image) VALUES
  ('tab_roadmap_2026', 'Roadmap Produit 2026', 'Planification des livrables produit pour 2026.', '2026-03-10T09:00:00Z', 'A', 'https://cdn.acme-consulting.fr/boards/roadmap.jpg'),
  ('tab_client_onboarding', 'Onboarding Clients', 'Suivi des étapes d''intégration des nouveaux clients.', '2026-03-09T14:30:00Z', 'A', 'https://cdn.acme-consulting.fr/boards/onboarding.jpg');

INSERT INTO t_role_rol (cpt_id, tab_id, rol_role) VALUES
  ('cpt_001', 'tab_roadmap_2026', 'A'),
  ('cpt_002', 'tab_roadmap_2026', 'M'),
  ('cpt_003', 'tab_roadmap_2026', 'M'),
  ('cpt_001', 'tab_client_onboarding', 'A'),
  ('cpt_004', 'tab_client_onboarding', 'M'),
  ('cpt_003', 'tab_client_onboarding', 'M');

INSERT INTO t_liste_lis (lis_id, lis_titre, lis_ordre, lis_etat, tab_id) VALUES
  ('lis_rm_backlog', 'Backlog', 1, 'A', 'tab_roadmap_2026'),
  ('lis_rm_en_cours', 'En cours', 2, 'A', 'tab_roadmap_2026'),
  ('lis_rm_termine', 'Terminé', 3, 'A', 'tab_roadmap_2026'),
  ('lis_onb_a_faire', 'À faire', 1, 'A', 'tab_client_onboarding'),
  ('lis_onb_en_cours', 'En cours', 2, 'A', 'tab_client_onboarding'),
  ('lis_onb_fait', 'Fait', 3, 'A', 'tab_client_onboarding');

INSERT INTO t_carte_car (
  car_id, car_nom, car_des, car_archiver, car_terminer, car_priorite,
  car_ordre, car_dateCreation, car_dateDebut, car_dateFin, car_couverture, lis_id
) VALUES
  ('car_spec_api', 'Spécification API v2', 'Rédiger les spécifications fonctionnelles et techniques.', '0', '0', 2, 0,
   '2026-03-10T10:00:00Z', '2026-03-10T11:00:00Z', NULL, NULL, 'lis_rm_backlog'),
  ('car_design_system', 'Design system', 'Définir les composants UI réutilisables.', '0', '0', 3, 0,
   '2026-03-10T10:30:00Z', '2026-03-11T09:00:00Z', NULL, NULL, 'lis_rm_en_cours'),
  ('car_release_notes', 'Release notes Q1', 'Préparer les notes de version pour le Q1.', '0', '1', 1, 0,
   '2026-03-05T08:20:00Z', '2026-03-06T09:00:00Z', '2026-03-07T16:00:00Z', NULL, 'lis_rm_termine'),
  ('car_kickoff', 'Réunion de lancement', 'Organiser la réunion de lancement du client.', '0', '0', 2, 0,
   '2026-03-09T15:00:00Z', '2026-03-10T09:30:00Z', NULL, NULL, 'lis_onb_a_faire'),
  ('car_access_setup', 'Création des accès', 'Créer les comptes et accès aux outils.', '0', '0', 3, 0,
   '2026-03-09T16:10:00Z', '2026-03-11T09:30:00Z', NULL, NULL, 'lis_onb_en_cours'),
  ('car_training', 'Session de formation', 'Préparer le support et planifier la formation.', '0', '1', 1, 0,
   '2026-03-02T09:00:00Z', '2026-03-03T10:00:00Z', '2026-03-04T12:00:00Z', NULL, 'lis_onb_fait');

INSERT INTO t_etiquette_eti (eti_id, eti_nom, eti_couleur) VALUES
  ('eti_feature', 'Feature', '#2E86AB'),
  ('eti_bug', 'Bug', '#D9534F'),
  ('eti_urgent', 'Urgent', '#F0AD4E'),
  ('eti_doc', 'Documentation', '#5BC0DE');

INSERT INTO t_associer_as (eti_id, car_id) VALUES
  ('eti_feature', 'car_spec_api'),
  ('eti_doc', 'car_spec_api'),
  ('eti_feature', 'car_design_system'),
  ('eti_urgent', 'car_access_setup'),
  ('eti_doc', 'car_release_notes');

INSERT INTO t_membre_mem (cpt_id, car_id, mem_date) VALUES
  ('cpt_001', 'car_spec_api', '2026-03-10T10:05:00Z'),
  ('cpt_002', 'car_design_system', '2026-03-11T09:05:00Z'),
  ('cpt_003', 'car_access_setup', '2026-03-11T10:00:00Z'),
  ('cpt_004', 'car_kickoff', '2026-03-10T09:40:00Z');

INSERT INTO t_notification_not (not_id, not_titre, not_date, not_lien, cpt_id) VALUES
  ('not_001', 'Nouvelle carte assignée', '2026-03-11T10:01:00Z', '/tableau/tab_client_onboarding', 'cpt_003'),
  ('not_002', 'Carte terminée', '2026-03-07T16:05:00Z', '/tableau/tab_roadmap_2026', 'cpt_001');

INSERT INTO t_journal_jou (jou_id, jou_titre, jou_description, jou_auteur, jou_action, jou_date, jou_etat) VALUES
  ('jou_001', 'Création tableau', 'Création du tableau Roadmap Produit 2026.', 'a.martin', 'CREATE_BOARD', '2026-03-10T09:00:00Z', 'A'),
  ('jou_002', 'Carte déplacée', 'La carte Design system est passée en En cours.', 'l.dupont', 'MOVE_CARD', '2026-03-11T09:15:00Z', 'A'),
  ('jou_003', 'Carte terminée', 'La carte Release notes Q1 est terminée.', 'a.martin', 'COMPLETE_CARD', '2026-03-07T16:00:00Z', 'A');

COMMIT;
