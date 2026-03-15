package com.empresa.incidentes.domain.port.out;

import com.empresa.incidentes.domain.model.SlaTargets;
import com.empresa.incidentes.domain.model.TicketPriority;
import reactor.core.publisher.Mono;

import java.time.Instant;

public interface SlaCalculatorPort {

    Mono<SlaTargets> calculate(TicketPriority priority, Instant reference);
}
