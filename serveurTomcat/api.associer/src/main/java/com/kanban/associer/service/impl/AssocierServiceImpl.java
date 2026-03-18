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

  public AssocierServiceImpl(AssocierRepository roleRepository, AssocierMapper roleMapper) {
    this.associerRepository = roleRepository;
    this.associerMapper = roleMapper;
  }


  @Override
  public List<AssocierDto> getAllAssocier() {
    return associerRepository.findAll().stream()
            .map(associerMapper::toDto)
            .toList();
  }

  @Override
  public List<AssocierDto> getAssocierByCarId(String carId) {
    List<Associer> associers = associerRepository.findByEtiId(carId);
    if (associers.isEmpty()) {
      throw new EntityNotFoundException("Aucune associations trouvé pour la carte : " + carId);
    }
    return associers.stream().map(associerMapper::toDto).toList();
  }

  @Override
  public List<AssocierDto> getAssocierByEtiId(String etiId) {
    List<Associer> associers = associerRepository.findByEtiId(etiId);
    if (associers.isEmpty()) {
      throw new EntityNotFoundException("Aucune associations trouvé pour l'étiquette : " + etiId);
    }
    return associers.stream().map(associerMapper::toDto).toList();
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
  public void deleteAssocier(String carId, String etiId) {
    AssocierId id = new AssocierId(carId, etiId);
    if (!associerRepository.existsById(id)) {
      throw new EntityNotFoundException(
              "Association introuvable pour compte=" + carId + " et le tableau=" + etiId
      );
    }
    associerRepository.deleteById(id);

  }
}