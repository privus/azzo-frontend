import { StockById } from '../../expedition/models';

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
  tiny_mg?: number;
  tiny_sp?: number;
  saldo_estoque: number;
  estoque_liquido?: number;
  qt_uni?: number;
  unidade: Produto;
  estoque_minimo: number; // em dias
  altura?: number;
  largura?: number;
  comprimento?: number;
  peso?: number;
  saidas?: StockById[];

  // campos calculados pelo StockComponent:
  estoque_em_caixas?: string;
  diasRestantes?: number | null;
  mediaDiaria?: number | null;
  statusPorDias?: 'disponivel' | 'baixo' | 'sem' | 'excesso';
}

export interface CategoriaProduto {
  categoria_id: number;
  nome: string;
}

export interface Fornecedor {
  fornecedor_id: number;
  nome: string;
}

export interface UpdatedProduct {
  tiny_mg?: number;
  tiny_sp?: number;
  altura?: number;
  largura?: number;
  comprimento?: number;
  peso_grs?: number;
}
