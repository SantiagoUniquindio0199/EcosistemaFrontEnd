import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ResponseInterface} from '../interfaces/response.interface';

@Injectable()
export class EntidadService {

    urlBase = '/entidad/';
    urlApi = 'https://ecosistema-backend.herokuapp.com';
    headers = new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});

    constructor(private httpClient: HttpClient) { }

    public saveEntidad(entidad) {
        return this.httpClient.post<ResponseInterface>(this.urlApi + this.urlBase, JSON.stringify(entidad), {headers: this.headers});
    }
    public getEntidadByNom(nom) {
        return this.httpClient.get<ResponseInterface>(this.urlApi + this.urlBase + 'nombre/' + nom, {headers: this.headers});
    }
    public getEntidadById(id) {
        return this.httpClient.get<ResponseInterface>(this.urlApi + this.urlBase + id, {headers: this.headers});
    }
    public getEntidades() {
        return this.httpClient.get<ResponseInterface>(this.urlApi + this.urlBase + 'todos', {headers: this.headers});
    }
    public deleteEntidad(nombre) {
        return this.httpClient.delete<ResponseInterface>(this.urlApi + this.urlBase + 'delete/' + nombre, {headers: this.headers});
    }

}
