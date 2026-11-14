package com.zerogvitals.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Metadatos de Swagger. El frontend genera sus tipos desde /v3/api-docs. */
@Configuration
public class OpenApiConfig {

  @Bean
  public OpenAPI zeroGVitalsOpenApi() {
    return new OpenAPI()
        .info(
            new Info()
                .title("ZeroG Vitals API")
                .version("0.0.1")
                .description("Habitat computer API. Prototype, not a medical device.")
                .license(new License().name("MIT")));
  }
}
