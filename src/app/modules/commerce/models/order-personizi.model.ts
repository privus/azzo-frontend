import { PCliente } from './costumer.model';
import { PCredit } from '../../financial/models';
import { StatusPagamento, Vendedor } from './order.model';

export interface POrder {
  venda_id: number;
  data_criacao: Date | string;
  data_atualizacao?: Date | string;
  observacao?: string;
  numero_parcelas?: number;
  valor_parcela?: number;
  datas_vencimento?: string[];
  valor_pedido?: number;
  valor_final: number;
  valor_frete?: number;
  desconto?: number;
  exportado?: number;
  chave_acesso?: string;
  nfe_link: string;
  nfe_emitida?: number;
  numero_nfe?: number;
  numero_tiny?: number;
  nfe_id?: number;
  data_emissao_nfe?: Date | string;
  fonte_lead?: string;
  ecommerce: PEcommerce;
  cliente: PCliente;
  forma_pagamento: PFormaPagamento;
  itensVenda: PItensVenda[];
  parcela_credito?: PCredit[];
  status_venda: PStatusVenda;
  status_pagamento: StatusPagamento;
  vendedor: Vendedor;
}

export interface PEcommerce {
  ecommerce_id: number;
  nome: string;
}

export interface PFormaPagamento {
  forma_pagamento_id: number;
  nome: string;
}

export interface PItensVenda {
  itens_venda_id: number;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  lucro_bruto: number;
  observacao?: string;
  venda: POrder;
  produto: PProduto;
}

export interface PProduto {
  produto_id: number;
  nome: string;
  codigo: string;
  preco: number;
}

export interface PStatusVenda {
  status_venda_id: number;
  nome: string;
}
