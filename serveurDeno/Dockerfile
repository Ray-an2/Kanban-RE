FROM denoland/deno:2.2.3

WORKDIR /app

COPY . .

ENV HOST=0.0.0.0
ENV PORT=8000

EXPOSE 8000

CMD ["run", "--allow-net", "--allow-read", "--allow-write", "--allow-env", "main.ts"]
CMD ["sh", "-c", "trap 'echo Arrêt backend Deno détecté; exit' SIGINT SIGTERM; npx ts-node server.ts"]