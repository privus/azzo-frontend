export interface Commissions {
  vendedor_id: number;
  vendedor: string;
  faturado: number;
  pedidos: number;
  comissao: number;
  ticketMedio: number;
  meta_ped?: number;
  meta_fat?: number;
  progresso_ped?: number;
  progresso_fat?: number;
  bonificado?: number;
}

export interface CommissionsReport {
  vendedor_id: number;
  vendedor_nome: string;
  total_valor_final: number;
  total_comisao: number;
  vendas: Array<{
    codigo: number;
    data_criacao: Date;
    valor_final: number;
    comisao: number;
  }>;
}
