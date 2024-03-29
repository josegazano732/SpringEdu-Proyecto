import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo:string='Iniciar Sesion';

  usuario:Usuario;

  constructor(private authService:AuthService, private router:Router ) { 
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    //Se valida si esta autenticado o no. 
    if(this.authService.isAuthenticated()){
      Swal.fire('Login', `Hola ${this.authService.usuario.username}, ya se encuentra autenticado!`, 'info');
      this.router.navigate(['/clientes']);
    }
  }

  login():void{
    console.log(this.usuario);
    if(this.usuario.username == null || this.usuario.password == null){
      Swal.fire('Error Login', 'Username o Password vacios!', 'error')
      return
    }
    this.authService.login(this.usuario).subscribe(response => {
      console.log(response);
      
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      let usuario = this.authService.usuario;
      this.router.navigate(['/clientes']);
      Swal.fire('Login', `Hola ${usuario.username}, Inicio de Sesion con exito!`, 'success');      
    }, 
    //Se valida si usuario o contraseña no corresponden.
    err => {
      if(err.status == 400){
        Swal.fire('Error Login', 'Usuario o clave incorrecto!', 'error');
      }
    }
    ); 
  }

}
