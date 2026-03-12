package com.example.agentproxy.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.netty.http.client.HttpClient;

/**
 * WebClient configuration for proxy requests.
 *
 * <p>Key settings:</p>
 * <ul>
 *   <li>Auto-follow redirects is <b>disabled</b> so the proxy can rewrite
 *       Location headers and forward 3xx responses to the browser.</li>
 *   <li>Response decompression is <b>disabled</b> — we don't send Accept-Encoding
 *       to the backend, so we get raw bytes we can forward as-is.</li>
 *   <li>Max in-memory buffer is 10 MB.</li>
 * </ul>
 */
@Configuration
public class WebClientConfig {

    @Bean
    public WebClient webClient() {
        HttpClient httpClient = HttpClient.create()
                .followRedirect(false)       // proxy must handle redirects itself
                .compress(false);             // don't auto-decompress

        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(configurer -> configurer.defaultCodecs()
                        .maxInMemorySize(10 * 1024 * 1024))
                .build();

        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .exchangeStrategies(strategies)
                .build();
    }
}
