package com.kanban.associer.service.impl;

import com.kanban.associer.dtos.AssocierDto;
import com.kanban.associer.entity.Associer;
import com.kanban.associer.entity.AssocierId;
import com.kanban.associer.repository.AssocierRepository;
import com.kanban.associer.service.AssocierService;
import com.kanban.associer.mappers.AssocierMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("AssocierService")
@Transactional
public class AssocierServiceImpl implements AssocierService {

  private final AssocierRepository associerRepository;
  private final AssocierMapper associerMapper;

  public AssocierServiceImpl(AssocierRepository associerRepository, AssocierMapper associerMapper) {
    this.associerRepository = associerRepository;
    this.associerMapper = associerMapper;
  }

  @Override
  @Transactional(readOnly = true)
  public List<AssocierDto> getAllAssocier() {
    return associerRepository.findAll()
            .stream()
            .map(associerMapper::toDto)
            .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public List<AssocierDto> getAssocierByCarId(String carId) {
    /*
     * BUG CORRIGÉ : lever une EntityNotFoundException quand une carte
     * n'a aucune étiquette est incorrect — c'est une situation normale.
     * On retourne une liste vide.
     */
    return associerRepository.findByCarId(carId)
            .stream()
            .map(associerMapper::toDto)
            .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public List<AssocierDto> getAssocierByEtiId(String etiId) {
    /*
     * BUG CORRIGÉ : même raison — une étiquette peut n'être associée
     * à aucune carte. On retourne une liste vide.
     */
    return associerRepository.findByEtiId(etiId)
            .stream()
            .map(associerMapper::toDto)
            .toList();
  }

  @Override
  public AssocierDto createAssocier(AssocierDto associerDto) {
    if (associerRepository.existsByCarIdAndEtiId(associerDto.getCarId(), associerDto.getEtiId())) {
      throw new IllegalStateException(
              "La carte " + associerDto.getCarId() + " a déjà cette étiquette."
      );
    }
    Associer associer = associerMapper.toEntity(associerDto);
    Associer saved = associerRepository.save(associer);
    return associerMapper.toDto(saved);
  }

  @Override
  public boolean deleteAssocier(String carId, String etiId) {
    AssocierId id = new AssocierId(carId, etiId);
    if (!associerRepository.existsById(id)) {
      throw new EntityNotFoundException(
              "Association introuvable pour la carte : " + carId + " et l'étiquette : " + etiId
      );
    }
    associerRepository.deleteById(id);
    return true;
  }
}