export interface Estado {
  estadoId: number;
  nome: string;
  sigla: string;
}

export interface Cidade {
  cidadeId: number;
  nome: string;
  estado: Estado;
}

export interface Cargo {
  cargoId: number;
  nome: string;
}

export interface Regiao {
  regiaoId: number;
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