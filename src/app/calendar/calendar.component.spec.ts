import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';
import { ModalService } from '../modal/modal.service';
import { ApiService } from '../api/api.service';
import { of, throwError, Subject } from 'rxjs';
import { Weather } from '../interfaces/weather';
import { Reminder } from '../interfaces/reminder';
import { CommonModule } from '@angular/common';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let modalService: jasmine.SpyObj<ModalService>;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    const modalServiceSpy = jasmine.createSpyObj(
      'ModalService',
      ['open', 'close'],
      {
        modalState$: of({}), // Mock do Observable modalState$
      }
    );
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getCityData']);

    // Configuração do retorno do método getCityData
    const mockWeather: Weather = {
      name: 'Recife',
      main: {
        temp: 30,
        humidity: 40,
      },
      wind: {
        speed: 28,
      },
    } as Weather;
    apiServiceSpy.getCityData.and.returnValue(of(mockWeather));

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        CalendarComponent, // Adicione o componente aqui, não em 'declarations'
      ],
      providers: [
        { provide: ModalService, useValue: modalServiceSpy },
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(ModalService) as jasmine.SpyObj<ModalService>;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize calendar on ngOnInit', () => {
    spyOn(component as any, 'generateCalendarDays').and.callThrough();
    component.ngOnInit();
    expect(component['generateCalendarDays']).toHaveBeenCalledWith(0);
  });

  it('should generate calendar days', () => {
    component; // Chame o método para gerar os dias
    expect(component.calendar.length).toBe(42);
  });

  it('should handle getCity successfully', () => {
    const mockWeather: Weather = {
      name: 'Recife',
      main: {
        temp: 30,
        humidity: 40,
      },
      wind: {
        speed: 28,
      },
    } as Weather;
    apiService.getCityData.and.returnValue(of(mockWeather));

    component.handleGetCity('London');
    fixture.detectChanges();

    expect(component.weather).toEqual(mockWeather);
    expect(component.showWeather).toBeTrue();
  });

  it('should handle getCity error', () => {
    apiService.getCityData.and.returnValue(
      throwError(() => new Error('Error'))
    );
    component.handleGetCity('London');
    fixture.detectChanges();
    expect(component.showWeather).toBeFalse();
  });

  it('should handle save', () => {
    const originalNow = Date.now; // Salva a função Date.now original

    // Espiã para capturar o ID gerado
    const nowSpy = jasmine
      .createSpy('Date.now')
      .and.callFake(() => 1723670564248); // Defina um valor fixo para Date.now()
    Date.now = nowSpy; // Substitua Date.now com a espiã

    const form: Reminder = {
      id: '1', // ID do lembrete que você está configurando
      color: 'rgb(51, 255, 87)',
      weather: {
        name: 'Carpina',
        main: {
          temp: 24,
          humidity: 60,
        },
        wind: {
          speed: 30,
        },
      },
      time: '10:01 PM',
      title: 'Meeting',
      description: 'Meeting with team',
      date: new Date().toISOString(),
    } as Reminder;

    component['selectedDate'] = new Date();
    spyOn(component, 'clearForm').and.callThrough();

    component.handleSave(JSON.stringify(form));

    const day = component.calendar.find(
      (day) =>
        day.date?.toDateString() === component['selectedDate']?.toDateString()
    );

    // Verifique se o lembrete adicionado tem o ID esperado
    expect(day?.reminders.length).toBe(1);
    expect(day?.reminders[0].id).toBe('1723670564248'); // Use o valor fixo definido
    expect(component.clearForm).toHaveBeenCalled();

    Date.now = originalNow; // Restaure a função Date.now original
  });

  it('should increase month', () => {
    const initialMonthIndex = component['monthIndex'];
    component.increaseMonth();
    expect(component['monthIndex']).toBe(initialMonthIndex + 1);
  });

  it('should decrease month', () => {
    const initialMonthIndex = component['monthIndex'];
    component.decreaseMonth();
    expect(component['monthIndex']).toBe(initialMonthIndex - 1);
  });

  it('should set current month', () => {
    component['monthIndex'] = 5; // Defina para um valor não zero
    component.setCurrentMonth();
    expect(component['monthIndex']).toBe(0);
  });

  it('should open modal with correct date', () => {
    const date = new Date();
    component.openModal(date);
    expect(component['selectedDate']).toEqual(date);
    expect(component.selectedDay).toBe(String(date.getDate()));
    expect(component.selectedYear).toBe(String(date.getUTCFullYear()));
    expect(component.selectedMonth).toBe(component.monthNames[date.getMonth()]);
    expect(modalService.open).toHaveBeenCalledWith(String(date));
  });
});
