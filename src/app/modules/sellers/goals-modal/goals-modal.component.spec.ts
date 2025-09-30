import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsModalComponent } from './goals-modal.component';

describe('GoalsModalComponent', () => {
  let component: GoalsModalComponent;
  let fixture: ComponentFixture<GoalsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
