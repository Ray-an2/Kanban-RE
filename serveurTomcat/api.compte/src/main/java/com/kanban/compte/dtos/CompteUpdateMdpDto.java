package com.kanban.compte.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO utilisé pour mettre à jour le mot de passe d'un compte.
 * Le nouveau mot de passe doit déjà être haché par le serveur Deno
 * avant d'être transmis à Tomcat.
 */
@Data
public class CompteUpdateMdpDto {

    @NotBlank(message = "Le nouveau mot de passe haché est obligatoire")
    private String mdp;
}