import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongplaylistComponent } from './songplaylist.component';

describe('SongplaylistComponent', () => {
  let component: SongplaylistComponent;
  let fixture: ComponentFixture<SongplaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongplaylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongplaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
