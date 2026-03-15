package com.empresa.incidentes.infrastructure.adapter.out.repository;

import com.empresa.incidentes.infrastructure.adapter.out.entity.TicketEntity;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import java.util.UUID;

public interface SpringDataTicketRepository extends ReactiveCrudRepository<TicketEntity, UUID> {
}
