import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsettingComponent } from './accountsetting.component';

describe('AccountsettingComponent', () => {
  let component: AccountsettingComponent;
  let fixture: ComponentFixture<AccountsettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
