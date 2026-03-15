package com.empresa.incidentes.infrastructure.adapter.out;

import com.empresa.incidentes.domain.model.SlaTargets;
import com.empresa.incidentes.domain.model.TicketPriority;
import com.empresa.incidentes.domain.port.out.SlaCalculatorPort;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Component
public class PriorityBasedSlaCalculatorAdapter implements SlaCalculatorPort {

    private final Map<TicketPriority, SlaStrategy> strategies;

    public PriorityBasedSlaCalculatorAdapter(List<SlaStrategy> strategies) {
        Map<TicketPriority, SlaStrategy> strategyMap = new EnumMap<>(TicketPriority.class);
        strategies.forEach(strategy -> strategyMap.put(strategy.priority(), strategy));
        this.strategies = Map.copyOf(strategyMap);
    }

    @Override
    public Mono<SlaTargets> calculate(TicketPriority priority, Instant reference) {
        return Mono.fromSupplier(() -> strategies.get(priority))
                .map(strategy -> strategy.calculate(reference));
    }
}
