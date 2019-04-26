import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumLibrarySongCardComponent } from './album-library-song-card.component';

describe('AlbumLibrarySongCardComponent', () => {
  let component: AlbumLibrarySongCardComponent;
  let fixture: ComponentFixture<AlbumLibrarySongCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumLibrarySongCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumLibrarySongCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
