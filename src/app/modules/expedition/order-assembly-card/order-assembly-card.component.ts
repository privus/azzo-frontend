import { Component, Input, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Order, AssemblyItem } from '../../../modules/commerce/models';
import { LocalStorageService } from '../../../core/services';
import { OrderService } from '../../commerce/services/order.service';
import Swal from 'sweetalert2';
import { AssemblySessionService } from '../services/assembly-session.service';
import { AssemblyDto, AssemblyResponse } from '../models';
import { HostListener } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-assembly-card',
  templateUrl: './order-assembly-card.component.html',
  styleUrls: ['./order-assembly-card.component.scss'],
})
export class OrderAssemblyCardComponent implements OnInit, OnDestroy {
  @Input() order!: Order;
  @Input() progress!: AssemblyResponse;

  products: AssemblyItem[] = [];
  isLoading = true;
  scanningEnabled = false;
  multiplicador = 1;
  userEmail: string = '';
  isCompleted = false;
  private lastSavedProgress: { [itemId: number]: number } = {};
  montagens: { [codigo: number]: any } = {};
  private subscriptions: Subscription[] = [];
  isSwitching = false;

  @ViewChild('scannerInput', { static: false })
  scannerInput!: ElementRef<HTMLInputElement>;

  constructor(
    private cdr: ChangeDetectorRef,
    private localStorage: LocalStorageService,
    private orderService: OrderService,
    private assemblySession: AssemblySessionService,
    private elementRef: ElementRef,
  ) {}

  ngOnInit() {
    this.loadUserInfo();
    this.setupProductsFromProgress();
    this.listenToOrderSwitch();
    this.listenToActiveOrderChange();

    this.isLoading = false;
  }

  private loadUserInfo() {
    const storageInfo = this.localStorage.get('STORAGE_MY_INFO');
    this.userEmail = storageInfo ? JSON.parse(storageInfo).email : '';
  }

  private setupProductsFromProgress() {
    const scannedMap = new Map<number, number>();
    (this.progress?.progress || []).forEach((p) => scannedMap.set(p.itensVendaId, p.scannedCount));

    this.products = this.order.itensVenda.map((item) => {
      const scanned = scannedMap.get(item.itens_venda_id) || 0;
      this.lastSavedProgress[item.itens_venda_id] = scanned;
      return {
        ...item,
        scannedCount: scanned,
      };
    });

    this.isCompleted = this.progress.status === 'finalizada';
  }

  private listenToOrderSwitch() {
    this.subscriptions.push(
      this.assemblySession.onOrderSwitch$().subscribe((oldCode) => {
        if (oldCode === this.order.codigo && this.scanningEnabled && !this.isCompleted) {
          this.saveProgress('pausada').then(() => {
            this.assemblySession.confirmSaveComplete();
          });
          this.scanningEnabled = false;
          this.cdr.detectChanges();
        }
      }),
    );
  }

  private listenToActiveOrderChange() {
    this.subscriptions.push(
      this.assemblySession.getActiveOrder$().subscribe((activeCode) => {
        if (activeCode !== this.order.codigo) {
          this.saveProgress('pausada');
          this.scanningEnabled = false;
        }
      }),
    );
  }

  ngOnDestroy() {
    this.saveProgress();
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  async startAssembly() {
    const activeCode = this.assemblySession.getActiveOrderSync();

    if (activeCode && activeCode !== this.order.codigo) {
      this.isSwitching = true;
      await this.assemblySession.waitPreviousSave();
      this.isSwitching = false;
    }

    if (this.isCompleted) {
      this.products.forEach((item) => (item.scannedCount = 0));
      this.isCompleted = false;
    }

    this.assemblySession.setActiveOrder(this.order.codigo);
    this.scanningEnabled = true;
    this.cdr.detectChanges();
    setTimeout(() => this.scannerInput?.nativeElement?.focus(), 0);
  }

  onScan(raw: string) {
    if (!this.scanningEnabled || this.isSwitching) return;
    const code = raw.trim();
    const prod = this.products.find((p) => p.produto.ean === code);

    this.scannerInput.nativeElement.blur();
    this.scannerInput.nativeElement.value = '';

    if (!prod) {
      setTimeout(() => {
        Swal.fire({
          icon: 'error',
          title: 'Produto não está na lista!',
          text: 'Esse produto não está na lista do pedido. Atenção!',
          confirmButtonText: 'OK',
        }).then(() => this.focusScannerInput());
      }, 0);
      return;
    }

    if (prod.scannedCount + this.multiplicador > prod.quantidade) {
      setTimeout(() => {
        Swal.fire({
          icon: 'error',
          title: 'Quantidade excedida!',
          text: 'Quantidade máxima deste produto já bipada!',
          confirmButtonText: 'OK',
        }).then(() => this.focusScannerInput());
      }, 0);
      return;
    }

    prod.scannedCount = Math.min(prod.scannedCount + this.multiplicador, prod.quantidade);

    const allComplete = this.products.every((item) => item.scannedCount === item.quantidade);

    if (allComplete) {
      this.isCompleted = true;
      this.scanningEnabled = false;
      this.saveProgress('finalizada');
      return;
    }

    this.multiplicador = 1;
    this.focusScannerInput();
  }

  isFullyScanned(item: AssemblyItem): boolean {
    return item.scannedCount === item.quantidade;
  }

  focusScannerInput() {
    if (this.scanningEnabled) {
      setTimeout(() => {
        this.scannerInput?.nativeElement?.focus();
      }, 100);
    }
  }

  saveProgress(status: 'iniciada' | 'pausada' | 'finalizada' = 'iniciada'): Promise<void> {
    return new Promise((resolve) => {
      const bipados = this.products
        .filter((item) => {
          const last = this.lastSavedProgress[item.itens_venda_id] || 0;
          return item.scannedCount !== last;
        })
        .map((item) => ({
          itensVendaId: item.itens_venda_id,
          scannedCount: item.scannedCount,
        }));

      if (!bipados.length) return resolve(); // nada a salvar

      for (const item of bipados) {
        this.lastSavedProgress[item.itensVendaId] = item.scannedCount;
      }

      const dto: AssemblyDto = {
        montagemId: this.progress?.montagemId ?? undefined,
        responsavel: this.userEmail,
        status,
        itens: bipados,
      };

      this.orderService.updateAssemblyStatus(dto).subscribe({
        next: () => resolve(),
        error: () => {
          Swal.fire('Erro', 'Falha ao salvar montagem', 'error');
          resolve();
        },
      });
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    const target = event.target as HTMLElement;

    const isStartButton = target.closest('.btn-start-montagem') !== null;

    if (!clickedInside && !isStartButton && this.scanningEnabled && !this.isCompleted) {
      this.saveProgress();
      this.scanningEnabled = false;
      this.assemblySession.clearActiveOrder();
      this.cdr.detectChanges();
    }
  }
}
