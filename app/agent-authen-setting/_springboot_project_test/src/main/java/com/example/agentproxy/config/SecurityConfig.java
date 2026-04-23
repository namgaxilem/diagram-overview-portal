package com.example.agentproxy.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.access.intercept.AuthorizationFilter;

import com.example.agentproxy.filter.AgentCookieRedirectFilter;

/**
 * Security configuration (Servlet / Spring MVC mode).
 *
 * <p>AgentCookieRedirectFilter is inserted BEFORE {@link AuthorizationFilter}
 * so that root-relative requests (e.g. /dev-ui/static/js/main.js) get their URI
 * rewritten to /agent-proxy/{type}/{id}/... BEFORE authorization is evaluated.
 * Since /agent-proxy/** is permitAll, the wrapped request passes through.</p>
 *
 * <p>{@code AuthorizationFilter} is used as the anchor because it is <b>always
 * present</b> in the chain regardless of the login method (formLogin, httpBasic,
 * oauth2Login, etc.), unlike {@code UsernamePasswordAuthenticationFilter} which
 * only exists when formLogin is configured.</p>
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final AuthenticationEntryPoint authenticationEntryPoint;
    private final AccessDeniedHandler accessDeniedHandler;

    public SecurityConfig(AuthenticationEntryPoint authenticationEntryPoint,
                          AccessDeniedHandler accessDeniedHandler) {
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.accessDeniedHandler = accessDeniedHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.addFilterBefore(new AgentCookieRedirectFilter(), AuthorizationFilter.class);

        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/agent-proxy/**").permitAll()
                        .requestMatchers("/api/health").permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler)
                )
                .httpBasic(httpBasic -> {})
                .formLogin(formLogin -> {})
                .build();
    }
}
