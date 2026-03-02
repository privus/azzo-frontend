export interface Goals {
  vendedor_id: number;
  vendedor: string;
  meta_ped: number;
  meta_fat: number;
  ped_realizados: number;
  fat_realizado: number;
  progress_ped: number;
  progress_fat: number;
}

export interface AssemblyGoal {
  meta_id: number;
  meta_diaria: number;
  meta_realizada: number;
  valor_acumulado: number;
  valor_condicional: number;
}
