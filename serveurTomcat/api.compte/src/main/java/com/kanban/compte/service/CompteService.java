package com.kanban.compte.service;

import com.kanban.compte.dtos.CompteCreateDto;
import com.kanban.compte.dtos.CompteDto;

import java.util.List;

public interface CompteService {

  // Création compte + profil en une seule opération
  CompteDto create(CompteCreateDto compteCreateDto);

  // Mise à jour du pseudo
  CompteDto updatePseudo(String id, String pseudo);

  // Mise à jour du rôle (admin uniquement)
  CompteDto updateRole(String id, String role);

  // Mise à jour du mot de passe haché
  void updateMdp(String id, String mdpHache);

  // Lecture
  CompteDto getCompte(String compteId);
  List<CompteDto> getAll();

  // Suppression
  boolean delete(String compteId);

  // Récupérer un compte par pseudo (pour les invitations)
  CompteDto getByPseudo(String pseudo);

  // Vérification disponibilité pseudo
  boolean isPseudoDisponible(String pseudo);
}