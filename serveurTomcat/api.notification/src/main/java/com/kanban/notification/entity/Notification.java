package com.kanban.notification.entity;

import com.kanban.compte.entity.Compte;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "t_notification_not")
public class Notification {
    @Id
    @Column(name = "not_id")
    private String id;

    @Column(name = "not_titre", nullable = false)
    private String titre;

    @Column(name = "not_date", nullable = false)
    private String dateCreation;

    @Column(name = "not_lien")
    private String lien;

    @Column(name = "not_etat", nullable = false, length = 1)
    private String etat;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cpt_id", nullable = false)
    private Compte compte;
}
