import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListApplicationCardComponent } from './list-application-card.component';

describe('ApplicationCardComponent', () => {
  let component: ListApplicationCardComponent;
  let fixture: ComponentFixture<ListApplicationCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListApplicationCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListApplicationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
