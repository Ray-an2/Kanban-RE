package com.kanban.membre.service;

import com.kanban.membre.dtos.MembreDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface MembreService {
    List<MembreDto> getAllMembre();

    List<MembreDto> getMembreByCarId(String carId);

    MembreDto associerMembre(MembreDto membreDto);

    void deleteMembre(String cptId, String carId);
}
