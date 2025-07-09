export interface ProdutoSaida {
  produto_id: number;
  quantidade: number;
}

export interface StockOut {
  observacao: string;
  produtos: ProdutoSaida[];
}
