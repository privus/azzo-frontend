import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateInstallmentsModalComponent } from './generate-installments-modal.component';

describe('GenerateInstallmentsModalComponent', () => {
  let component: GenerateInstallmentsModalComponent;
  let fixture: ComponentFixture<GenerateInstallmentsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateInstallmentsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateInstallmentsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
