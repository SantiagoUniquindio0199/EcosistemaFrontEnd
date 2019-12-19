import { Injectable } from '@angular/core';
import {ResponseInterface} from '../interfaces/response.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class ProductoService {

    urlBase = '/producto/';
    headers = new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
    urlApi = 'https://ecosistema-backend.herokuapp.com';
    constructor(private httpClient: HttpClient) {}

    public saveProducto(producto) {
      return this.httpClient.post<ResponseInterface>(this.urlApi + this.urlBase, JSON.stringify(producto), {headers: this.headers});
    }
    public deleteProducto(nombre) {
        return this.httpClient.delete<ResponseInterface>(this.urlApi + this.urlBase + 'delete/' + nombre, {headers: this.headers});
    }
    public getProductoByNom(nom) {
        return this.httpClient.get<ResponseInterface>(this.urlApi + this.urlBase + 'nombre/' + nom, {headers: this.headers});
    }
    public getProductoByStartup(id) {
        return this.httpClient.get<ResponseInterface>(this.urlApi + this.urlBase + 'startup/' + id, {headers: this.headers});
    }
    public getProductos() {
        return this.httpClient.get<ResponseInterface>(this.urlApi + this.urlBase + 'todos', {headers: this.headers});
    }
    public deleteProductos(productos) {
        return this.httpClient.delete<ResponseInterface>(this.urlApi + this.urlBase + 'delete/todos/' + productos, {headers: this.headers});
    }
    public getProductoById(id) {
        return this.httpClient.get<ResponseInterface>( this.urlApi + this.urlBase + id, {headers: this.headers});
    }

}
