package com.kanban.compte.service;

import com.kanban.compte.dtos.CompteDto;
import java.util.List;

public interface CompteService {
  CompteDto create(CompteDto compteDto);
  CompteDto update(String id, CompteDto compteDto);
  CompteDto getCompte(String compteId);
  boolean delete(String compteId);
  List<CompteDto> getAll();
}