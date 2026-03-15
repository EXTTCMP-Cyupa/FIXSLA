package com.empresa.incidentes.infrastructure.adapter.out;

import com.empresa.incidentes.domain.model.SlaTargets;
import com.empresa.incidentes.domain.model.TicketPriority;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;

@Component
public class MediaSlaStrategy implements SlaStrategy {

    @Override
    public TicketPriority priority() {
        return TicketPriority.MEDIA;
    }

    @Override
    public SlaTargets calculate(Instant reference) {
        return new SlaTargets(
                reference.plus(Duration.ofMinutes(30)),
                reference.plus(Duration.ofHours(8))
        );
    }
}
