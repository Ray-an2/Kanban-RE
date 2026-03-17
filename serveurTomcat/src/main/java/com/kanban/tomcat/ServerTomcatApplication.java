package com.kanban.tomcat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.kanban")
public class ServerTomcatApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServerTomcatApplication.class, args);
    }

}
