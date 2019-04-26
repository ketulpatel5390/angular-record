import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongbyGenreComponent } from './songbyGenre.component';

describe('SongbyGenreComponent', () => {
  let component: SongbyGenreComponent;
  let fixture: ComponentFixture<SongbyGenreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongbyGenreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongbyGenreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
