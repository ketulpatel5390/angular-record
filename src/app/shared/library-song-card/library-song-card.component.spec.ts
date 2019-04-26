import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrarySongCardComponent } from './library-song-card.component';

describe('LibrarySongCardComponent', () => {
  let component: LibrarySongCardComponent;
  let fixture: ComponentFixture<LibrarySongCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibrarySongCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibrarySongCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
