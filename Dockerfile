FROM ubuntu:latest
LABEL authors="ewanD"

ENTRYPOINT ["top", "-b"]
