export interface ProdutoSaida {
  produto_id: number;
  quantidade: number;
}

export interface StockOut {
  observacao: string;
  produtos: ProdutoSaida[];
}

export interface StockById {
  saida_id: number;
  quantidade: number;
  data_saida: string;
  observacao: string;
}
