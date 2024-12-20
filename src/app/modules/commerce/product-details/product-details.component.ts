import { Component, OnInit } from '@angular/core';
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
  product: Produto | null = null;
  productId: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    this.productService.getProductById(this.productId).subscribe((product) => {
      this.product = product;
      console.log(this.product);
      this.patchFormWithProduct(product);
    });
  }

  /**
   * Inicializa o formulário de produto com todos os campos desabilitados
   */
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
      fotoUrl: [{ value: '', disabled: true }],
      categoria_nome: [{ value: '', disabled: true }],
      fornecedor_id: [{ value: '', disabled: true }],
      descricao_uni: [{ value: '', disabled: true }],
    });
  }

  /**
   * Atualiza o formulário com os dados do produto
   * @param product Produto a ser exibido no formulário
   */
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
      fotoUrl: product.fotoUrl,
      categoria_nome: product.categoria?.nome || null,
      fornecedor_id: product.fornecedor?.fornecedor_id || null,
      descricao_uni: product.descricao_uni
    });
  }
}
