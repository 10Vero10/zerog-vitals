package com.zerogvitals.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

/** Orígenes permitidos para CORS (variable CORS_ALLOWED_ORIGINS). */
@ConfigurationProperties(prefix = "zerogvitals.cors")
public record CorsProperties(List<String> allowedOrigins) {

  public CorsProperties {
    allowedOrigins = allowedOrigins == null ? List.of() : List.copyOf(allowedOrigins);
  }
}
