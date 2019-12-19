import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {ResponseInterface} from '../interfaces/response.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class ConvocatoriaService {

  urlBase = '/convocatoria/';
  headers = new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
  urlApi = 'https://ecosistema-backend.herokuapp.com';
  constructor(private httpClient: HttpClient) { }

  public saveConvocatoria(convocatoria) {
    return this.httpClient.post<ResponseInterface>(this.urlApi + this.urlBase, JSON.stringify(convocatoria),
        {headers: this.headers});
  }
  public deleteConvocatoria(nombre) {
    return this.httpClient.delete<ResponseInterface>(this.urlApi + this.urlBase + 'delete/' + nombre, {headers: this.headers});
  }
  public getConvocatoriaByNom(nom) {
    return this.httpClient.get<ResponseInterface>(this.urlApi + this.urlBase + 'nombre/' + nom, {headers: this.headers});
  }
  public getConvocatoriaByEntidad(id) {
    return this.httpClient.get<ResponseInterface>(this.urlApi + this.urlBase + 'entidad/' + id, {headers: this.headers});
  }
  public getConvocatorias() {
    return this.httpClient.get<ResponseInterface>(this.urlApi + this.urlBase + 'todos', {headers: this.headers});
  }

}
