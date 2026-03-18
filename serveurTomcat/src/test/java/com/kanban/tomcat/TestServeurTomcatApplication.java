package com.kanban.tomcat;

import com.kanban.ServerTomcatApplication;
import org.springframework.boot.SpringApplication;

public class TestServeurTomcatApplication {

    public static void main(String[] args) {
        SpringApplication.from(ServerTomcatApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}
