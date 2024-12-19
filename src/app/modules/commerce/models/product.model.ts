export interface Produto {
  produto_id: number;
  codigo: string;
  nome: string;
  ativo: number;
  desconto_maximo: number;
  preco_venda: number;
  ncm: string;
  ean: string;
  preco_custo: number;
  peso_grs?: number;
  fotoUrl?: string;
  categoria: CategoriaProduto;
  fornecedor?: Fornecedor;
  data_criacao?: string;
  data_atualizacao?: string;
  descricao_uni: string;
}

export interface CategoriaProduto {
  categoria_id: number;
  nome: string;
}

export interface Fornecedor {
  fornecedor_id: number;
  nome: string;
}
