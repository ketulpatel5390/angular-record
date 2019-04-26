import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSongCardComponent } from './admin-song-card.component';

describe('AdminSongCardComponent', () => {
  let component: AdminSongCardComponent;
  let fixture: ComponentFixture<AdminSongCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSongCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSongCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
