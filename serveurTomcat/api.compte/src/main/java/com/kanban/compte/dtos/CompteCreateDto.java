package com.kanban.compte.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO utilisé uniquement pour la création d'un compte (POST /api/compte).
 * Le mot de passe reçu ici doit déjà être haché par le serveur Deno
 * (scrypt + sel) avant d'être transmis à Tomcat.
 *
 * Ce DTO inclut également les informations de profil afin de créer
 * le compte et le profil en une seule requête.
 */
@Data
public class CompteCreateDto {

    // --- Compte ---

    @NotBlank(message = "Le pseudo est obligatoire")
    private String pseudo;

    @NotBlank(message = "Le mot de passe haché est obligatoire")
    private String mdp;  // mot de passe déjà haché par Deno (scrypt+sel)

    private String role; // "U" par défaut si absent

    // --- Profil associé ---

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    @NotBlank(message = "L'email est obligatoire")
    private String mail;
}