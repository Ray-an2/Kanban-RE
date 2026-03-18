package com.kanban.etiquette.service;

import com.kanban.etiquette.dtos.EtiquetteDto;

import java.util.List;

public interface EtiquetteService {
    EtiquetteDto createEtiquette(EtiquetteDto etiquetteDto);
    EtiquetteDto getEtiquetteById(String id);
    List<EtiquetteDto> getAllEtiquettes();
    List<EtiquetteDto> getEtiquettesByNom(String nom);
    List<EtiquetteDto> getEtiquettesByCouleur(String couleur);
    EtiquetteDto updateEtiquette(String id, EtiquetteDto etiquetteDto);
    void deleteEtiquette(String id);
}