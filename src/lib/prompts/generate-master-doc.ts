// TripAi — Prompt: generate-master-doc
// Genera el documento maestro de un viaje a partir de los datos del onboarding.

import type { Trip } from "@/types/trip";

export const SYSTEM_PROMPT_ES = `Sos TripAi, un asistente de planificación de viajes. Tu tarea es generar un documento maestro detallado y útil para un viaje, basado en los datos que un usuario completó en un formulario de onboarding.

El documento debe ser:
- Escrito en español
- En formato Markdown bien estructurado con headers, listas y tablas
- Práctico y accionable, no genérico ni flowery
- Adaptado a las preferencias específicas del usuario
- Con información verificable (precios, horarios, ubicaciones aproximadas) actualizada a la fecha actual
- Dividido en secciones claras

El documento tiene que incluir:

1. RESUMEN DEL VIAJE — destino(s), fechas, duración, viajeros, hospedaje con dirección, tiempos de viaje estimados desde hospedaje a zonas turísticas clave.

2. PREFERENCIAS DEL VIAJERO — registro claro de lo que eligió.

3. EVENTOS Y ACTIVIDADES POR FECHA — eventos puntuales (festivales, ferias, exhibiciones) que caen en las fechas del viaje. Marcar claramente los eventos confirmados que el usuario ya tiene planeados.

4. ITINERARIOS BORRADOR POR ZONA — 5 a 10 itinerarios temáticos/por barrio, con horarios aproximados, caminables cuando sea posible. Cada itinerario con zona/tema, día sugerido tentativo, lista de paradas con horarios estimados, notas (qué día cierran, horarios especiales), adaptación a preferencias.

5. LUGARES ADICIONALES A CONSIDERAR.

6. TRANSPORTE — cómo moverse en la ciudad, opciones de bici, ferry, subte según la ciudad.

7. DECISIONES PENDIENTES — cosas que requieren elegir (ej: qué mirador, qué museos, qué pases) con precios y tradeoffs.

8. NOTAS POR DÍA DE LA SEMANA — qué cierra ciertos días, eventos recurrentes (ferias de sábado/domingo, etc.).

9. TIPS GENERALES.

10. ESTADO DE LA PLANIFICACIÓN — qué está listo, qué pendiente.

No inventes data. Si no sabés algo específico, mencioná que hay que verificar. Priorizá ser útil sobre ser exhaustivo.

Ajustá el contenido al presupuesto y preferencias declarados. Un usuario con presupuesto bajo debería recibir más opciones gratuitas; uno con foco en arte callejero debería ver barrios alternativos, no museos clásicos como prioridad.

Escribí en tono directo y cálido, sin tono corporativo ni excesivamente formal.`;

export const SYSTEM_PROMPT_EN = `You are TripAi, a travel planning assistant. Your task is to generate a detailed and useful master document for a trip, based on the data a user completed in an onboarding form.

The document must be:
- Written in English
- In well-structured Markdown with headers, lists, and tables
- Practical and actionable, not generic or flowery
- Tailored to the user's specific preferences
- With verifiable information (prices, hours, approximate locations) up to date
- Divided into clear sections

The document must include:

1. TRIP SUMMARY — destination(s), dates, duration, travelers, accommodation with address, estimated travel times from accommodation to key tourist areas.

2. TRAVELER PREFERENCES — clear record of what was selected.

3. EVENTS AND ACTIVITIES BY DATE — specific events (festivals, fairs, exhibitions) falling within the trip dates. Clearly mark confirmed events the user already planned.

4. DRAFT ITINERARIES BY AREA — 5 to 10 thematic/neighborhood itineraries, with approximate times, walkable when possible. Each itinerary with area/theme, tentative day, list of stops with estimated times, notes (what closes which days, special hours), adaptation to preferences.

5. ADDITIONAL PLACES TO CONSIDER.

6. TRANSPORT — how to get around, bike, ferry, subway options depending on city.

7. PENDING DECISIONS — things requiring a choice (e.g., which viewpoint, which museums, which passes) with prices and trade-offs.

8. NOTES BY DAY OF WEEK — what closes certain days, recurring events (Saturday/Sunday fairs, etc.).

9. GENERAL TIPS.

10. PLANNING STATUS — what's ready, what's pending.

Don't invent data. If you don't know something specific, mention it needs verification. Prioritize usefulness over exhaustiveness.

Adjust content to declared budget and preferences. A low-budget user should get more free options; one focused on street art should see alternative neighborhoods, not classic museums as priority.

Write in a direct and warm tone, no corporate or overly formal tone.`;

export function buildUserPrompt(trip: Trip, locale: "es" | "en"): string {
  const dests = [trip.destination, ...(trip.additionalDestinations ?? [])]
    .map((d) => `${d.city}, ${d.country}`)
    .join(" + ");

  const prefs = trip.preferences.chips.length > 0 ? trip.preferences.chips.join(", ") : "(none)";

  const events =
    trip.confirmedEvents && trip.confirmedEvents.length > 0
      ? trip.confirmedEvents
          .map((e) => `- ${e.date}${e.time ? " " + e.time : ""}: ${e.what}${e.address ? " (" + e.address + ")" : ""}`)
          .join("\n")
      : "(none)";

  if (locale === "en") {
    return `Trip data:

DESTINATION: ${dests}
DATES: ${trip.dates.arrival}${trip.dates.arrivalTime ? " " + trip.dates.arrivalTime : ""} to ${trip.dates.departure}${trip.dates.departureTime ? " " + trip.dates.departureTime : ""}

TRAVELERS: ${trip.travelers.count} people (${trip.travelers.type})
${trip.travelers.ageGroups?.length ? "Age groups: " + trip.travelers.ageGroups.join(", ") : ""}

ACCOMMODATION: ${trip.accommodation?.address ?? "not specified"} ${trip.accommodation?.name ? `(${trip.accommodation.name})` : ""}

PREFERENCES (selected chips): ${prefs}
${trip.preferences.freeText ? `Additional comment: ${trip.preferences.freeText}` : ""}

PACE AND STYLE:
- Daily pace: ${trip.style.pace}
- Typical departure time: ${trip.style.departureTime}
- Returns to accommodation between outings: ${trip.style.returnsHome}
- Walking vs transport preference (0-100): ${trip.style.walkVsTransport}

BUDGET:
- Daily food (group): ${trip.budget.foodDaily}
- Paid attractions level: ${trip.budget.attractionsLevel}
- Evaluate tourist passes: ${trip.budget.evaluatePasses}

CONFIRMED EVENTS:
${events}

FINAL COMMENTS:
${trip.finalComments ?? "(none)"}

Generate the complete master document following the system prompt structure.`;
  }

  // Spanish
  return `Datos del viaje:

DESTINO: ${dests}
FECHAS: ${trip.dates.arrival}${trip.dates.arrivalTime ? " " + trip.dates.arrivalTime : ""} a ${trip.dates.departure}${trip.dates.departureTime ? " " + trip.dates.departureTime : ""}

VIAJEROS: ${trip.travelers.count} personas (${trip.travelers.type})
${trip.travelers.ageGroups?.length ? "Edades: " + trip.travelers.ageGroups.join(", ") : ""}

HOSPEDAJE: ${trip.accommodation?.address ?? "no especificado"} ${trip.accommodation?.name ? `(${trip.accommodation.name})` : ""}

PREFERENCIAS (chips seleccionados): ${prefs}
${trip.preferences.freeText ? `Comentario adicional: ${trip.preferences.freeText}` : ""}

RITMO Y ESTILO:
- Ritmo diario: ${trip.style.pace}
- Horario de salida típica: ${trip.style.departureTime}
- Vuelve al hospedaje entre salidas: ${trip.style.returnsHome}
- Caminar vs transporte (0-100): ${trip.style.walkVsTransport}

PRESUPUESTO:
- Comida diaria (grupo): ${trip.budget.foodDaily}
- Nivel de atracciones pagas: ${trip.budget.attractionsLevel}
- Evalúa pases turísticos: ${trip.budget.evaluatePasses}

EVENTOS CONFIRMADOS:
${events}

COMENTARIOS FINALES:
${trip.finalComments ?? "(ninguno)"}

Generá el documento maestro completo siguiendo la estructura del system prompt.`;
}

