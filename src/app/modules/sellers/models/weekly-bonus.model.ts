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

export interface WeeklyBonusDetails {
  [vendedor: string]: {
    valor_total: number;
    pedidos: number;
    clientes_novos: number;

    pedidos_30: number[];
    pedidos_50: number[];

    valor_invalido: number[];
    intervalo_invalido: number[];
  };
}
