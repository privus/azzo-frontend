// print-order.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-print-order',
  templateUrl: './print-order.component.html',
  styleUrls: ['./print-order.component.scss'],
})
export class PrintOrderComponent implements OnInit, OnDestroy {
  pdfUrl: SafeResourceUrl | null = null;
  private sub: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const responsible = this.route.snapshot.queryParamMap.get('responsible') || 'Sistema';

    if (id) {
      this.http.post(`http://localhost:3000/sells/${id}/print`, { responsible }, { responseType: 'blob' }).subscribe({
        next: (pdfBlob) => {
          if (!pdfBlob || pdfBlob.size === 0) {
            console.error('⚠️ PDF vazio ou não gerado');
            return;
          }

          const blob = new Blob([pdfBlob], { type: 'application/pdf' });
          const objectURL = URL.createObjectURL(blob);
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
        },
        error: (err) => {
          console.error('❌ Erro ao buscar PDF:', err);
        },
      });
    }
  }

  private loadPdf(orderId: string, responsible: string): void {
    this.pdfUrl = null;

    this.http.post(`http://localhost:3000/sells/${orderId}/print`, { responsible }, { responseType: 'blob' }).subscribe((pdfBlob) => {
      const blob = new Blob([pdfBlob], { type: 'application/pdf' });
      const objectURL = URL.createObjectURL(blob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
