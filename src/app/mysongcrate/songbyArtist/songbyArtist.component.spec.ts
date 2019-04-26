import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongbyArtistComponent } from './songbyArtist.component';

describe('SongbyArtistComponent', () => {
  let component: SongbyArtistComponent;
  let fixture: ComponentFixture<SongbyArtistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongbyArtistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongbyArtistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
