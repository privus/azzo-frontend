import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cidade } from '../../modules/account/models/user.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class SharedService {
  private baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getAllCities() {
    return this.http.get<Cidade[]>(`${this.baseUrl}shared/cities`);
  }

  getCitiesPartial(query: string) {
    return this.http.get<Cidade[]>(`${this.baseUrl}shared/cities/partial`, {
      params: { q: query },
    });
  }
}
