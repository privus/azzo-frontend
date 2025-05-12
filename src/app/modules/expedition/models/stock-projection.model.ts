export interface StockProjection {
  codigo: string;
  nome: string;
  quantidade: number;
  sku: number;
  pedidos: number[];
  descricao_uni: string;
}
