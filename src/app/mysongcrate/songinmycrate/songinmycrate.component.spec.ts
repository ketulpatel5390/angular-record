import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SonginmycrateComponent } from './songinmycrate.component';

describe('SonginmycrateComponent', () => {
  let component: SonginmycrateComponent;
  let fixture: ComponentFixture<SonginmycrateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SonginmycrateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SonginmycrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
