import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'

})
export class FormComponent implements OnInit {

  titulo:string="Crear Cliente";
  cliente:Cliente= new Cliente();
  errores:string[];
  

  constructor(private clienteService:ClienteService, private route:Router, private activateRoute:ActivatedRoute ) { }

  ngOnInit(): void {
    this.cargarCliente()
  }

  cargarCliente(): void{
    this.activateRoute.params.subscribe(params =>{
      let id = params ['id']
      if(id){
        this.clienteService.getCliente(id).subscribe((cliente)=> this.cliente = cliente)
      }
    })
  }

  //Metodo usando operador map en servicio
  create(): void {
    this.clienteService.create(this.cliente).subscribe(
      cliente => { 
      this.route.navigate(['/clientes'])
      Swal.fire('Nuevo Cliente', `El cliente ${cliente.nombre} ha sido creado con exito`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.log('Codigo del error desde el backend: ' + err.status);
        console.log(err.error.errors);
      }
    );
  }
  
   //Metodo sin operador map en servicio con tipo ANY generico y el mensaje y nombre obtenemos directamente del back-end 
  update():void{
    this.clienteService.update(this.cliente)
    .subscribe(json =>{
      this.route.navigate(['/clientes'])
      Swal.fire('Cliente Actualizado', `${json.mensaje}: ${json.cliente.nombre}`, 'success' );
    },
    err => {
      this.errores = err.error.errors as string[];
      console.log('Codigo del error desde el backend: ' + err.status);
      console.log(err.error.errors);
    }
    );
  }

  



}
