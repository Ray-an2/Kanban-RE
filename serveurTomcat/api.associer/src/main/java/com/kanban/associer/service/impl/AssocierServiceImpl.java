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


  /**
   * Liste tous les associations entre les cartes et les etiquettes.
   * @return la liste des associations.
   */
  @Override
  public List<AssocierDto> getAllAssocier() {
    return associerRepository.findAll().stream()
            .map(associerMapper::toDto)
            .toList();
  }

  /**
   * Retourne une liste d'association pour une carte donnée si elle existe
   * @param carId : identifiant de la carte
   * @return la liste des associations pour une carte donnée.
   */
  @Override
  public List<AssocierDto> getAssocierByCarId(String carId) {
    List<Associer> associers = associerRepository.findByCarId(carId);
    if (associers.isEmpty()) {
      throw new EntityNotFoundException("Aucune associations trouvé pour la carte : " + carId);
    }
    return associers.stream().map(associerMapper::toDto).toList();
  }

  /**
   * Retourne une liste association pour une etiquette donnée si elle existe
   * @param etiId : identifiant de l'etiquette
   * @return la liste des associations pour une etiquette donnée.
   */
  @Override
  public List<AssocierDto> getAssocierByEtiId(String etiId) {
    List<Associer> associers = associerRepository.findByEtiId(etiId);
    if (associers.isEmpty()) {
      throw new EntityNotFoundException("Aucune associations trouvé pour l'étiquette : " + etiId);
    }
    return associers.stream().map(associerMapper::toDto).toList();
  }

  /**
   * Création d'une association entre une carte et une etiquette si elle n'existe pas déjà.
   * @param associerDto
   * @return
   */
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

  /**
   * Supprime une association entre une carte donnée et une etiquette donnée.
   * @param carId : identifiant d'une carte
   * @param etiId : identifiant d'une etiquette
   */
  @Override
  public boolean deleteAssocier(String carId, String etiId) {
    AssocierId id = new AssocierId(carId, etiId);
    if (!associerRepository.existsById(id)) {
      throw new EntityNotFoundException(
              "Association introuvable pour la carte : " + carId + " et l'etiquette  :" + etiId
      );
    }
    associerRepository.deleteById(id);
    return true;
  }
}
