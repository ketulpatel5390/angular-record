import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeolocationMessageDialogComponent } from './geolocation-message-dialog.component';

describe('GeolocationMessageDialogComponent', () => {
  let component: GeolocationMessageDialogComponent;
  let fixture: ComponentFixture<GeolocationMessageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeolocationMessageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeolocationMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
