import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'

})
export class FormComponent implements OnInit {

  titulo:string="Crear Cliente";

  cliente:Cliente= new Cliente();

  constructor() { }

  ngOnInit(): void {
  }

  create(): void {
    console.log("clicked");
    console.log(this.cliente);

  }

}
