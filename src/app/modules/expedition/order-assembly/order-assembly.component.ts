import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Order, AssemblyItem } from '../../commerce/models';
import { OrderService } from '../../commerce/services/order.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-assembly',
  templateUrl: './order-assembly.component.html',
  styleUrls: ['./order-assembly.component.scss'],
})
export class OrderAssemblyComponent implements OnInit, AfterViewInit {
  code!: number;
  order!: Order;
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
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private orderService: OrderService,
    private localStorage: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.route.parent!.data.subscribe((data) => {
      const orders = data.orders as Order[];
      this.route.paramMap.subscribe((params: ParamMap) => {
        const step = Number(params.get('step')) || 1;
        this.order = orders[step - 1];
        this.code = this.order.codigo;
        this.products = this.order.itensVenda.map((item) => ({
          ...item,
          scannedCount: 0,
        }));
        this.isLoading = false;
        this.isCompleted = false;
        this.cdr.detectChanges();
      });
    });
    const storageInfo = this.localStorage.get('STORAGE_MY_INFO');
    this.userEmail = storageInfo ? JSON.parse(storageInfo).email : '';
  }

  startMontagem() {
    this.orderService.startAssembly(this.userEmail, this.order.itensVenda).subscribe((m) => {
      this.montagem = m;
      this.status = m.status;
    });
  }

  ngAfterViewInit() {}

  startAssembly() {
    this.scanningEnabled = true;
    this.cdr.detectChanges();
    setTimeout(() => this.scannerInput.nativeElement.focus(), 0);
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
      // timeout para garantir que o elemento já esteja no DOM
      setTimeout(() => this.scannerInput.nativeElement.focus(), 0);
    }
  }
}
