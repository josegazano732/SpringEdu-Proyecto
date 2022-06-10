import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';



@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {

  clientes: Cliente [] ;


  constructor(private http:ClienteService) { }

  ngOnInit(): void {
    this.http.getClientes().subscribe(
      clientes => this.clientes = clientes
    );
  }

}
