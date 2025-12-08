export interface ProductRankingItem {
  produto_id: number;
  codigo: string;
  nome: string;
  quantidade_vendida: number;
  valor_total_vendido: number;
  fornecedor: string;
  fotoUrl: string | null;
  variacao_percentual: number;
  direcao: 'aumento' | 'queda' | 'neutro';
}

