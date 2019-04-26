import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharemySongCrateComponent } from './SharemySongCrate.component';

describe('SharemySongCrateComponent', () => {
  let component: SharemySongCrateComponent;
  let fixture: ComponentFixture<SharemySongCrateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharemySongCrateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharemySongCrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
