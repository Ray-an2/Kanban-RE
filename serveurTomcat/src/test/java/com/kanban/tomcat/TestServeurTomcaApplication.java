package com.kanban.tomcat;

import org.springframework.boot.SpringApplication;

public class TestServeurTomcaApplication {

    public static void main(String[] args) {
        SpringApplication.from(ServerTomcatApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}
