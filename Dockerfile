FROM golang:latest
MAINTAINER 469607593@qq.com

RUN apt-get -y update && apt-get install -y openjdk-8-jre-headless

RUN go get -d -u github.com/yaleewang/battery-historian/battery-historian
WORKDIR /go/src/github.com/yaleewang/battery-historian/battery-historian

EXPOSE 9999
CMD go run cmd/battery-historian/battery-historian.go --port 9999
