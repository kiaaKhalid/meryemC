package com.meryem.maintenance.config;

import com.fasterxml.jackson.core.StreamReadConstraints;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    /**
     * Increase Jackson's default max string length from 20MB to 50MB.
     * This is necessary for high-resolution base64 profile images.
     */
    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jacksonCustomizer() {
        return builder -> builder.postConfigurer(objectMapper -> {
            objectMapper.getFactory().setStreamReadConstraints(
                StreamReadConstraints.builder()
                    .maxStringLength(50_000_000)
                    .build()
            );
        });
    }
}
