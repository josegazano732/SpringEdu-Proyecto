import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private clienteService:ClienteService, private route:Router ) { }

  ngOnInit(): void {
  }

  create(): void {
    this.clienteService.create(this.cliente).subscribe(
      response => { 
      this.route.navigate(['/clientes'])
      Swal.fire('Nuevo Cliente', `Cliente ${this.cliente.nombre} creado con exito!`, 'success');
      }
    );

  }

}
