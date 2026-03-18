package com.kanban.liste.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "t_liste_lis")
public class Liste {

    @Id
    @Column(name = "lis_id")
    private String id;

    @Column(name = "lis_titre", nullable = false)
    private String titre;

    @Column(name = "lis_ordre", nullable = false)
    private Integer ordre;

    @Column(name = "lis_etat", nullable = false)
    private String etat;

    @Column(name = "tab_id", nullable = false)
    private String tabId;
}