export interface SalesComparisonReport {
  totalPeriodo1: number;
  totalPeriodo2: number;
  variacaoPercentual: number;
  direcao: 'aumento' | 'queda' | 'neutro';
  faturamentoMesAtual: number;
  faturamentoPorMarcaMesAtual: {
    [marca: string]: number;
  };
}

export type Direcao = 'aumento' | 'queda' | 'neutro';
