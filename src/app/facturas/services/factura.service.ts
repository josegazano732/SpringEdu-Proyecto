import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Factura } from '../models/factura';
import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

import { URL_BACKEND } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private urlEndPoint: string = URL_BACKEND +'/api/facturas';

  constructor(private http: HttpClient) { }

  getFactura(id:number):Observable<Factura>{
    //1ª Forma
    //return this.http.get<Factura>(this.urlEndPoint+'/'+id);
    //2ª Forma:
    return this.http.get<Factura>(`${this.urlEndPoint}/${id}`);
  }

  delete(id:number):Observable<void>{
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`);
  }

  filtrarProductos(term:string):Observable<Producto[]>{
    return this.http.get<Producto[]>(`${this.urlEndPoint}/filtrar-productos/${term}`);
  }

  create(factura:Factura):Observable<Factura>{
    return this.http.post<Factura>(this.urlEndPoint, factura);
  }

 
}
