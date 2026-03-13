#FROM maven:3.9-eclipse-temurin-17 AS build
#WORKDIR /app
#COPY pom.xml .
#COPY src ./src
#RUN mvn -q -DskipTests package

FROM tomcat:10.1-jre17
#COPY --from=build /app/target/*.war

EXPOSE 8080
CMD ["catalina.sh", "run"]
