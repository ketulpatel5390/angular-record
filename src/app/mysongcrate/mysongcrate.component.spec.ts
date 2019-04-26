import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MysongcrateComponent } from './mysongcrate.component';

describe('MysongcrateComponent', () => {
  let component: MysongcrateComponent;
  let fixture: ComponentFixture<MysongcrateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MysongcrateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MysongcrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
