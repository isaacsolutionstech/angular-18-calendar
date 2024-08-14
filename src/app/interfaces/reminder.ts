import type { Weather } from "./weather";

export interface Reminder {
  id: string;
  time: string;
  title: string;
  color: string;
  weather: Weather;
  description: string;
}
