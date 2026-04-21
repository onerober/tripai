// TripAi — Store de viajes (localStorage)
// Fase 1: persistencia simple en el navegador, sin cuentas.
// Fase 4: migrar a backend con auth.

"use client";

import type { Trip, TripDraft } from "@/types/trip";

const STORAGE_TRIPS = "tripai:trips";
const STORAGE_DRAFT = "tripai:draft";
const STORAGE_ACTIVE = "tripai:active_trip_id";

// -- Drafts (viaje en creación) --

export function getDraft(): TripDraft {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_DRAFT);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function updateDraft(partial: TripDraft): TripDraft {
  const current = getDraft();
  const updated = { ...current, ...partial };
  window.localStorage.setItem(STORAGE_DRAFT, JSON.stringify(updated));
  return updated;
}

export function clearDraft() {
  window.localStorage.removeItem(STORAGE_DRAFT);
}

// -- Trips guardados --

export function getAllTrips(): Trip[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_TRIPS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getTrip(id: string): Trip | undefined {
  return getAllTrips().find((t) => t.id === id);
}

export function saveTrip(trip: Trip) {
  const trips = getAllTrips();
  const idx = trips.findIndex((t) => t.id === trip.id);
  if (idx >= 0) {
    trips[idx] = trip;
  } else {
    trips.push(trip);
  }
  window.localStorage.setItem(STORAGE_TRIPS, JSON.stringify(trips));
}

export function deleteTrip(id: string) {
  const trips = getAllTrips().filter((t) => t.id !== id);
  window.localStorage.setItem(STORAGE_TRIPS, JSON.stringify(trips));
  if (getActiveTripId() === id) setActiveTripId(null);
}

// -- Active trip --

export function getActiveTripId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_ACTIVE);
}

export function setActiveTripId(id: string | null) {
  if (id === null) {
    window.localStorage.removeItem(STORAGE_ACTIVE);
  } else {
    window.localStorage.setItem(STORAGE_ACTIVE, id);
  }
}

// -- Helpers --

export function generateTripId(): string {
  return "trip_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
}

export function draftToTrip(draft: TripDraft): Trip {
  const now = new Date().toISOString();
  return {
    id: generateTripId(),
    createdAt: now,
    updatedAt: now,
    status: "planning",
    destination: draft.destination ?? { city: "", country: "" },
    additionalDestinations: draft.additionalDestinations,
    dates: draft.dates ?? { arrival: "", departure: "" },
    travelers: draft.travelers ?? { type: "solo", count: 1 },
    accommodation: draft.accommodation,
    preferences: draft.preferences ?? { chips: [] },
    style: draft.style ?? {
      pace: "moderate",
      departureTime: "mid",
      returnsHome: "depends",
      walkVsTransport: 50,
    },
    budget: draft.budget ?? {
      foodDaily: "100-200",
      attractionsLevel: "moderate",
      evaluatePasses: false,
    },
    confirmedEvents: draft.confirmedEvents,
    freeDays: draft.freeDays,
    finalComments: draft.finalComments,
  };
}

