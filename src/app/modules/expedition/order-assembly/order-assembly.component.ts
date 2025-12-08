import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Order, AssemblyItem } from '../../commerce/models';
import { OrderService } from '../../commerce/services/order.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import Swal from 'sweetalert2';
import { AssemblyDto, AssemblyResponse } from '../models';

@Component({
  selector: 'app-order-assembly',
  templateUrl: './order-assembly.component.html',
  styleUrls: ['./order-assembly.component.scss'],
})
export class OrderAssemblyComponent implements OnInit, OnDestroy {
  code!: number;
  order!: Order;
  products: AssemblyItem[] = [];
  isLoading = true;
  multiplicador = 1;
  userEmail: string = '';
  montagens: { [codigo: number]: any } = {};
  status: { [codigo: number]: string } = {};
  isCompleted: { [codigo: number]: boolean } = {};
  scanningEnabled: { [codigo: number]: boolean } = {};
  isFullscreen = false;
  lastCode: number | null = null;
  private lastSavedProgress: { [itemId: number]: number } = {};
  private isSaving = false;

  @ViewChild('scannerInput', { static: false })
  scannerInput!: ElementRef<HTMLInputElement>;

  @ViewChild('cardBody', { static: false })
  cardBody!: ElementRef<HTMLDivElement>;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private orderService: OrderService,
    private localStorage: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.handleRouteData();
  }

  private loadUserInfo() {
    const storageInfo = this.localStorage.get('STORAGE_MY_INFO');
    this.userEmail = storageInfo ? JSON.parse(storageInfo).email : '';
  }

  private handleRouteData() {
    this.route.parent!.data.subscribe((data) => {
      const orders = data.orders.orders as Order[];
      this.route.paramMap.subscribe((params: ParamMap) => {
        if (this.code && this.products.some((p) => p.scannedCount > 0)) {
          this.saveProgress();
        }

        this.isLoading = true;
        const step = Number(params.get('step')) || 1;
        const newOrder = orders[step - 1];
        this.code = newOrder?.codigo;
        this.order = newOrder;
        this.isCompleted[this.code] = false;
        this.scanningEnabled[this.code] = false;

        this.loadAssemblyProgress();
      });
    });
  }

  private loadAssemblyProgress() {
    this.orderService.getAssemblyProgress([this.code]).subscribe((progressList: AssemblyResponse[]) => {
      const progressData = progressList.find((p) => p.codigo === this.code);
      const progress = progressData?.progress || [];
      const isFinalizado = progressData?.status === 'finalizada';

      this.products =
        this.order?.itensVenda.map((item) => {
          const scanned = progress.find((p) => p.itensVendaId === item.itens_venda_id)?.scannedCount || 0;
          this.lastSavedProgress[item.itens_venda_id] = scanned;
          return {
            ...item,
            scannedCount: scanned,
          };
        }) || [];

      this.isCompleted[this.code] = isFinalizado;
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  startAssembly(order: Order) {
    this.scanningEnabled[order.codigo] = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      if (this.scannerInput?.nativeElement) {
        this.scannerInput.nativeElement.focus({ preventScroll: true });
      }
    }, 100);
  }

  onScan(raw: string) {
    if (!this.scanningEnabled[this.code]) return;
    const code = raw.trim();
    const prod = this.products.find((p) => p.produto.ean === code);

    // Salva a posição de scroll antes de atualizar
    const scrollPosition = this.cardBody?.nativeElement?.scrollTop || 0;

    this.scannerInput.nativeElement.value = '';

    if (!prod) {
      this.showError('Produto não está na lista!', 'Esse produto não está na lista do pedido. Atenção!');
      return;
    }

    if (prod.scannedCount + this.multiplicador > prod.quantidade) {
      this.showError('Quantidade excedida!', 'Quantidade máxima deste produto já bipada!');
      return;
    }

    prod.scannedCount = Math.min(prod.scannedCount + this.multiplicador, prod.quantidade);

    // Força detecção de mudanças sem causar scroll
    this.cdr.detectChanges();

    // Restaura a posição de scroll após a atualização do DOM
    // Usa múltiplos requestAnimationFrame para garantir que a renderização completa aconteceu
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (this.cardBody?.nativeElement) {
          this.cardBody.nativeElement.scrollTop = scrollPosition;
        }
        // Foca o input após restaurar o scroll
        setTimeout(() => {
          if (this.scannerInput?.nativeElement) {
            this.scannerInput.nativeElement.focus({ preventScroll: true });
          }
        }, 0);
      });
    });

    const allComplete = this.products.every((item) => item.scannedCount === item.quantidade);

    if (allComplete) {
      this.isCompleted[this.code] = true;
      this.scanningEnabled[this.code] = false;
      this.finishAssembly();
      return;
    }

    this.multiplicador = 1;
  }

  private showError(title: string, text: string) {
    setTimeout(() => {
      Swal.fire({ icon: 'error', title, text, confirmButtonText: 'OK' }).then(() => {
        this.focusScannerInput();
      });
    }, 0);
  }

  isFullyScanned(item: AssemblyItem): boolean {
    return item.scannedCount === item.quantidade;
  }

  trackByItemId(index: number, item: AssemblyItem): number {
    return item.itens_venda_id;
  }

  focusScannerInput() {
    if (this.scanningEnabled[this.code] && this.scannerInput?.nativeElement) {
      // Usa preventScroll para evitar que o focus cause scroll automático
      setTimeout(() => {
        this.scannerInput.nativeElement.focus({ preventScroll: true });
      }, 0);
    }
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
    if (this.isFullscreen) {
      setTimeout(() => this.focusScannerInput(), 0);
    }
  }

  saveProgress() {
    if (this.isSaving) return;

    const bipados = this.products
      .filter((item) => item.scannedCount !== (this.lastSavedProgress[item.itens_venda_id] || 0))
      .map((item) => ({
        itensVendaId: item.itens_venda_id,
        scannedCount: item.scannedCount,
      }));

    if (!bipados.length) return;

    this.isSaving = true; // começa bloqueio de nova chamada

    const dto: AssemblyDto = {
      montagemId: this.montagens[this.code]?.montagem_id,
      responsavel: this.userEmail,
      status: 'iniciada',
      itens: bipados,
    };

    this.orderService.updateAssemblyStatus(dto).subscribe({
      next: () => {
        bipados.forEach((item) => {
          this.lastSavedProgress[item.itensVendaId] = item.scannedCount;
        });
        this.isSaving = false;
      },
      error: () => {
        this.isSaving = false;
        Swal.fire('Erro', 'Não foi possível salvar o progresso.', 'error');
      },
    });
  }

  finishAssembly() {
    const bipados = this.products
      .filter((item) => item.scannedCount > 0)
      .map((item) => ({
        itensVendaId: item.itens_venda_id,
        scannedCount: item.scannedCount,
      }));

    if (!bipados.length) {
      this.isCompleted[this.code] = true;
      this.scanningEnabled[this.code] = false;
      return;
    }

    const dto: AssemblyDto = {
      montagemId: this.montagens[this.code]?.montagem_id,
      responsavel: this.userEmail,
      status: 'finalizada',
      itens: bipados,
    };

    this.orderService.updateAssemblyStatus(dto).subscribe({
      next: () => {
        this.isCompleted[this.code] = true;
        this.scanningEnabled[this.code] = false;
      },
      error: () => Swal.fire('Erro', 'Falha ao finalizar montagem!', 'error'),
    });
  }

  ngOnDestroy(): void {
    this.saveProgress();
  }
}
