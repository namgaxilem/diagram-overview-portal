package com.example.agentproxy.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.agentproxy.filter.AgentCookieRedirectFilter;

/**
 * Security configuration (Servlet / Spring MVC mode).
 *
 * <p>AgentCookieRedirectFilter is inserted BEFORE UsernamePasswordAuthenticationFilter
 * so that root-relative requests (e.g. /dev-ui/static/js/main.js) get their URI
 * rewritten to /agent-proxy/{type}/{id}/... BEFORE authorization is evaluated.
 * Since /agent-proxy/** is permitAll, the wrapped request passes through.</p>
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.addFilterBefore(new AgentCookieRedirectFilter(), UsernamePasswordAuthenticationFilter.class);

        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/agent-proxy/**").permitAll()
                        .requestMatchers("/api/health").permitAll()
                        .anyRequest().authenticated()
                )
                .httpBasic(httpBasic -> {})
                .formLogin(formLogin -> {})
                .build();
    }
}
