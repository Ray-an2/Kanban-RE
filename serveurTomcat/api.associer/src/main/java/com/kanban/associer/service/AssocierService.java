package com.kanban.associer.service;

import com.kanban.associer.dtos.AssocierDto;
import org.springframework.http.ResponseEntity;

import java.util.List;


public interface AssocierService {
  List<AssocierDto> getAllAssocier();

  List<AssocierDto> getAssocierByCarId(String carId);

  List<AssocierDto> getAssocierByEtiId(String etiId);

  AssocierDto createAssocier(AssocierDto associerDto);

  void deleteAssocier(String carId, String etiId);

}
