import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ResponseInterface} from '../interfaces/response.interface';
import {environment} from '../../environments/environment';

@Injectable()
export class StartupService {

  urlBase = '/startup/';
  headers = new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
  urlApi = 'https://ecosistema-backend.herokuapp.com';
  constructor(private httpClient: HttpClient) { }

  public saveStartup(startup) {
    return this.httpClient.post<ResponseInterface>(this.urlApi + this.urlBase, JSON.stringify(startup), {headers: this.headers});
  }
  public getStartupByNom(nom) {
    return this.httpClient.get<ResponseInterface>(this.urlApi + this.urlBase + 'nombre/' + nom, {headers: this.headers});
  }
  public getStartupById(id) {
    return this.httpClient.get<ResponseInterface>(this.urlApi + this.urlBase + id, {headers: this.headers});
  }
  public getStartups() {
    return this.httpClient.get<ResponseInterface>(this.urlApi + this.urlBase + 'todos', {headers: this.headers});
  }
  public deleteStartup(nombre) {
    return this.httpClient.delete<ResponseInterface>(this.urlApi + this.urlBase + 'delete/' + nombre, {headers: this.headers});
  }

}
