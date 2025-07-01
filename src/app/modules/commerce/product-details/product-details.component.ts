import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CATEGORIAS } from 'src/app/shared/constants/user-constant';
import { Produto, UpdatedProduct } from '../models';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Location } from '@angular/common';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  productForm: FormGroup;
  categorias = CATEGORIAS;
  productId: number;
  isLoading = true; // Adicione esta variável
  product: Produto;

  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        this.product = product;
        this.patchFormWithProduct(product);
        this.isLoading = false; // Dados carregados
        this.cdr.detectChanges(); // Atualiza o componente
      },
      error: (err) => {
        console.error('Erro ao carregar produto:', err);
        this.isLoading = false; // Finaliza o carregamento mesmo em caso de erro
      },
    });
  }

  private initializeForm(): void {
    this.productForm = this.fb.group({
      codigo: [{ value: '', disabled: true }],
      nome: [{ value: '', disabled: true }],
      ativo: [{ value: '', disabled: true }],
      desconto_maximo: [{ value: '', disabled: true }],
      preco_venda: [{ value: '', disabled: true }],
      ncm: [{ value: '', disabled: true }],
      ean: [{ value: '', disabled: true }],
      preco_custo: [{ value: '', disabled: true }],
      average_weight: [{ value: '', disabled: true }],
      categoria_nome: [{ value: '', disabled: true }],
      marca: [{ value: '', disabled: true }],
      descricao_uni: [{ value: '', disabled: true }],
      fotoUrl: [{ value: '', disabled: true }],
      tiny_mg: [{ value: '', disabled: true }, Validators.pattern(/(^$|^\d{9}$)/)],
      tiny_sp: [{ value: '', disabled: true }, Validators.pattern(/(^$|^\d{9}$)/)],
      saldo_estoque: [{ value: '', disabled: true }],
      altura: [{ value: '' }, [Validators.min(0), Validators.max(999)]],
      largura: [{ value: '' }, [Validators.min(0), Validators.max(999)]],
      comprimento: [{ value: '' }, [Validators.min(0), Validators.max(999)]],
      peso: [{ value: '' }, [Validators.min(0), Validators.max(999_999)]],
    });
  }

  private patchFormWithProduct(product: Produto): void {
    this.productForm.patchValue({
      codigo: product.codigo,
      nome: product.nome,
      ativo: product.ativo,
      desconto_maximo: product.desconto_maximo,
      preco_venda: product.preco_venda,
      ncm: product.ncm,
      ean: product.ean,
      preco_custo: product.preco_custo,
      peso_grs: product.peso_grs,
      categoria_nome: product.categoria.nome,
      marca: product.fornecedor?.nome,
      descricao_uni: product.descricao_uni,
      fotoUrl: product.fotoUrl,
      tiny_mg: product.tiny_mg,
      tiny_sp: product.tiny_sp,
      saldo_estoque: product.saldo_estoque,
      altura: product.altura,
      largura: product.largura,
      comprimento: product.comprimento,
      peso: product.peso_grs,
    });

    if (product.tiny_mg) this.productForm.controls['tiny_mg'].disable();
    if (product.tiny_sp) this.productForm.controls['tiny_sp'].disable();
    if (product.altura) this.productForm.controls['altura'].disable();
    if (product.largura) this.productForm.controls['largura'].disable();
    if (product.comprimento) this.productForm.controls['comprimento'].disable();
    if (product.peso_grs) this.productForm.controls['peso'].disable();
  }

  goBack(): void {
    this.location.back();
  }

  updateProduct(): void {
    const fields = this.productForm.value;
    const updatedFields: UpdatedProduct = {
      tiny_mg: fields.tiny_mg,
      tiny_sp: fields.tiny_sp,
      altura: fields.altura,
      largura: fields.largura,
      comprimento: fields.comprimento,
      peso_grs: fields.peso,
    };

    this.productService.updateProduct(this.productId, updatedFields).subscribe({
      next: (): void => {
        this.showAlert(
          {
            icon: 'success',
            title: 'Sucesso!',
            text: 'Produto atualizado com sucesso!',
            confirmButtonText: 'Ok',
          },
          () => {
            // Recarrega a página após o usuário fechar o alerta
            window.location.reload();
          },
        );
      },
      error: (err: any): void => {
        console.error('Erro ao atualizar códigos Tiny:', err);
      },
    });
  }

  showAlert(swalOptions: SweetAlertOptions, callback?: () => void) {
    this.swalOptions = swalOptions;
    this.cdr.detectChanges();
    this.noticeSwal.fire().then(() => {
      if (callback) {
        callback();
      }
    });
  }
}
