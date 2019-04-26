import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongcrateDialogComponent } from './songcrate-dialog.component';

describe('SongcrateDialogComponent', () => {
  let component: SongcrateDialogComponent;
  let fixture: ComponentFixture<SongcrateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongcrateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongcrateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
