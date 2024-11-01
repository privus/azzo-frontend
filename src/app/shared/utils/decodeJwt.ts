export function decodeJwt(token: string | null): any {
    // 1. Erro de Tipo do Token
    if (!token || typeof token !== 'string') {
      console.error('Erro: Token JWT inválido ou inexistente.');
      return null;
    }
    
    try {
      // 2. Erro Durante a Decodificação
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erro ao decodificar o token JWT:', error);
      return null;
    }
  }
  