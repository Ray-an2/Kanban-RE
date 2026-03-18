package com.kanban.etiquette.controller;

import com.kanban.etiquette.dtos.EtiquetteDto;
import com.kanban.etiquette.service.impl.EtiquetteServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/etiquette")
public class EtiquetteController {

    private final EtiquetteServiceImpl etiquetteService;

    public EtiquetteController(EtiquetteServiceImpl etiquetteService) {
        this.etiquetteService = etiquetteService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EtiquetteDto createEtiquette(@RequestBody EtiquetteDto etiquetteDto) {
        return etiquetteService.createEtiquette(etiquetteDto);
    }

    @GetMapping("/{id}")
    public EtiquetteDto getEtiquetteById(@PathVariable String id) {
        return etiquetteService.getEtiquetteById(id);
    }

    @GetMapping
    public List<EtiquetteDto> getAllEtiquettes() {
        return etiquetteService.getAllEtiquettes();
    }

    @GetMapping("/nom/{nom}")
    public List<EtiquetteDto> getEtiquettesByNom(@PathVariable String nom) {
        return etiquetteService.getEtiquettesByNom(nom);
    }

    @GetMapping("/couleur/{couleur}")
    public List<EtiquetteDto> getEtiquettesByCouleur(@PathVariable String couleur) {
        return etiquetteService.getEtiquettesByCouleur(couleur);
    }

    @PutMapping("/{id}")
    public EtiquetteDto updateEtiquette(@PathVariable String id, @RequestBody EtiquetteDto etiquetteDto) {
        return etiquetteService.updateEtiquette(id, etiquetteDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEtiquette(@PathVariable String id) {
        etiquetteService.deleteEtiquette(id);
    }
}