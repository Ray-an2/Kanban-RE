package com.kanban.compte.service.impl;

import com.kanban.compte.dtos.CompteCreateDto;
import com.kanban.compte.dtos.CompteDto;
import com.kanban.compte.entity.Compte;
import com.kanban.compte.mappers.CompteMapper;
import com.kanban.compte.repository.CompteRepository;
import com.kanban.compte.service.CompteService;
import com.kanban.profil.entity.Profil;
import com.kanban.profil.repository.ProfilRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service("compteService")
@Transactional
public class CompteServiceImpl implements CompteService {

  private final CompteRepository compteRepository;
  private final CompteMapper compteMapper;
  private final ProfilRepository profilRepository;

  public CompteServiceImpl(CompteRepository compteRepository,
                           CompteMapper compteMapper,
                           ProfilRepository profilRepository) {
    this.compteRepository = compteRepository;
    this.compteMapper = compteMapper;
    this.profilRepository = profilRepository;
  }

  // -------------------------------------------------------------------------
  // Création compte + profil en une seule transaction
  // -------------------------------------------------------------------------

  /**
   * Crée un compte et son profil associé en une seule transaction.
   *
   * Le mot de passe reçu dans CompteCreateDto doit déjà être haché
   * par le serveur Deno (scrypt + sel) — Tomcat ne hache jamais les mots
   * de passe, il les stocke tels quels.
   *
   * Retourne un CompteDto public (sans mot de passe).
   */
  @Override
  public CompteDto create(CompteCreateDto compteCreateDto) {
    // Vérifier que le pseudo n'est pas déjà pris
    if (compteRepository.existsByPseudo(compteCreateDto.getPseudo())) {
      throw new IllegalStateException(
              "Le pseudo « " + compteCreateDto.getPseudo() + " » est déjà utilisé");
    }

    // Créer le compte
    Compte compte = compteMapper.toEntityFromCreate(compteCreateDto);
    compte.setId(UUID.randomUUID().toString());
    Compte saved = compteRepository.save(compte);

    // Créer le profil associé dans la même transaction
    Profil profil = new Profil();
    profil.setCompteId(saved.getId());
    profil.setNom(compteCreateDto.getNom());
    profil.setPrenom(compteCreateDto.getPrenom());
    profil.setMail(compteCreateDto.getMail());
    profil.setEtat("A");
    profil.setDateCreation(Instant.now().toString());
    profilRepository.save(profil);

    return compteMapper.toDto(saved);
  }

  // -------------------------------------------------------------------------
  // Mises à jour
  // -------------------------------------------------------------------------

  /**
   * Met à jour le pseudo d'un compte.
   */
  @Override
  public CompteDto updatePseudo(String id, String pseudo) {
    Compte compte = compteRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Aucun compte trouvé avec l'id " + id));

    if (compteRepository.existsByPseudo(pseudo)) {
      throw new IllegalStateException("Le pseudo « " + pseudo + " » est déjà utilisé");
    }

    compte.setPseudo(pseudo);
    return compteMapper.toDto(compteRepository.save(compte));
  }

  /**
   * Met à jour le rôle d'un compte (réservé à l'administration).
   */
  @Override
  public CompteDto updateRole(String id, String role) {
    Compte compte = compteRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Aucun compte trouvé avec l'id " + id));

    compte.setRole(role);
    return compteMapper.toDto(compteRepository.save(compte));
  }

  /**
   * Met à jour le mot de passe haché d'un compte.
   * Le nouveau hash doit avoir été calculé par le serveur Deno.
   */
  @Override
  public void updateMdp(String id, String mdpHache) {
    Compte compte = compteRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Aucun compte trouvé avec l'id " + id));

    compte.setMdp(mdpHache);
    compteRepository.save(compte);
  }

  // -------------------------------------------------------------------------
  // Lecture
  // -------------------------------------------------------------------------

  @Override
  @Transactional(readOnly = true)
  public CompteDto getCompte(String compteId) {
    return compteRepository.findById(compteId)
            .map(compteMapper::toDto)
            .orElseThrow(() -> new EntityNotFoundException("Aucun compte trouvé avec l'id " + compteId));
  }

  @Override
  @Transactional(readOnly = true)
  public List<CompteDto> getAll() {
    return compteRepository.findAll()
            .stream()
            .map(compteMapper::toDto)
            .toList();
  }

  // -------------------------------------------------------------------------
  // Suppression
  // -------------------------------------------------------------------------

  @Override
  public boolean delete(String compteId) {
    if (!compteRepository.existsById(compteId)) {
      return false;
    }
    compteRepository.deleteById(compteId);
    return true;
  }

  // -------------------------------------------------------------------------
  // Utilitaires
  // -------------------------------------------------------------------------

  /**
   * Vérifie si un pseudo est disponible (non utilisé).
   */
  @Override
  @Transactional(readOnly = true)
  public CompteDto getByPseudo(String pseudo) {
    return compteRepository.findByPseudo(pseudo)
            .map(compteMapper::toDto)
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException(
                    "Aucun compte trouvé avec le pseudo : " + pseudo));
  }

  @Override
  @Transactional(readOnly = true)
  public boolean isPseudoDisponible(String pseudo) {
    return !compteRepository.existsByPseudo(pseudo);
  }
}