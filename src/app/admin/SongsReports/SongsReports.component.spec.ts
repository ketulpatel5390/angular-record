import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongsReportsComponent } from './SongsReports.component';

describe('SongsReportsComponent', () => {
  let component: SongsReportsComponent;
  let fixture: ComponentFixture<SongsReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongsReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
