export interface AuthLogin {
  email: string;
  senha: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface AuthUser {
  userId: number;
  email: string;
  cargo: {
    cargo_id: number;
    nome: string;
  };
  iat: number;
  exp: number;
}

export interface Cargo {
  cargo_id: number; 
  nome: string;        
}
export interface AuthDecodedToken {
  userId: number;     
  email: string;      
  cargo: Cargo;        
  iat: number;        
  exp: number;  
}