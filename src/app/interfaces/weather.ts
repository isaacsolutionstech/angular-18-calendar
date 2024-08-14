import type { WeatherMain } from "./weather-main";
import type { WeatherWind } from "./weather-wind";

export interface Weather {
  name: string;
  main: WeatherMain;
  wind: WeatherWind;
}
