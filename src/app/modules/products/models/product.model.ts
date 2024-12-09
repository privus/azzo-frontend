export interface Produto {
  id: number;
  codigo: number;
  name: string;
  ativo: number;
  desconto_maximo: number;
  preco_venda: number;
  ncm: number;
  ean: number;
  preco_custo: number;
  average_weight?: number;
  fotoUrl?: string;
  categoria: CategoriaProduto;
  fornecedor?: Fornecedor;
}

export interface CategoriaProduto {
  categoria_id: number;
  nome: string;
}

export interface Fornecedor {
  fornecedor_id: number;
  nome: string;
}
