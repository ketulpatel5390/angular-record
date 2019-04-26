import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseplanComponent } from './chooseplan.component';

describe('ChooseplanComponent', () => {
  let component: ChooseplanComponent;
  let fixture: ComponentFixture<ChooseplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
