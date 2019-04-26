import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MySongCratePendingRequestsComponent } from './MySongCratePendingRequests.component';

describe('MySongCratePendingRequestsComponent', () => {
  let component: MySongCratePendingRequestsComponent;
  let fixture: ComponentFixture<MySongCratePendingRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySongCratePendingRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySongCratePendingRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
