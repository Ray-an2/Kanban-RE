package com.kanban.compte.dtos;

import lombok.Data;

/**
 * DTO public du compte — ne contient jamais le mot de passe.
 * Utilisé pour toutes les réponses API (GET, PUT, DELETE).
 */
@Data
public class CompteDto {
  private String id;
  private String pseudo;
  private String role;
}