import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportXmlModalComponent } from './import-xml-modal.component';

describe('ImportXmlModalComponent', () => {
  let component: ImportXmlModalComponent;
  let fixture: ComponentFixture<ImportXmlModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportXmlModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportXmlModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
