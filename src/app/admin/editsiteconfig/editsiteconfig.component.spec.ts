import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSiteconfigComponent } from './editsiteconfig.component';

describe('EditSiteconfigComponent', () => {
  let component: EditSiteconfigComponent;
  let fixture: ComponentFixture<EditSiteconfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSiteconfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSiteconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
