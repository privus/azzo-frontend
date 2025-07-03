import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditModalPersonComponent } from './credit-modal-person.component';

describe('CreditModalComponent', () => {
  let component: CreditModalPersonComponent;
  let fixture: ComponentFixture<CreditModalPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditModalPersonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditModalPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
