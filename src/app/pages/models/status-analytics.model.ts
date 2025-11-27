export interface StatusAnalyticsHistory {
  id: number;
  nome: string;
  quantidade: number;
}

export interface StatusAnalyticsByRegion {
  regiaoId: number;
  historico: StatusAnalyticsHistory[];
}
