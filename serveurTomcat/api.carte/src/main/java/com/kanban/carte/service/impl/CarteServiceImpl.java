package com.kanban.carte.service.impl;

import com.kanban.carte.dtos.CarteDto;
import com.kanban.carte.entity.Carte;
import com.kanban.carte.mappers.CarteMapper;
import com.kanban.carte.repository.CarteRepository;
import com.kanban.carte.service.CarteService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
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
  public CarteDto moveCarte(String carId, String newLisId, Integer newOrdre) {
    Carte movingCarte = carteRepository.findById(carId)
            .orElseThrow(() -> new EntityNotFoundException("Carte non trouvée avec l'id: " + carId));

    String sourceLisId = movingCarte.getLisId();
    int sourceOrdre = parseOrdre(movingCarte);
    if (newLisId == null || newLisId.isBlank()) {
      throw new IllegalArgumentException("newLisId est obligatoire");
    }

    List<Carte> sourceCartes = getSortedCartesByListId(sourceLisId);
    boolean removedFromSource = sourceCartes.removeIf(carte -> carte.getId().equals(carId));
    if (!removedFromSource) {
      throw new EntityNotFoundException("Carte non trouvée dans sa liste source: " + carId);
    }

    boolean sameListMove = sourceLisId.equals(newLisId);
    List<Carte> targetCartes = sameListMove ? sourceCartes : getSortedCartesByListId(newLisId);

    if (!sameListMove) {
      targetCartes.removeIf(carte -> carte.getId().equals(carId));
    }

    Integer adjustedOrdre = newOrdre;
    // Same-list downward move: once removed from source, target position shifts by -1.
    if (sameListMove && adjustedOrdre != null && adjustedOrdre > sourceOrdre) {
      adjustedOrdre = adjustedOrdre - 1;
    }

    int targetIndex = normalizeTargetIndex(adjustedOrdre, targetCartes.size());
    movingCarte.setLisId(newLisId);
    targetCartes.add(targetIndex, movingCarte);

    renumberOrders(sourceCartes);
    if (!sameListMove) {
      carteRepository.saveAll(sourceCartes);
    }

    renumberOrders(targetCartes);
    carteRepository.saveAll(targetCartes);

    return carteMapper.toDto(movingCarte);
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

  private List<Carte> getSortedCartesByListId(String lisId) {
    List<Carte> cartes = new ArrayList<>(carteRepository.findByLisId(lisId));
    cartes.sort(Comparator.comparingInt(this::parseOrdre));
    return cartes;
  }

  private int parseOrdre(Carte carte) {
    try {
      return Integer.parseInt(carte.getOrdre());
    } catch (NumberFormatException ex) {
      return Integer.MAX_VALUE;
    }
  }

  private int normalizeTargetIndex(Integer requestedOrdre, int targetSize) {
    if (requestedOrdre == null) {
      return targetSize;
    }
    int index = requestedOrdre - 1;
    if (index < 0) {
      return 0;
    }
    return Math.min(index, targetSize);
  }

  private void renumberOrders(List<Carte> cartes) {
    for (int i = 0; i < cartes.size(); i++) {
      cartes.get(i).setOrdre(String.valueOf(i + 1));
    }
  }
}