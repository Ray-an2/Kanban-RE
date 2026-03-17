package com.kanban.membre.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.kanban.compte.entity.Compte;
import com.kanban.carte.entity.Carte;

import java.time.LocalDate;

@Entity
@Table(name = "t_carte_car")
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
    private LocalDate dateCreation;

    /**
     * Jointure vers t_compte_cpt.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cpt_id", insertable = false, updatable = false)
    private Compte compte;

    /**
     * Jointure vers t_carte_car.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id", insertable = false, updatable = false)
    private Carte carte;

}
