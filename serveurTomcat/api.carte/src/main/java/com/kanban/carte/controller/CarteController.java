package com.kanban.carte.controller;

import com.kanban.carte.dtos.CarteDto;
import com.kanban.carte.service.impl.CarteServiceImpl;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/carte")
public class CarteController {

  private final CarteServiceImpl carteService;

  public CarteController(CarteServiceImpl carteService) {
    this.carteService = carteService;
  }

  @GetMapping
  public List<CarteDto> getAllCartes() {
    return carteService.getAllCartes();
  }

  @GetMapping("/{id}")
  public CarteDto getCarte(@PathVariable Long id) {
    return carteService.getCarteById(id);
  }

  @PostMapping
  public CarteDto createCarte(final @RequestBody CarteDto carteDto){
    return carteService.createCarte(carteDto);
  }

  @DeleteMapping("/{id}")
  public boolean deleteCarte(@PathVariable Long id) {
    return carteService.deleteCarte(id);
  }
}
