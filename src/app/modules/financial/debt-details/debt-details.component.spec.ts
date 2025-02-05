import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtDetailsComponent } from './debt-details.component';

describe('DebtDetailsComponent', () => {
  let component: DebtDetailsComponent;
  let fixture: ComponentFixture<DebtDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebtDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebtDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
