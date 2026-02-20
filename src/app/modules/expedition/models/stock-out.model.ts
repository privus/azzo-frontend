export interface ProdutoSaida {
  produto_id: number;
  quantidade: number;
}

export class StockOut {
  observacao: string;
  produtos: ProdutoSaida[];
  colaborador_id?: number;
  colaborador_nome?: string;
  tipo_saida?: string;
}

export interface StockById {
  saida_id: number;
  quantidade: number;
  data_saida: string;
  observacao: string;
}

export interface Collaborate {
  colaborador_id: number;
  nome: string;
}
