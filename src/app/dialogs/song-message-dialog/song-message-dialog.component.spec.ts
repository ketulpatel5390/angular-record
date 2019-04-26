import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongMessageDialogComponent } from './song-message-dialog.component';

describe('SongMessageDialogComponent', () => {
  let component: SongMessageDialogComponent;
  let fixture: ComponentFixture<SongMessageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongMessageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
