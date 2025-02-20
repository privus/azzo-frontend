import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CATEGORIAS } from 'src/app/shared/constants/user-constant';
import { Produto } from '../models/product.model';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';

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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
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
      tiny_mg: [{ value: '' }],
      tiny_sp: [{ value: '' }],
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
    });

    if (product.tiny_mg) this.productForm.controls['tiny_mg'].disable();
    if (product.tiny_sp) this.productForm.controls['tiny_sp'].disable();
  }
}
