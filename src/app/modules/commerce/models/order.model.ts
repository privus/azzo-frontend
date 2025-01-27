import { Cliente, Produto } from './';

export interface Pedido {
  venda_id: number;
  codigo: number;
  data_criacao: string;
  observacao: string;
  numero_parcelas: number;
  valor_parcela: string;
  metodo_pagamento: string;
  forma_pagamento: string;
  datas_vencimento: string[][];
  valor_pedido: string;
  valor_final: string;
  flex_gerado: string;
  desconto: string;
  cliente: Cliente;
  vendedor: Vendedor;
  itensVenda: ItensVenda[];
  status_pagamento: StatusPagamento;
  status_venda: StatusVenda;
  parcela_credito: ParcelaCredito[];
  tipo_pedido: TipoPedido;
}

export interface Vendedor {
  vendedor_id: number;
  codigo: string;
  nome: string;
  ativo: number;
  data_criacao: string;
}

export interface ItensVenda {
  itens_venda_id: number;
  quantidade: number;
  valor_unitario: string;
  valor_total: string;
  produto: Produto;
}

export interface StatusPagamento {
  status_pagamento_id: number;
  nome: string;
}

export interface StatusVenda {
  status_venda_id: number;
  nome: string;
}

export interface ParcelaCredito {
  parcela_id: number;
  numero: number;
  valor: string;
  juros: string | null;
  data_criacao: string;
  data_vencimento: string;
  data_pagamento: string | null;
  status_pagamento: StatusPagamento;
}
export interface TipoPedido {
  tipo_pedido_id: number;
  nome: string;
}
