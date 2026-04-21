// TripAi — Tipos centrales del viaje
// Estos tipos representan la estructura completa de un viaje cargado por el usuario.

export type TripStatus = "planning" | "in_progress" | "finished";

export type TravelerType = "solo" | "couple" | "friends" | "family" | "mixed";
export type AgeGroup = "kids" | "teens" | "adults" | "seniors";
export type AccommodationType = "hotel" | "airbnb" | "known_place" | "hostel" | "other";
export type Pace = "chill" | "moderate" | "intense";
export type DepartureTime = "early" | "mid" | "late";
export type ReturnsHome = "yes" | "no" | "depends";

export interface Destination {
  city: string;
  country: string;
}

export interface Dates {
  arrival: string; // ISO date
  arrivalTime?: string; // HH:mm
  departure: string; // ISO date
  departureTime?: string; // HH:mm
}

export interface Travelers {
  type: TravelerType;
  count: number;
  ageGroups?: AgeGroup[];
}

export interface Accommodation {
  address?: string;
  name?: string;
  type?: AccommodationType;
}

export interface Preferences {
  chips: string[];
  freeText?: string;
}

export interface Style {
  pace: Pace;
  departureTime: DepartureTime;
  returnsHome: ReturnsHome;
  walkVsTransport: number; // 0-100
}

export interface Budget {
  foodDaily: string;
  attractionsLevel: "avoid" | "moderate" | "no_limit";
  evaluatePasses: boolean;
}

export interface ConfirmedEvent {
  date: string; // ISO date
  time?: string; // HH:mm
  what: string;
  address?: string;
}

export interface ActivityItem {
  id: string;
  day: number;
  title: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  status: "planned" | "done" | "skipped" | "rescheduled";
  notes?: string;
}

export interface DayLog {
  date: string;
  brief?: string;
  alerts?: string[];
}

export interface Trip {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: TripStatus;

  // Onboarding data
  destination: Destination;
  additionalDestinations?: Destination[];
  dates: Dates;
  travelers: Travelers;
  accommodation?: Accommodation;
  preferences: Preferences;
  style: Style;
  budget: Budget;
  confirmedEvents?: ConfirmedEvent[];
  freeDays?: string[]; // ISO dates
  finalComments?: string;

  // Generated content
  masterDoc?: string; // Markdown

  // In-trip state (Fase 2)
  activities?: ActivityItem[];
  dailyLog?: Record<string, DayLog>;
}

// Draft del onboarding en curso (antes de que el usuario termine el flujo)
export type TripDraft = Partial<Omit<Trip, "id" | "createdAt" | "updatedAt" | "status">>;

