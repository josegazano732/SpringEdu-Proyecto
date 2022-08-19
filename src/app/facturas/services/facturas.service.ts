import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Factura } from '../models/factura';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  private urlEndPoint: string = 'http://localhost:8080/api/facturas';

  constructor(private http: HttpClient) { }

  getFactura(id:number):Observable<Factura>{
    //1ª Forma
    //return this.http.get<Factura>(this.urlEndPoint+'/'+id);
    //2ª Forma:
    return this.http.get<Factura>(`${this.urlEndPoint}/${id}`);
    

  }

 
}
