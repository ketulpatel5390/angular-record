import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifylinkComponent } from './verifylink.component';

describe('VerifylinkComponent', () => {
  let component: VerifylinkComponent;
  let fixture: ComponentFixture<VerifylinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifylinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifylinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
