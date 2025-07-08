export interface ComparisonReport {
  azzoPagouParaPersonizi: number;
  personiziPagouParaAzzo: number;
  totalPagoPorAzzoGrupo: number;
  totalPagoPorPersoniziGrupo: number;
  compensacao: {
    deve: 'Personizi' | 'Azzo' | null;
    valor: number;
    situacao: string;
  };
}
