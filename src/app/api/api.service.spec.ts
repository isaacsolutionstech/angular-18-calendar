import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import type { Weather } from '../interfaces/weather';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  const mockWeatherData: Weather = {
    main: {
      temp: 20,
      humidity: 30,
    },
    wind: {
      speed: 30,
    },
    name: 'Fortaleza',
  };

  const cityName = 'London';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica se não há requisições pendentes
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get city data', () => {
    const apiUrl = `${environment.API_WEATHER_URL}/weather?&units=metric&q=${cityName}&appid=${environment.API_WEATHER_APP_ID}`;

    service.getCityData(cityName).subscribe((data) => {
      expect(data).toEqual(mockWeatherData);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockWeatherData);
  });

  it('should handle error response', () => {
    const apiUrl = `${environment.API_WEATHER_URL}/weather?&units=metric&q=${cityName}&appid=${environment.API_WEATHER_APP_ID}`;

    service.getCityData(cityName).subscribe({
      next: () => fail('Expected an error, not weather data'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.error).toContain('Not Found');
      },
    });

    const req = httpMock.expectOne(apiUrl);
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
});