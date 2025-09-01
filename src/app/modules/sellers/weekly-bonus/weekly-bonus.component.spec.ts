import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyBonusComponent } from './weekly-bonus.component';

describe('WeeklyBonusComponent', () => {
  let component: WeeklyBonusComponent;
  let fixture: ComponentFixture<WeeklyBonusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyBonusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
