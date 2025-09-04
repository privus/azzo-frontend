export interface SellerBonus {
  name: string;
  valor_total: number;
  pedidos: number;
  clientes_novos: number;
  observacao?: string;
}

export interface WeeklyBonus {
  [nome: string]: SellerBonus;
}
