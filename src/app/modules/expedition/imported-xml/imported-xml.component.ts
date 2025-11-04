import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NfResume, Xml } from '../models';
import { ActivatedRoute } from '@angular/router';
import { ExpeditionService } from '../services/expedition.service';

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
}
