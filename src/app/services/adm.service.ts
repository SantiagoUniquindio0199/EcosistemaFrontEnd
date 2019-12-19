import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ResponseInterface} from '../interfaces/response.interface';
import {environment} from '../../environments/environment';

@Injectable()
export class AdmService {

  urlBase = '/adm/';
  headers = new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
  urlApi = 'https://ecosistema-backend.herokuapp.com';
  constructor(private httpClient: HttpClient) {}

    public saveAdm(adm) {
        return this.httpClient.post<ResponseInterface>(this.urlApi + this.urlBase, JSON.stringify(adm), {headers: this.headers});
    }
    public getAdmByCorreo(correo) {
        return this.httpClient.get<ResponseInterface>(this.urlApi + this.urlBase + 'correo/' + correo, {headers: this.headers});
    }
    public deleteAdm(correo) {
        return this.httpClient.delete<ResponseInterface>(this.urlApi + this.urlBase + 'delete/' + correo, {headers: this.headers});
    }
  public admManual(correo, contrasena) {
        return this.httpClient.post<ResponseInterface>(this.urlApi + this.urlBase + 'manual/' + correo +'/' + contrasena,{headers: this.headers});
    }
}
