import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightsUserComponent } from './rights-user.component';

describe('RightsUserComponent', () => {
  let component: RightsUserComponent;
  let fixture: ComponentFixture<RightsUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightsUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
