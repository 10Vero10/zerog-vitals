package com.zerogvitals.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/** Habilita @Scheduled (por ejemplo, recordatorios vencidos, BR-12). */
@Configuration
@EnableScheduling
public class SchedulingConfig {}
