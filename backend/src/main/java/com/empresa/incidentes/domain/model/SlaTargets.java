package com.empresa.incidentes.domain.model;

import java.time.Instant;
import java.util.Objects;

public record SlaTargets(
        Instant primeraRespuestaLimite,
        Instant resolucionLimite
) {

    public SlaTargets {
        primeraRespuestaLimite = Objects.requireNonNull(primeraRespuestaLimite, "La fecha límite de primera respuesta es obligatoria");
        resolucionLimite = Objects.requireNonNull(resolucionLimite, "La fecha límite de resolución es obligatoria");
    }
}
