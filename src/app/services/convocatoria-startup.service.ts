import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ResponseInterface} from '../interfaces/response.interface';

@Injectable()
export class ConvocatoriaStartupService {

  urlBase = '/convocatoria_startup/';
  headers = new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
  urlApi = 'https://ecosistema-backend.herokuapp.com';
  constructor(private httpClient: HttpClient) {}

    public saveConvocatoria_startup(convocatoria_startup) {
        return this.httpClient.post<ResponseInterface>(this.urlApi + this.urlBase, JSON.stringify(convocatoria_startup),
            {headers: this.headers});
    }
    public getConvocatoria_startupByStartupConvocatoria(idStartup, idConvocatoria) {
        return this.httpClient.get<ResponseInterface>(this.urlApi + this.urlBase + 'ambos/' + 
        idStartup + '/' + idConvocatoria, {headers: this.headers});
    }
    public getConvocatoria_startupByStartup(id) {
        return this.httpClient.get<ResponseInterface>(this.urlApi + this.urlBase + 'startup/' + id, {headers: this.headers});
    }
    public getConvocatoria_startupByConvocatoria(id) {
        return this.httpClient.get<ResponseInterface>(this.urlApi + this.urlBase + 'convocatoria/' + id, {headers: this.headers});
    }
    public deleteByConvocatoria(id) {
        return this.httpClient.delete<ResponseInterface>(this.urlApi + this.urlBase + 
            'delete/' + 'convocatoria/' + id, {headers: this.headers});
    }

}
