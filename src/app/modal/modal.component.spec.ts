import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { ModalService } from './modal.service';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let modalService: ModalService;
  let modalStateSubject: Subject<{ [key: string]: boolean }>;

  beforeEach(async () => {
    modalStateSubject = new Subject<{ [key: string]: boolean }>();

    await TestBed.configureTestingModule({
      imports: [CommonModule, ModalComponent], // Importa ModalComponent aqui
      providers: [
        {
          provide: ModalService,
          useValue: {
            modalState$: modalStateSubject.asObservable(),
            close: jasmine.createSpy('close'),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(ModalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isVisible based on modalState$', () => {
    component.modalKey = 'testModal';
    modalStateSubject.next({ testModal: true });
    fixture.detectChanges();
    expect(component.isVisible).toBeTrue();
    
    modalStateSubject.next({ testModal: false });
    fixture.detectChanges();
    expect(component.isVisible).toBeFalse();
  });

  it('should subscribe to modalState$ on init', () => {
    spyOn(modalService.modalState$, 'subscribe').and.callThrough();
    component.ngOnInit();
    expect(modalService.modalState$.subscribe).toHaveBeenCalled();
  });

  it('should unsubscribe from modalState$ on destroy', () => {
    spyOn(component['modalSubscription']!, 'unsubscribe');
    component.ngOnDestroy();
    expect(component['modalSubscription']!.unsubscribe).toHaveBeenCalled();
  });

  describe('close', () => {
    it('should call modalService.close with modalKey and emit clear event', () => {
      component.modalKey = 'testModal';
      spyOn(component.clear, 'emit');

      component.close();

      expect(modalService.close).toHaveBeenCalledWith('testModal');
      expect(component.clear.emit).toHaveBeenCalled();
    });

    it('should emit clear event if modalKey is not defined', () => {
      component.modalKey = '';
      spyOn(component.clear, 'emit');

      component.close();

      expect(modalService.close).not.toHaveBeenCalled();
      expect(component.clear.emit).toHaveBeenCalled();
    });
  });
});