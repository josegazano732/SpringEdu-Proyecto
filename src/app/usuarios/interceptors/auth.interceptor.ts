import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { AuthService } from "../auth.service";
import { catchError } from 'rxjs/operators'
import { Router } from '@angular/router';;

import Swal from 'sweetalert2';



@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(private authService: AuthService,private router: Router){}
    //En este interceptor manejamos las respuestas (response) recibimos.
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

       
       return next.handle(req).pipe(
        catchError (e =>{
            if (e.status == 401) {
                //Condicion cierra sesion en angular cuando el token haya expirado.
                if(this.authService.isAuthenticated()){
                  this.authService.logout();
                }
          
                this.router.navigate(['/login']);
                
              }
              // Se maneja 403 para usuarios sin acceso como admin.Redirigiendo a listado de clientes.
              if (e.status == 403) {
                Swal.fire('Acceso denegado ', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso.`, 'warning');
                this.router.navigate(['/clientes']);
                
              }
              return throwError( () => e );
        })
       );
    }

}
