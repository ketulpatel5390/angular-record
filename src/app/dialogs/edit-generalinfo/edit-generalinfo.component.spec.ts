import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGeneralinfoDialogComponent } from './edit-generalinfo.component';

describe('EditGeneralinfoDialogComponent', () => {
  let component: EditGeneralinfoDialogComponent;
  let fixture: ComponentFixture<EditGeneralinfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGeneralinfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGeneralinfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
