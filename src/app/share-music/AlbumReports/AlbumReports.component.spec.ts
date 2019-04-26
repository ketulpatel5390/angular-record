import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumReportsComponent } from './AlbumReports.component';

describe('AlbumReportsComponent', () => {
  let component: AlbumReportsComponent;
  let fixture: ComponentFixture<AlbumReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
