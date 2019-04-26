import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenresdisplayDialogComponent } from './genres-display-dialog.component';

describe('GenresdisplayDialogComponent', () => {
  let component: GenresdisplayDialogComponent;
  let fixture: ComponentFixture<GenresdisplayDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenresdisplayDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenresdisplayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
