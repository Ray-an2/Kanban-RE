package com.kanban.compte.service.impl;

import com.kanban.compte.dtos.CompteDto;
import com.kanban.compte.entity.Compte;
import com.kanban.compte.mappers.CompteMapper;
import com.kanban.compte.repository.CompteRepository;
import com.kanban.compte.service.CompteService;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service("compteService")
@Transactional
public class CompteServiceImpl implements CompteService {

  private final CompteRepository compteRepository;
  private final CompteMapper compteMapper;

  /**
   * Constructeur de CompteServiceImpl.
   *
   * @param compteRepository le repository pour accéder aux données des comptes
   * @param compteMapper le mapper pour convertir entre Compte et CompteDto
   */
  public CompteServiceImpl(CompteRepository compteRepository, CompteMapper compteMapper) {
    this.compteRepository = compteRepository;
    this.compteMapper = compteMapper;
  }

  @Override
  @Transactional
  public CompteDto create(CompteDto compteDto) {
    Compte compte = compteMapper.toEntity(compteDto);
    Compte savedCompte = compteRepository.save(compte);
    return compteMapper.toDto(savedCompte);
  }

  @Override
  @Transactional
  public CompteDto update(CompteDto compteDto) {
    if (compteDto.getId() == null) {
      throw new IllegalArgumentException("L'id du compte doit être fourni pour la mise à jour");
    }
    Compte existingCompte = compteRepository.findById(compteDto.getId())
        .orElseThrow(() -> new EntityNotFoundException("Aucun compte trouvé avec l'id " + compteDto.getId()));
    existingCompte.setPseudo(compteDto.getPseudo());
    existingCompte.setRole(compteDto.getRole());
    Compte updatedCompte = compteRepository.save(existingCompte);
    return compteMapper.toDto(updatedCompte);
  }

  @Override
  public CompteDto getCompte(Long compteId) {
    Compte compte = compteRepository.findById(compteId)
        .orElseThrow(() -> new EntityNotFoundException("Aucun compte trouvé avec l'id " + compteId));
    return compteMapper.toDto(compte);
  }

  @inheritDoc
  @Override
  public boolean delete(Long compteId) {
    if (!compteRepository.existsById(compteId)) {
      return false;
    }
    compteRepository.deleteById(compteId);
    return true;
  }

  @Override
  public List<CompteDto> getAll() {
    List<Compte> comptes = (List<Compte>) compteRepository.findAll();
    return comptes.stream().map(compteMapper::toDto).toList();
  }

  @Override
  public List<CompteDto> getByRole(String role) {
    List<Compte> comptes = (List<Compte>) compteRepository.findByRole(role);
    return comptes.stream().map(compteMapper::toDto).toList();
   }
}