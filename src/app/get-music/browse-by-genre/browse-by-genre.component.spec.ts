import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsebygenreComponent } from './browse-by-genre.component';

describe('BrowsebygenreComponent', () => {
  let component: BrowsebygenreComponent;
  let fixture: ComponentFixture<BrowsebygenreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowsebygenreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowsebygenreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
