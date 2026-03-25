package com.empresa.incidentes.infrastructure.adapter.out.repository;

import com.empresa.incidentes.infrastructure.adapter.out.entity.UbicacionEntity;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import java.util.UUID;

public interface SpringDataUbicacionRepository extends ReactiveCrudRepository<UbicacionEntity, UUID> {
}
