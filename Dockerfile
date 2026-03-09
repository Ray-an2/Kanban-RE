FROM ubuntu:latest
LABEL authors="ewand"

ENTRYPOINT ["top", "-b"]