import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongcrateSongListComponent } from './songcrate-song-list.component';

describe('SongcrateSongListComponent', () => {
  let component: SongcrateSongListComponent;
  let fixture: ComponentFixture<SongcrateSongListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongcrateSongListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongcrateSongListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
