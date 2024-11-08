import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  set(key: string, value: unknown): boolean {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  }

  get(key: string): string | null {
    return localStorage.getItem(key);
  }

  remove(key: string): boolean {
    localStorage.removeItem(key);
    return true;
  }

  clear(): boolean {
    localStorage.clear();
    return true;
  }

  getRole(): string | null {
    const user = this.get('STORAGE_MY_INFO');
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.cargo?.nome || null;
    }
    return null;
  }
}