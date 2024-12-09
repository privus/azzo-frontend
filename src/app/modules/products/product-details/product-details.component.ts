import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CATEGORIAS } from 'src/app/shared/constants/user-constant';
import { Produto } from '../models/product.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  productForm: FormGroup;
  categorias = CATEGORIAS;
  product: Produto | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    // Obtém o primeiro produto da rota resolvida
    this.product = this.route.parent?.snapshot.data['product'][1];
    console.log('products-details ==========>>', this.product);

    if (this.product) {
      this.patchFormWithProduct(this.product);
    }
  }

  /**
   * Inicializa o formulário de produto com todos os campos desabilitados
   */
  private initializeForm(): void {
    this.productForm = this.fb.group({
      codigo: [{ value: '', disabled: true }],
      name: [{ value: '', disabled: true }],
      ativo: [{ value: '', disabled: true }],
      desconto_maximo: [{ value: '', disabled: true }],
      preco_venda: [{ value: '', disabled: true }],
      ncm: [{ value: '', disabled: true }],
      ean: [{ value: '', disabled: true }],
      preco_custo: [{ value: '', disabled: true }],
      average_weight: [{ value: '', disabled: true }],
      fotoUrl: [{ value: '', disabled: true }],
      categoria_id: [{ value: '', disabled: true }],
      fornecedor_id: [{ value: '', disabled: true }],
    });
  }

  /**
   * Atualiza o formulário com os dados do produto
   * @param product Produto a ser exibido no formulário
   */
  private patchFormWithProduct(product: Produto): void {
    this.productForm.patchValue({
      codigo: product.codigo,
      name: product.name,
      ativo: product.ativo,
      desconto_maximo: product.desconto_maximo,
      preco_venda: product.preco_venda,
      ncm: product.ncm,
      ean: product.ean,
      preco_custo: product.preco_custo,
      average_weight: product.average_weight,
      fotoUrl: product.fotoUrl,
      categoria_id: product.categoria?.categoria_id || null,
      fornecedor_id: product.fornecedor?.fornecedor_id || null,
    });
  }
}
