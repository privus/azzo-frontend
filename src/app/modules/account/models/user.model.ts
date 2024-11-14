export interface Estado {
  estadoId: number;
  nome: string;
  sigla: string;
}

export interface Cidade {
  cidade_id: number;
  nome: string;
  estado: Estado;
}

export interface Cargo {
  cargo_id: number;
  nome: string;
  somaPermissao: number;
}

export interface Regiao {
  regiao_id: number;
  nome: string;
}

export interface Permissao {
  permissao: number;
  nome: string;
}

export interface Usuario {
  usuario_id: number;
  nome: string;
  email: string;
  celular: string;
  endereco: string;
  nascimento: string;
  username: string;
  cargo: Cargo;
  cidade: Cidade;
  regiao: Regiao | null;
}

export interface NewUser {
  nome: string;
  email: string;
  celular: string;
  endereco: string;
  nascimento: string;
  username: string;
  senha: string;
  cargo_id: number;
  cidade_id: number;
  regiao_id?: number | null;
}

export interface UserUpdate {
  usuario_id?: number;
  nome?: string;
  username?: string;
  email?: string;
  celular?: string;
  endereco?: string;
  nascimento?: string;
  cargo_id?: number;
  cidade_id?: number;
  regiao_id?: number | null;
}

export interface UserList {
  usuario_id: number;
  nome: string;
  email: string;
  celular: string;
  endereco: string;
  nascimento: string;
  username: string;
  senha: string;
  cargo_id: number;
  cidade_id: number;
  regiao_id?: number | null;
}
