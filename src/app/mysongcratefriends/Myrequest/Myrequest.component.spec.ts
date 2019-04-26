import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyrequestComponent } from './Myrequest.component';

describe('MyrequestComponent', () => {
  let component: MyrequestComponent;
  let fixture: ComponentFixture<MyrequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyrequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
