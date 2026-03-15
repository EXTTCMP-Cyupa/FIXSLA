package com.empresa.incidentes.domain.port.out;

import reactor.core.publisher.Mono;

public interface TicketCodeGeneratorPort {

    Mono<String> nextCode();
}
