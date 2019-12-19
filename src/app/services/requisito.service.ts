import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ResponseInterface} from '../interfaces/response.interface';

@Injectable()
export class RequisitoService {

    urlBase = '/requisitos/';
    headers = new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
    urlApi = 'https://ecosistema-backend.herokuapp.com';
    constructor(private httpClient: HttpClient) {
    }

    public saveRequisito(requisito) {
        return this.httpClient.post<ResponseInterface>(this.urlApi + this.urlBase,
            JSON.stringify(requisito), {headers: this.headers});
    }

    public getRequisitoById(id) {
        return this.httpClient.get<ResponseInterface>(this.urlApi + this.urlBase + id, {headers: this.headers});
    }
}
