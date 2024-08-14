import type { Weather } from "./weather";

export interface Reminder {
  time: string;
  title: string;
  color: string;
  weather: Weather;
  description: string;
}
