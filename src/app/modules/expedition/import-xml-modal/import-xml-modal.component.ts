import { Component, ElementRef, EventEmitter, Output, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ExpeditionService } from '../services/expedition.service';
import { Distributor } from '../models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-import-xml-modal',
  templateUrl: './import-xml-modal.component.html',
  styleUrls: ['./import-xml-modal.component.scss'],
})
export class ImportXmlModalComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() closed = new EventEmitter<void>();

  uploadedFiles: File[] = [];
  fornecedores: Distributor[] = [];
  selectedFornecedorId: number | null = null;
  formattedProdutos = '';

  loading = false;
  responseMessage = '';
  result: any = null;

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private expeditionService: ExpeditionService,
    public activeModal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    this.expeditionService.getDistributors().subscribe({
      next: (data) => {
        this.fornecedores = data;
      },
    });
  }

  triggerFileInput(): void {
    if (!this.selectedFornecedorId) {
      alert('Selecione um fornecedor antes de importar.');
      return;
    }
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFiles = [file];
    }
  }

  uploadXml(): void {
    if (this.uploadedFiles.length === 0 || !this.selectedFornecedorId) return;

    const formData = new FormData();
    formData.append('file', this.uploadedFiles[0]);

    this.loading = true;

    this.http.post(`${this.baseUrl}stock/upload/${this.selectedFornecedorId}`, formData).subscribe({
      next: (res: any) => {
        this.result = res;
        this.responseMessage = 'Nota Fiscal Importada com Sucesso!';
        this.loading = false;
      },
      error: () => {
        this.responseMessage = 'Erro ao importar XML';
        this.loading = false;
      },
    });
  }

  close(): void {
    this.closed.emit();
  }
}
