export interface WeeklyBonus {
  [nome: string]: {
    valor_total: number;
    pedidos: number;
    clientes_novos: number;
  };
}
