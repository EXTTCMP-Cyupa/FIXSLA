package com.empresa.incidentes.domain.port.out;

import java.time.Instant;

public interface ClockPort {

    Instant now();
}
