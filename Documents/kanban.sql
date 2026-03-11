-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : mariadb:3306
-- Généré le : mer. 11 mars 2026 à 10:01
-- Version du serveur : 11.4.10-MariaDB-ubu2404
-- Version de PHP : 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `kanban`
--

-- --------------------------------------------------------

--
-- Structure de la table `t_associer_as`
--

CREATE TABLE `t_associer_as` (
  `eti_id` varchar(64) NOT NULL,
  `car_id` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `t_carte_car`
--

CREATE TABLE `t_carte_car` (
  `car_id` varchar(64) NOT NULL,
  `car_nom` varchar(100) NOT NULL,
  `car_des` varchar(500) DEFAULT NULL,
  `car_archiver` char(1) NOT NULL,
  `car_terminer` char(1) NOT NULL,
  `car_priorite` tinyint(4) DEFAULT NULL,
  `car_dateCreation` datetime NOT NULL,
  `car_dateDebut` datetime DEFAULT NULL,
  `car_dateFin` datetime DEFAULT NULL,
  `car_couverture` varchar(200) DEFAULT NULL,
  `lis_id` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `t_compte_cpt`
--

CREATE TABLE `t_compte_cpt` (
  `cpt_pseudo` varchar(100) NOT NULL,
  `cpt_mdp` char(128) NOT NULL,
  `cpt_role` char(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `t_etiquette_eti`
--

CREATE TABLE `t_etiquette_eti` (
  `eti_id` varchar(64) NOT NULL,
  `eti_nom` varchar(100) NOT NULL,
  `eti_couleur` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `t_journal_jou`
--

CREATE TABLE `t_journal_jou` (
  `jou_id` varchar(64) NOT NULL,
  `jou_titre` varchar(100) NOT NULL,
  `jou_description` varchar(500) NOT NULL,
  `jou_auteur` varchar(100) NOT NULL,
  `jou_action` varchar(50) NOT NULL,
  `jou_date` datetime NOT NULL,
  `jou_etat` char(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `t_liste_lis`
--

CREATE TABLE `t_liste_lis` (
  `lis_id` varchar(64) NOT NULL,
  `lis_titre` varchar(100) NOT NULL,
  `lis_ordre` int(11) NOT NULL,
  `lis_etat` char(1) NOT NULL,
  `tab_id` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `t_membre_mem`
--

CREATE TABLE `t_membre_mem` (
  `cpt_pseudo` varchar(100) NOT NULL,
  `car_id` varchar(64) NOT NULL,
  `mem_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `t_notification_not`
--

CREATE TABLE `t_notification_not` (
  `not_id` varchar(64) NOT NULL,
  `not_titre` varchar(100) DEFAULT NULL,
  `not_date` datetime NOT NULL,
  `not_lien` varchar(200) DEFAULT NULL,
  `cpt_pseudo` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `t_profil_pfl`
--

CREATE TABLE `t_profil_pfl` (
  `pfl_nom` varchar(100) DEFAULT NULL,
  `pfl_prenom` varchar(100) DEFAULT NULL,
  `pfl_mail` varchar(200) DEFAULT NULL,
  `pfl_date` datetime DEFAULT NULL,
  `cpt_pseudo` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `t_role_rol`
--

CREATE TABLE `t_role_rol` (
  `cpt_pseudo` varchar(100) NOT NULL,
  `tab_id` varchar(64) NOT NULL,
  `rol_role` char(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `t_tableau_tab`
--

CREATE TABLE `t_tableau_tab` (
  `tab_id` varchar(64) NOT NULL,
  `tab_nom` varchar(100) NOT NULL,
  `tab_description` varchar(500) DEFAULT NULL,
  `tab_date` datetime NOT NULL,
  `tab_etat` char(1) NOT NULL,
  `tab_image` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `t_associer_as`
--
ALTER TABLE `t_associer_as`
  ADD PRIMARY KEY (`eti_id`,`car_id`),
  ADD KEY `fk_cei_carte` (`car_id`);

--
-- Index pour la table `t_carte_car`
--
ALTER TABLE `t_carte_car`
  ADD PRIMARY KEY (`car_id`),
  ADD KEY `lis_id` (`lis_id`);

--
-- Index pour la table `t_compte_cpt`
--
ALTER TABLE `t_compte_cpt`
  ADD PRIMARY KEY (`cpt_pseudo`);

--
-- Index pour la table `t_etiquette_eti`
--
ALTER TABLE `t_etiquette_eti`
  ADD PRIMARY KEY (`eti_id`);

--
-- Index pour la table `t_journal_jou`
--
ALTER TABLE `t_journal_jou`
  ADD PRIMARY KEY (`jou_id`);

--
-- Index pour la table `t_liste_lis`
--
ALTER TABLE `t_liste_lis`
  ADD PRIMARY KEY (`lis_id`),
  ADD KEY `fk_liste_tableau` (`tab_id`);

--
-- Index pour la table `t_membre_mem`
--
ALTER TABLE `t_membre_mem`
  ADD PRIMARY KEY (`cpt_pseudo`,`car_id`),
  ADD KEY `fk_compte_carte` (`car_id`);

--
-- Index pour la table `t_notification_not`
--
ALTER TABLE `t_notification_not`
  ADD PRIMARY KEY (`not_id`);

--
-- Index pour la table `t_profil_pfl`
--
ALTER TABLE `t_profil_pfl`
  ADD PRIMARY KEY (`cpt_pseudo`);

--
-- Index pour la table `t_role_rol`
--
ALTER TABLE `t_role_rol`
  ADD PRIMARY KEY (`cpt_pseudo`,`tab_id`),
  ADD KEY `fk_compte_tableau` (`tab_id`);

--
-- Index pour la table `t_tableau_tab`
--
ALTER TABLE `t_tableau_tab`
  ADD PRIMARY KEY (`tab_id`);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `t_associer_as`
--
ALTER TABLE `t_associer_as`
  ADD CONSTRAINT `fk_cei_carte` FOREIGN KEY (`car_id`) REFERENCES `t_carte_car` (`car_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_cei_etiquette` FOREIGN KEY (`eti_id`) REFERENCES `t_etiquette_eti` (`eti_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `t_carte_car`
--
ALTER TABLE `t_carte_car`
  ADD CONSTRAINT `t_carte_car_ibfk_1` FOREIGN KEY (`lis_id`) REFERENCES `t_liste_lis` (`lis_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `t_liste_lis`
--
ALTER TABLE `t_liste_lis`
  ADD CONSTRAINT `fk_liste_tableau` FOREIGN KEY (`tab_id`) REFERENCES `t_tableau_tab` (`tab_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `t_membre_mem`
--
ALTER TABLE `t_membre_mem`
  ADD CONSTRAINT `fk_carte_compte` FOREIGN KEY (`cpt_pseudo`) REFERENCES `t_compte_cpt` (`cpt_pseudo`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_compte_carte` FOREIGN KEY (`car_id`) REFERENCES `t_carte_car` (`car_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `t_notification_not`
--
ALTER TABLE `t_notification_not`
  ADD CONSTRAINT `fk_not_cpt` FOREIGN KEY (`cpt_pseudo`) REFERENCES `t_compte_cpt` (`cpt_pseudo`);

--
-- Contraintes pour la table `t_profil_pfl`
--
ALTER TABLE `t_profil_pfl`
  ADD CONSTRAINT `fk_profil_compte` FOREIGN KEY (`cpt_pseudo`) REFERENCES `t_compte_cpt` (`cpt_pseudo`) ON DELETE CASCADE;

--
-- Contraintes pour la table `t_role_rol`
--
ALTER TABLE `t_role_rol`
  ADD CONSTRAINT `fk_compte_tableau` FOREIGN KEY (`tab_id`) REFERENCES `t_tableau_tab` (`tab_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_tableau_compte` FOREIGN KEY (`cpt_pseudo`) REFERENCES `t_compte_cpt` (`cpt_pseudo`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
