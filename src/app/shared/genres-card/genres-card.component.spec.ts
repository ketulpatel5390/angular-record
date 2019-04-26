import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenrescardComponent } from './genres-card.component';

describe('GenrescardComponent', () => {
  let component: GenrescardComponent;
  let fixture: ComponentFixture<GenrescardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenrescardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenrescardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
