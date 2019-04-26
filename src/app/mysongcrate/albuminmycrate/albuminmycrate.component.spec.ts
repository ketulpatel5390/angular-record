import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbuminmycrateComponent } from './albuminmycrate.component';

describe('AlbuminmycrateComponent', () => {
  let component: AlbuminmycrateComponent;
  let fixture: ComponentFixture<AlbuminmycrateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbuminmycrateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbuminmycrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
