import type { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import type { Weather } from '../interfaces/weather';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiWeatherUrl: string = environment.API_WEATHER_URL;
  private apiWeatherAppID: string = environment.API_WEATHER_APP_ID;

  constructor(private http: HttpClient) {}

  getCityData(cityName: string): Observable<Weather> {
    return this.http.get<Weather>(
      `${this.apiWeatherUrl}/weather?&units=metric&q=${cityName}&appid=${this.apiWeatherAppID}`
    );
  }
}
