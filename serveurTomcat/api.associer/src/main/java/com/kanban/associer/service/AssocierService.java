package com.kanban.associer.service;

import com.kanban.associer.dtos.AssocierDto;
import org.springframework.http.ResponseEntity;

import java.util.List;


public interface AssocierService {
  List<AssocierDto> getAllAssocier();

  List<AssocierDto> getAllByCarId(String carId);

  List<AssocierDto> getAllByEtiId(String etiId);

  AssocierDto createAssocier(AssocierDto associerDto);

  void deleteAssocier(String carId, String etiId);

}
