import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditModalComponent } from './credit-modal.component';

describe('CreditModalComponent', () => {
  let component: CreditModalComponent;
  let fixture: ComponentFixture<CreditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
