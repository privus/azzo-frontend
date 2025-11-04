import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NfResume, Xml } from '../models';
import { ActivatedRoute } from '@angular/router';
import { ExpeditionService } from '../services/expedition.service';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-imported-xml',
  templateUrl: './imported-xml.component.html',
  styleUrls: ['./imported-xml.component.scss'],
})
export class ImportedXmlComponent implements OnInit {
  nfsResume: NfResume[] = [];
  filteredNfsResume: NfResume[] = [];
  searchTerm: string = '';
  expanded: Set<number> = new Set();
  loadingXml: Set<number> = new Set();

  xmlCache: { [numeroNfe: string]: Xml[] } = {};
  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private route: ActivatedRoute,
    private expeditionService: ExpeditionService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.nfsResume = this.route.snapshot.data['nfsResume'] || [];
    this.filteredNfsResume = [...this.nfsResume];
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredNfsResume = this.nfsResume.filter((nf) => nf.numero_nfe.toLowerCase().includes(term) || nf.emitente.toLowerCase().includes(term));
  }

  isExpanded(id: number): boolean {
    return this.expanded.has(id);
  }

  toggleExpand(nfId: number, numeroNfe: string): void {
    if (this.isExpanded(nfId)) {
      this.expanded.delete(nfId);
      return;
    }

    if (this.xmlCache[numeroNfe]) {
      this.expanded.add(nfId);
      return;
    }

    this.loadingXml.add(nfId);
    this.expeditionService.getXml(numeroNfe).subscribe({
      next: (data: Xml[]) => {
        this.xmlCache[numeroNfe] = data;
        this.loadingXml.delete(nfId);
        this.expanded.add(nfId);
        this.cdr.detectChanges();
      },
      error: () => {
        console.error(`Erro ao carregar XML da NF ${numeroNfe}`);
        this.loadingXml.delete(nfId);
        this.cdr.detectChanges();
      },
    });
  }

  getXmlForNf(numeroNfe: string): Xml[] {
    return this.xmlCache[numeroNfe] || [];
  }

  splitXml(xmls: Xml[]): Xml[][] {
    const chunkSize = Math.ceil(xmls.length / 3) || 1;
    return [xmls.slice(0, chunkSize), xmls.slice(chunkSize, chunkSize * 2), xmls.slice(chunkSize * 2)];
  }

  arrived(numeroNfe: string) {
    this.expeditionService.productsArrived(numeroNfe).subscribe({
      next: async (resp) => {
        await this.showAlert({
          icon: 'success',
          title: 'Nf-e atualizada!',
          text: resp.message,
          confirmButtonText: 'Ok',
        });
      },
      error: async (err) => {
        await this.showAlert({
          icon: 'error',
          title: 'Erro!',
          text: err?.error?.message || 'Não foi possível atualizar a nf-e.',
          confirmButtonText: 'Ok',
        });
      },
    });
  }

  reimportNf(numeroNfe: string) {
    Swal.fire({
      title: 'Confirmação',
      text: `Deseja reimportar a nf-e nº ${numeroNfe}? Essa ação é irreversível!`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, Reimportar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.expeditionService.reimportProducts(numeroNfe).subscribe({
          next: async (resp) => {
            await this.showAlert({
              icon: 'success',
              title: 'Nf-e reimportada!',
              text: resp.message,
              confirmButtonText: 'Ok',
            });
            window.location.reload();
          },
          error: async (err) => {
            await this.showAlert({
              icon: 'error',
              title: 'Erro!',
              text: err?.error?.message || 'Não foi possível reimportar a nf-e.',
              confirmButtonText: 'Ok',
            });
          },
        });
      }
    });
  }

  async showAlert(swalOptions: SweetAlertOptions): Promise<void> {
    this.swalOptions = swalOptions;
    this.cdr.detectChanges();
    await this.noticeSwal.fire();
  }
}
