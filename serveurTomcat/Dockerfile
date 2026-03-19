FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
COPY api.associer ./api.associer
COPY api.carte ./api.carte
COPY api.commentaire ./api.commentaire
COPY api.compte ./api.compte
COPY api.document ./api.document
COPY api.etiquette ./api.etiquette
COPY api.journal ./api.journal
COPY api.liste ./api.liste
COPY api.membre ./api.membre
COPY api.notification ./api.notification
COPY api.profil ./api.profil
COPY api.role ./api.role
COPY api.tableau ./api.tableau
RUN mvn -q -DskipTests package

FROM tomcat:10.1-jre25
COPY --from=build /app/target/*.war /usr/local/tomcat/webapps/ROOT.war

# Active les logs détaillés
ENV JAVA_OPTS="-Dlogging.level.root=DEBUG"
ENV SPRING_DOCKER_COMPOSE_ENABLED=false

EXPOSE 8080
CMD ["catalina.sh", "run"]
