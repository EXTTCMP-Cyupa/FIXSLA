package com.empresa.incidentes.infrastructure.adapter.out;

import com.empresa.incidentes.domain.port.out.TicketCodeGeneratorPort;
import com.empresa.incidentes.infrastructure.adapter.out.repository.SpringDataTicketRepository;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class SequentialTicketCodeGeneratorAdapter implements TicketCodeGeneratorPort {

    private final SpringDataTicketRepository ticketRepository;

    public SequentialTicketCodeGeneratorAdapter(SpringDataTicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @Override
    public Mono<String> nextCode() {
        return ticketRepository.count()
                .map(sequence -> "INC-" + String.format("%06d", sequence + 1));
    }
}
