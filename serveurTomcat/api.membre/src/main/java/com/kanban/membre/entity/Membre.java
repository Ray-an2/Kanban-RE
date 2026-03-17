package com.kanban.membre.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "t_membre_mem")
@IdClass(MembreId.class)
@Data
public class Membre {

    @Id
    @Column(name = "cpt_id", nullable = false)
    private String cptId;

    @Id
    @Column(name = "car_id", nullable = false)
    private String carId;

    @Column(name = "mem_date", nullable = false)
    private String dateCreation;
}