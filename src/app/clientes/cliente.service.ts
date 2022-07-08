import { Injectable } from '@angular/core';
import { DatePipe, formatDate } from '@angular/common';

import { Cliente } from './cliente';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint:string='http://localhost:8080/api/clientes'

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient, private router:Router) { }

  getClientes(page:number):Observable <any> {
    //return of(CLIENTES);
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response:any) => {
        console.log('ClienteService: Tap 1');
        (response.content as Cliente[]).forEach(cliente =>{
          console.log(cliente.nombre);
          
        })
      }),
      map((response:any)=> {
       (response.content as Cliente[]).map(cliente => {
        cliente.nombre = cliente.nombre.toUpperCase();
        let dataPipe = new DatePipe('es')
        //cliente.createAt = dataPipe.transform(cliente.createAt,'EEEE dd, MMMM yyyy') //formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');
        //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'es');
        return cliente;
       })
       return response;
      }
      ),
      tap((response:any) => {
        console.log('ClienteService: Tap 2');
        (response.content as Cliente[]).forEach(cliente =>{
          console.log(cliente.nombre);
          
        })
      })
    );
  }

  //Metodo con operador map 
  create(cliente: Cliente): Observable<Cliente>{
    return this.http.post(this.urlEndPoint,cliente,{headers: this.httpHeaders}).pipe(
      map((response:any) => response.cliente as Cliente),
      catchError(e =>{

        if(e.status==400){
          return throwError( () => e );
        }

        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError( () => e );
      })
    )
  }

  getCliente(id): Observable <Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes'])
        //console.error(e.error.mensaje)
        console.log(e.error.mensaje);
        
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        //return throwError(e);
        return throwError( () => e );
      })
    )
  }

  update(cliente:Cliente): Observable <any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`,cliente,{headers: this.httpHeaders}).pipe(
      catchError(e =>{

        if(e.status==400){
          return throwError( () => e );
        }

        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError( () => e );
      })
    )
  }

  delete(id:number):Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`,{headers: this.httpHeaders}).pipe(
      catchError(e =>{
        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError( () => e );
      })
    )
  }

  subirFoto(archivo:File, id):Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo",archivo);
    formData.append("id",id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`,formData, {
      reportProgress: true
    });
    return this.http.request(req);
  }
}
