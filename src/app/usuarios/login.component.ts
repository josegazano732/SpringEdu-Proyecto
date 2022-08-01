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

  }

  login():void{
    console.log(this.usuario);
    if(this.usuario.username == null || this.usuario.password == null){
      Swal.fire('Error Login', 'Username o Password vacios!', 'error')
      return
    }
    this.authService.login(this.usuario).subscribe(response => {
      console.log(response);
      let payload = JSON.parse(atob(response.access_token.split(".")[1]));
      console.log(payload);
      
      
      this.router.navigate(['/clientes']);
      Swal.fire('Login', `Hola ${payload.user_name}, Inicio de Sesion con exito!`, 'success')      
    });
    
  }

}
