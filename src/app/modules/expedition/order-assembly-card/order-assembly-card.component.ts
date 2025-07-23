import { Component, Input, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Order, AssemblyItem } from '../../../modules/commerce/models';
import { LocalStorageService } from '../../../core/services';
import { OrderService } from '../../commerce/services/order.service';
import Swal from 'sweetalert2';
import { AssemblySessionService } from '../services/assembly-session.service';

@Component({
  selector: 'app-order-assembly-card',
  templateUrl: './order-assembly-card.component.html',
  styleUrls: ['./order-assembly-card.component.scss'],
})
export class OrderAssemblyCardComponent implements OnInit {
  @Input() order!: Order;
  products: AssemblyItem[] = [];
  isLoading = true;
  scanningEnabled = false;
  multiplicador = 1;
  userEmail: string = '';
  montagem: any;
  status: string = '';
  isCompleted = false;

  @ViewChild('scannerInput', { static: false })
  scannerInput!: ElementRef<HTMLInputElement>;

  constructor(
    private cdr: ChangeDetectorRef,
    private localStorage: LocalStorageService,
    private orderService: OrderService,
    private assemblySession: AssemblySessionService,
  ) {}

  ngOnInit() {
    // inicializa scannedCount em 0
    this.products = this.order.itensVenda.map((item) => ({
      ...item,
      scannedCount: 0,
    }));
    const storageInfo = this.localStorage.get('STORAGE_MY_INFO');
    this.userEmail = storageInfo ? JSON.parse(storageInfo).email : '';
    this.assemblySession.getActiveOrder$().subscribe((activeCode) => {
      // Pausa este card se outro ficou ativo
      if (activeCode !== this.order.codigo) {
        this.scanningEnabled = false;
      }
    });
  }

  /** libera o scanner invisível */
  startAssembly() {
    // Ativa este card e pausa os outros (pelo serviço)
    this.assemblySession.setActiveOrder(this.order.codigo);
    this.scanningEnabled = true;
    this.cdr.detectChanges();
    setTimeout(() => this.scannerInput?.nativeElement?.focus(), 0);
  }

  startMontagem() {
    this.orderService.startAssembly(this.userEmail, this.order.itensVenda).subscribe((m) => {
      this.montagem = m;
      this.status = m.status;
    });
  }

  onScan(raw: string) {
    if (!this.scanningEnabled) return;
    const code = raw.trim();
    const prod = this.products.find((p) => p.produto.ean === code);

    this.scannerInput.nativeElement.blur();
    this.scannerInput.nativeElement.value = ''; // LIMPA O VALOR DO INPUT AQUI

    if (prod) {
      // Verifica se já bipou tudo ou ultrapassaria o limite
      if (prod.scannedCount + this.multiplicador > prod.quantidade) {
        setTimeout(() => {
          Swal.fire({
            icon: 'error',
            title: 'Quantidade excedida!',
            text: 'Quantidade máxima deste produto já bipada!',
            confirmButtonText: 'OK',
          }).then(() => {
            this.focusScannerInput();
          });
        }, 0);
        return;
      }
    } else {
      setTimeout(() => {
        Swal.fire({
          icon: 'error',
          title: 'Produto não está na lista!',
          text: 'Esse produto não está na lista do pedido. Atenção!',
          confirmButtonText: 'OK',
        }).then(() => {
          this.focusScannerInput();
        });
      }, 0);
      return;
    }

    prod.scannedCount = Math.min(prod.scannedCount + this.multiplicador, prod.quantidade);

    const allComplete = this.products.every((item) => item.scannedCount === item.quantidade);
    if (allComplete) {
      this.isCompleted = true;
      this.scanningEnabled = false;
      this.orderService.finishAssembly(this.montagem.id);
      return;
    }

    this.multiplicador = 1;
    this.focusScannerInput();
  }

  isFullyScanned(item: AssemblyItem): boolean {
    return item.scannedCount === item.quantidade;
  }

  /** força o foco no input invisível do scanner */
  focusScannerInput() {
    if (this.scanningEnabled) {
      setTimeout(() => {
        if (this.scannerInput && this.scannerInput.nativeElement) {
          this.scannerInput.nativeElement.focus();
        }
      }, 100);
    }
  }
}
