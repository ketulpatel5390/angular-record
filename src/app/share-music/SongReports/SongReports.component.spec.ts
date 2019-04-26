import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongReportsComponent } from './SongReports.component';

describe('SongReportsComponent', () => {
  let component: SongReportsComponent;
  let fixture: ComponentFixture<SongReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
