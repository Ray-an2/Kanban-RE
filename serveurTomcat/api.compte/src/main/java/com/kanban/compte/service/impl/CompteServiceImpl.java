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
import java.util.UUID;

@Service("compteService")
@Transactional
public class CompteServiceImpl implements CompteService {

  private final CompteRepository compteRepository;
  private final CompteMapper compteMapper;

  public CompteServiceImpl(CompteRepository compteRepository, CompteMapper compteMapper) {
    this.compteRepository = compteRepository;
    this.compteMapper = compteMapper;
  }

  @Override
  public CompteDto create(CompteDto compteDto) {
    Compte compte = compteMapper.toEntity(compteDto);
    compte.setId(UUID.randomUUID().toString());
    return compteMapper.toDto(compteRepository.save(compte));
  }

  @Override
  public CompteDto update(String id, CompteDto compteDto) {
    Compte existingCompte = compteRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Aucun compte trouvé avec l'id " + id));
    existingCompte.setPseudo(compteDto.getPseudo());
    existingCompte.setRole(compteDto.getRole());
    return compteMapper.toDto(compteRepository.save(existingCompte));
  }

  @Override
  @Transactional(readOnly = true)
  public CompteDto getCompte(String compteId) {
    return compteRepository.findById(compteId)
            .map(compteMapper::toDto)
            .orElseThrow(() -> new EntityNotFoundException("Aucun compte trouvé avec l'id " + compteId));
  }

  @Override
  public boolean delete(String compteId) {
    if (!compteRepository.existsById(compteId)) {
      return false;
    }
    compteRepository.deleteById(compteId);
    return true;
  }

  @Override
  @Transactional(readOnly = true)
  public List<CompteDto> getAll() {
    return compteRepository.findAll()
            .stream().map(compteMapper::toDto).toList();
  }
}