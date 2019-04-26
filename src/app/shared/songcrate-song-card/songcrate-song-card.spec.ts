import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongcrateSongCardComponent } from './songcrate-song-card.component';

describe('SongcrateSongCardComponent', () => {
  let component: SongcrateSongCardComponent;
  let fixture: ComponentFixture<SongcrateSongCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongcrateSongCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongcrateSongCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
