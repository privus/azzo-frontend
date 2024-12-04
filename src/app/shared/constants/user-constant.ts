import { Permissao, Regiao } from '../../modules/account/models/user.model';

export const REGIOES: Regiao[] = [
  { regiao_id: 1, nome: 'Norte' },
  { regiao_id: 2, nome: 'Nordeste' },
  { regiao_id: 3, nome: 'Centro-Oeste' },
  { regiao_id: 4, nome: 'Sudeste' },
  { regiao_id: 5, nome: 'Sul' },
];
export const PERMISOES: Permissao[] = [
  { permissao: 8, nome: 'Administrador' }, // 2^3
  { permissao: 1, nome: 'Gerenciamento de Usuários' }, // 2^0
  { permissao: 2, nome: 'Gerenciamento Financeiro' }, // 2^1
  { permissao: 4, nome: 'Gerenciamento Estoque' }, // 2^2
];
