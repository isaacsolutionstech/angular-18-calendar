import { TestBed } from '@angular/core/testing';
import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial modalState$ value as an empty object', (done: DoneFn) => {
    service.modalState$.subscribe(state => {
      expect(state).toEqual({});
      done();
    });
  });

  describe('open', () => {
    it('should set the modal state to true for the given key', (done: DoneFn) => {
      service.open('testModal');

      service.modalState$.subscribe(state => {
        expect(state).toEqual({ testModal: true });
        done();
      });
    });

    it('should not affect the state of other modals', (done: DoneFn) => {
      service.open('testModal');
      service.open('anotherModal');

      service.modalState$.subscribe(state => {
        expect(state).toEqual({ testModal: true, anotherModal: true });
        done();
      });
    });
  });

  describe('close', () => {
    it('should set the modal state to false for the given key', (done: DoneFn) => {
      // Open a modal first to change its state
      service.open('testModal');
      service.close('testModal');

      service.modalState$.subscribe(state => {
        expect(state).toEqual({ testModal: false });
        done();
      });
    });

    it('should not affect the state of other modals', (done: DoneFn) => {
      service.open('testModal');
      service.open('anotherModal');
      service.close('testModal');

      service.modalState$.subscribe(state => {
        expect(state).toEqual({ testModal: false, anotherModal: true });
        done();
      });
    });
  });
});