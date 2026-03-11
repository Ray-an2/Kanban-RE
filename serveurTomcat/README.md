# READEME sur le serveur Tomcat
Ce projet a pour but de mettre en place un serveur Tomcat pour héberger une application web. Tomcat est un conteneur de servlets open source développé par la fondation Apache.
## Installation de Tomcat
1. Téléchargez la dernière version de Tomcat depuis le site officiel : [https://tomcat.apache.org/download-90.cgi](https://tomcat.apache.org/download-90.cgi).
2. Extrayez le fichier téléchargé dans un répertoire de votre choix.
3. Configurez les variables d'environnement JAVA_HOME et CATALINA_HOME pour pointer respectivement vers votre installation Java et Tomcat.
## Démarrage de Tomcat
1. Ouvrez une invite de commande ou un terminal.
2. Naviguez jusqu'au répertoire `bin` de votre installation Tomcat.
3. Exécutez la commande suivante pour démarrer le serveur :
4. ```bash
   startup.bat (pour Windows)
   ./startup.sh (pour Linux/Mac)
   ```
5. Tomcat devrait maintenant être en cours d'exécution. Vous pouvez accéder à l'interface d'administration en ouvrant un navigateur et en allant à l'adresse suivante : [http://localhost:8080](http://localhost:8080).
## Déploiement d'une application web
1. Placez votre fichier WAR (Web Application Archive) dans le répertoire `webapps` de votre installation Tomcat.
2. Tomcat déploiera automatiquement l'application. Vous pouvez accéder à votre application en ouvrant un navigateur et en allant à l'adresse suivante : [http://localhost:8080/nom_de_votre_application](http://localhost:8080/nom_de_votre_application).
## Conclusion
Tomcat est un serveur puissant et flexible pour héberger des applications web Java. En suivant les étapes ci-dessus, vous pouvez facilement installer et configurer Tomcat pour déployer vos applications web. N'hésitez pas à consulter la documentation officielle de Tomcat pour plus d'informations sur les fonctionnalités avancées et la configuration.

Pour accèder à la base de données MongoDB, on peut soit utiliser le client MongoDB Compass, soit utiliser la ligne de commande avec le client MongoDB Shell. Assurez-vous que MongoDB est installé et en cours d'exécution sur votre machine avant de tenter de vous connecter.
```bash
mongosh "mongodb://root:root@localhost:27018/kanban?authSource=admin"
```
Il y a 2 collections "comments" et "documents". Si on veut voir les documents de la collection "comments", on peut utiliser la commande suivante dans le shell MongoDB :
```bash
show collections
```
