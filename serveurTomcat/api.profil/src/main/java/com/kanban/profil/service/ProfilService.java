package com.kanban.profil.service;

import com.kanban.profil.dtos.ProfilDto;
import java.util.List;

public interface ProfilService {
  ProfilDto createProfil(ProfilDto profilDto);
  ProfilDto getProfilById(String compteId);
  ProfilDto updateProfil(String compteId, ProfilDto profilDto);
  boolean deleteProfil(String compteId);
}