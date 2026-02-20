import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Produto } from '../../commerce/models';
import { ProductService } from '../../commerce/services/product.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { ExpeditionService } from '../services/expedition.service';
import { Collaborate, StockOut } from '../models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-stock-out-modal',
  templateUrl: './stock-out-modal.component.html',
  styleUrl: './stock-out-modal.component.scss',
})
export class StockOutModalComponent {
  products: Produto[] = [];
  public userEmail: string = '';
  valorSaida: number;
  showCollaborateInput: boolean = false;
  collaborators: Collaborate[] = [];
  public showCollaboratorInput: boolean = false;
  colaborador_id?: number;
  colaborador_nome?: string;

  motivoSaida: string = '';
  observacao: string = '';
  searchTerm: string = '';
  filteredProducts: any[] = [];
  selectedProducts: any[] = [];
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private expeditionService: ExpeditionService,
    public activeModal: NgbActiveModal,
  ) {}

  ngOnInit() {
    this.productService.getAllProducts().subscribe((data) => {
      this.products = data.map((p) => ({
        ...p,
        selecionado: false, // Inicialmente nenhum produto está selecionado
        qtd_saida: 1, // Defina quantidade padrão
      }));
      this.filteredProducts = [...this.products]; // Inicialmente todos os produtos estão filtrados
    });
    this.loadCollaborators();
  }

  onSearchProduct() {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredProducts = this.products
      .filter(
        (product) =>
          product.nome.toLowerCase().includes(term) ||
          product.categoria.nome.toLowerCase().includes(term) ||
          product.codigo.toLowerCase().includes(term) ||
          product.ean.toLowerCase().includes(term),
      )
      .map((p) => ({
        ...p,
        selecionado: !!this.selectedProducts.find((sp) => sp.produto_id === p.produto_id),
        qtd_saida: this.selectedProducts.find((sp) => sp.produto_id === p.produto_id)?.qtd_saida || 1,
      }));
  }

  onToggleProduct(produto: any) {
    if (produto.selecionado) {
      if (!this.selectedProducts.find((p) => p.produto_id === produto.produto_id)) {
        this.selectedProducts.push({
          ...produto,
          qtd_saida: produto.qtd_saida || 1,
        });
      }
    } else {
      this.selectedProducts = this.selectedProducts.filter((p) => p.produto_id !== produto.produto_id);
    }
  }

  onQtdChange(produto: any) {
    const idx = this.selectedProducts.findIndex((p) => p.produto_id === produto.produto_id);
    if (idx !== -1) {
      this.selectedProducts[idx].qtd_saida = produto.qtd_saida;
    }
  }

  confirmarSaida() {
    const nomeColaboradorFinal =
      this.motivoSaida === 'Pedido Colaborador'
        ? this.colaborador_nome || this.collaborators.find((c) => c.colaborador_id === this.colaborador_id)?.nome || ''
        : '';

    const observacao =
      this.motivoSaida === 'Pedido Colaborador'
        ? `${this.motivoSaida} ${nomeColaboradorFinal} - ${this.observacao} - ${this.userEmail}`
        : `${this.motivoSaida} - ${this.observacao} - ${this.userEmail}`;

    const saida: StockOut = {
      observacao,
      tipo_saida: this.motivoSaida,
      produtos: this.selectedProducts.map((p) => ({
        produto_id: p.produto_id,
        quantidade: p.qtd_saida,
      })),
      colaborador_id: this.colaborador_id,
      colaborador_nome: this.colaborador_nome,
    };

    this.expeditionService.getStockOut(saida).subscribe({
      next: async (resp) => {
        await this.showAlert({
          icon: 'success',
          title: 'Sucesso!',
          text: resp.message,
          confirmButtonText: 'Ok',
        });
        this.activeModal.close('success');
        window.location.reload();
      },
      error: (error) => {
        this.showAlert({
          icon: 'error',
          title: 'Erro!',
          text: 'Não foi possível registrar a saída de estoque.',
          confirmButtonText: 'Ok',
        });
        console.error('Erro ao registrar saída de estoque:', error);
      },
    });
  }
  async showAlert(swalOptions: SweetAlertOptions): Promise<void> {
    this.swalOptions = swalOptions;
    this.cdr.detectChanges();
    await this.noticeSwal.fire();
  }

  close() {
    this.activeModal.dismiss();
  }

  isValidSaida(): boolean {
    return !!this.motivoSaida && !!this.observacao && this.selectedProducts.length > 0;
  }

  private loadCollaborators(): void {
    this.expeditionService.getAllCollaborators().subscribe((collaborators) => {
      this.collaborators = collaborators;
    });
  }

  toggleCollaborateInput(event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    if (value === 'novo') {
      this.showCollaboratorInput = true;
      this.colaborador_id = undefined;
    } else {
      this.showCollaboratorInput = false;
      this.colaborador_id = Number(value);
    }
  }

  get totalCollaboratorRequest(): number {
    if (this.motivoSaida !== 'Pedido Colaborador') return 0;

    return this.selectedProducts.reduce((total, produto) => {
      const preco = Number(produto.preco_venda || 0);
      const qtd = Number(produto.qtd_saida || 0);
      return total + preco * qtd;
    }, 0);
  }
}
