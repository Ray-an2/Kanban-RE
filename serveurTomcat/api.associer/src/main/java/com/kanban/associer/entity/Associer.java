package com.kanban.associer.entity;

import com.kanban.carte.entity.Carte;
import com.kanban.etiquette.entity.Etiquette;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "t_associer_as")
@IdClass(com.kanban.associer.entity.AssocierId.class)
@Data
public class Associer {

  @Id
  @Column(name = "car_id", nullable = false)
  private String carId;

  @Id
  @Column(name = "eti_id", nullable = false)
  private String etiId;

  /**
   * Jointure vers t_compte_cpt.
   */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "car_id", insertable = false, updatable = false)
  private Carte carte;

  /**
   * Jointure vers t_etiquette_eti.
   */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "eti_id", insertable = false, updatable = false)
  private Etiquette etiquette;
}
