package com.example.agentproxy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.example.agentproxy.config.AgentProxyProperties;

@SpringBootApplication
@EnableConfigurationProperties(AgentProxyProperties.class)
public class AgentProxyApplication {

    public static void main(String[] args) {
        SpringApplication.run(AgentProxyApplication.class, args);
    }
}


