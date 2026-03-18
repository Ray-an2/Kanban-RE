package com.kanban.etiquette.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "t_etiquette_eti")
public class Etiquette {

    @Id
    @Column(name = "eti_id")
    private String id;

    @Column(name = "eti_nom", nullable = false)
    private String nom;

    @Column(name = "eti_couleur")
    private String couleur;
}