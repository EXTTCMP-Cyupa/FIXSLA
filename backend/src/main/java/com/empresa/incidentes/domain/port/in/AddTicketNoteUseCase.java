package com.empresa.incidentes.domain.port.in;

import com.empresa.incidentes.domain.model.TicketAudit;
import reactor.core.publisher.Mono;

public interface AddTicketNoteUseCase {

    Mono<TicketAudit> handle(AddTicketNoteCommand command);
}
