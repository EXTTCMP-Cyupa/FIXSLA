package com.empresa.incidentes.application.usecase;

import com.empresa.incidentes.domain.model.Ubicacion;
import com.empresa.incidentes.domain.port.in.ListUbicacionesUseCase;
import com.empresa.incidentes.domain.port.out.UbicacionRepositoryPort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class ListUbicacionesService implements ListUbicacionesUseCase {

    private final UbicacionRepositoryPort ubicacionRepository;

    public ListUbicacionesService(UbicacionRepositoryPort ubicacionRepository) {
        this.ubicacionRepository = ubicacionRepository;
    }

    @Override
    public Flux<Ubicacion> handle() {
        return ubicacionRepository.findAll();
    }
}
