package com.empresa.incidentes.infrastructure.adapter.out;

import com.empresa.incidentes.domain.model.SlaTargets;
import com.empresa.incidentes.domain.model.TicketPriority;

import java.time.Instant;

public interface SlaStrategy {

    TicketPriority priority();

    SlaTargets calculate(Instant reference);
}
