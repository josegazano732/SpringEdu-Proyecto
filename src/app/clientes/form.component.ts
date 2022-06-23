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

  create(): void {
    this.clienteService.create(this.cliente).subscribe(
      response => { 
      this.route.navigate(['/clientes'])
      Swal.fire('Nuevo Cliente', `${response.mensaje}: ${this.cliente.nombre}`, 'success');
      }
    );
  }

  update():void{
    this.clienteService.update(this.cliente)
    .subscribe(cliente =>{
      this.route.navigate(['/clientes'])
      Swal.fire('Cliente Actualizado', `${cliente.mensaje}: ${this.cliente.nombre}`, 'success' )
    })
  }

  



}
