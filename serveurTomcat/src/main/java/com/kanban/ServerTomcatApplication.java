package com.kanban;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication(scanBasePackages = "com.kanban")
@EnableJpaRepositories(basePackages = {
        "com.kanban.compte.repository",
        "com.kanban.profil.repository",
        "com.kanban.tableau.repository",
        "com.kanban.role.repository",
        "com.kanban.liste.repository",
        "com.kanban.carte.repository",
        "com.kanban.etiquette.repository",
        "com.kanban.associer.repository",
        "com.kanban.membre.repository",
        "com.kanban.notification.repository",
        "com.kanban.journal.repository"
})
@EnableMongoRepositories(basePackages = {
        "com.kanban.commentaire.repository",
        "com.kanban.document.repository"
})
public class ServerTomcatApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(ServerTomcatApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(ServerTomcatApplication.class, args);
    }
}