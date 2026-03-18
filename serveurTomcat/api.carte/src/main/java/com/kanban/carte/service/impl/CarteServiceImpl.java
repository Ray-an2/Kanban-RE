package com.kanban.carte.service.impl;

import com.kanban.carte.dtos.CarteDto;
import com.kanban.carte.entity.Carte;
import com.kanban.carte.mappers.CarteMapper;
import com.kanban.carte.repository.CarteRepository;
import com.kanban.carte.service.CarteService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service("carteService")
@Transactional
public class CarteServiceImpl implements CarteService {

  private final CarteRepository carteRepository;
  private final CarteMapper carteMapper;

  public CarteServiceImpl(CarteRepository carteRepository, CarteMapper carteMapper) {
    this.carteRepository = carteRepository;
    this.carteMapper = carteMapper;
  }

  @Override
  @Transactional(readOnly = true)
  public List<CarteDto> getAllCartes() {
    return carteRepository.findAll().stream()
            .map(carteMapper::toDto)
            .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public CarteDto getCarteById(String id) {
    return carteRepository.findById(id)
            .map(carteMapper::toDto)
            .orElseThrow(() -> new EntityNotFoundException(
                    String.format("La carte avec l'id %s n'existe pas", id)));
  }

  @Override
  public CarteDto createCarte(CarteDto carteDto) {
    var carte = carteMapper.toEntity(carteDto);
    carte.setId(UUID.randomUUID().toString());
    return carteMapper.toDto(carteRepository.save(carte));
  }

  @Override
  public CarteDto updateCarte(String id, CarteDto carteDto) {
    var carte = carteRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(
                    String.format("La carte avec l'id %s n'existe pas", id)));
    carte.setNom(carteDto.getNom());
    carte.setDescription(carteDto.getDescription());
    carte.setArchiver(carteDto.getArchiver());
    carte.setTerminer(carteDto.getTerminer());
    carte.setOrdre(carteDto.getOrdre());
    carte.setPriorite(carteDto.getPriorite());
    carte.setDateDebut(carteDto.getDateDebut());
    carte.setDateFin(carteDto.getDateFin());
    carte.setCouverture(carteDto.getCouverture());
    carte.setLisId(carteDto.getLisId());
    return carteMapper.toDto(carteRepository.save(carte));
  }

  @Override
  public boolean deleteCarte(String id) {
    carteRepository.deleteById(id);
    return true;
  }

  @Override
  public CarteDto moveCarte(String carId) {
    /**
     * Notification existing = notificationRepository.findById(id)
     *                 .orElseThrow(() -> new EntityNotFoundException("Aucune notification trouvée avec l'id " + id));
     *         existing.setEtat("L");
     *         return notificationMapper.toDto(notificationRepository.save(existing));
     */
    Carte existing = carteRepository.findById(carId).orElseThrow(() -> new EntityNotFoundException("Aucun carte n'existe avec l'id " + carId));
    // existing.setOrdre();
    return carteMapper.toDto(carteRepository.save(existing));
  }

  @Override
  public CarteDto moveCarteToList(String carId, String newLisId) {
    Carte carte = carteRepository.findById(carId)
            .orElseThrow(() -> new EntityNotFoundException("Carte non trouvée avec l'id: " + carId));
    carte.setLisId(newLisId);
    return carteMapper.toDto(carteRepository.save(carte));
  }

  @Override
  public CarteDto terminer(String carId) {
    Carte existing = carteRepository.findById(carId).orElseThrow(() -> new EntityNotFoundException("Aucun carte n'existe avec l'id " + carId));
    if(existing.getTerminer().equals("T")){
        existing.setTerminer("N");
    }
    else {
      existing.setTerminer("T");
    }
    return carteMapper.toDto(carteRepository.save(existing));
  }

  @Override
  public CarteDto archiver(String carId) {
    Carte existing = carteRepository.findById(carId).orElseThrow(() -> new EntityNotFoundException("Aucun carte n'existe avec l'id " + carId));
    if(existing.getTerminer().equals("A")){
      existing.setTerminer("P");
    }
    else {
      existing.setTerminer("A");
    }
    return carteMapper.toDto(carteRepository.save(existing));
  }
}