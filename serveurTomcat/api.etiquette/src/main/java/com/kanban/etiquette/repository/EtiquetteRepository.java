package com.kanban.etiquette.repository;

import com.kanban.etiquette.entity.Etiquette;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EtiquetteRepository extends JpaRepository<Etiquette, String> {
    List<Etiquette> findByNom(String nom);
    List<Etiquette> findByCouleur(String couleur);
}