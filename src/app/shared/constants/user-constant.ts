import { Cargo, Regiao } from "../../modules/account/models/user.model";

export const CARGOS: Cargo[] = [
    { cargo_id: 1, nome: 'Desenvolvedor' },
    { cargo_id: 2, nome: 'Vendedor' },
    { cargo_id: 3, nome: 'Designer' },
    { cargo_id: 4, nome: 'Gerente' },
    { cargo_id: 5, nome: 'Analista' },
    { cargo_id: 6, nome: 'Estagiário' },
    { cargo_id: 7, nome: 'Auxiliar' },
  ];
export const REGIOES: Regiao[] = [
    { regiao_id: 1, nome: 'Norte' },
    { regiao_id: 2, nome: 'Nordeste' },
    { regiao_id: 3, nome: 'Centro-Oeste' },
    { regiao_id: 4, nome: 'Sudeste' },
    { regiao_id: 5, nome: 'Sul' },
  ];