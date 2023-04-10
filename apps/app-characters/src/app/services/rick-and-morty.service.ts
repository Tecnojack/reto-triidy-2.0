import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Characters } from '../pages/interfaces/responseR&M';

@Injectable()
export class CharacterService {

  constructor(private http: HttpClient) { }

  getCharacters(page: number) {
    return this.http.get<Characters>(`https://rickandmortyapi.com/api/character/?page=${page}`);
  }
}
