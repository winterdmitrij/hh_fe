import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountgroupComponent } from './accountgroup.component';

describe('AccountgroupComponent', () => {
  let component: AccountgroupComponent;
  let fixture: ComponentFixture<AccountgroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountgroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
