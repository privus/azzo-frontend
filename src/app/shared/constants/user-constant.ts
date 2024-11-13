import { Permissao, Regiao } from "../../modules/account/models/user.model";

export const REGIOES: Regiao[] = [
    { regiao_id: 1, nome: 'Norte' },
    { regiao_id: 2, nome: 'Nordeste' },
    { regiao_id: 3, nome: 'Centro-Oeste' },
    { regiao_id: 4, nome: 'Sudeste' },
    { regiao_id: 5, nome: 'Sul' },
  ];
  export const PERMISOES: Permissao[] = [
    { permissao: 1, nome: 'Administrador' },
    { permissao: 2, nome: 'Gerenciamento de usuários' },
    { permissao: 4, nome: 'Gerenciamento Financeiro' },
    { permissao: 8, nome: 'Gerenciamento Estoque' },
  ];