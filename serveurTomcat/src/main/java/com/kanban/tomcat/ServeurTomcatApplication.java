package com.kanban.tomcat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ServeurTomcatApplication extends SpringBootServletInitializer {
  public static void main(String[] args) {
    SpringApplication.run(ServeurTomcatApplication.class, args);
  }
  @Override
  protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
    return builder.sources(ServeurTomcatApplication.class);
  }
}