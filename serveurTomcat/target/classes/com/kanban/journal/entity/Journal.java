package com.kanban.journal.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "t_journal_jou")
public class Journal {

    @Id
    @Column(name = "jou_id")
    private String id;

    @Column(name = "jou_titre", nullable = false)
    private String titre;

    @Column(name = "jou_description", nullable = false)
    private String description;

    @Column(name = "jou_auteur", nullable = false)
    private String auteur;

    @Column(name = "jou_action", nullable = false)
    private String action;

    @Column(name = "jou_date", nullable = false)
    private String date;

    @Column(name = "jou_etat", nullable = false)
    private String etat;

    @Column(name = "tab_id")
    private String tabId;

    @Column(name = "car_id")
    private String carId;
}
