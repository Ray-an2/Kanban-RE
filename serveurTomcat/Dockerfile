FROM tomcat:10.1-jre17

EXPOSE 8080

CMD ["catalina.sh", "run"]
CMD ["sh", "-c", "trap 'echo Arrêt backend Tomcat détecté; exit' SIGINT SIGTERM; npx ts-node server.ts"]
