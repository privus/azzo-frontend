export interface StockResponse {
  numero_nf: string;
  data_emissao: string;
  emitente: string;
  qtd_itens: number;
  produtos_nao_encontrados: string;
  produtos: Produto[];
}

export interface Produto {
  codigo: string;
  nome: string;
  qt_caixa: number;
  quantidade: number;
  valor_total: number;
}

export interface StockDuration {
  produto_id: string;
  mediaDiaria: number;
  diasRestantes: number;
}
