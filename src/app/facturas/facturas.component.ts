import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from '../clientes/cliente.service';
import { Factura } from './models/factura';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  
})
export class FacturasComponent implements OnInit {

  titulo:string = 'Nueva Factura';
  factura:Factura = new Factura();

  autocompleteControl = new FormControl('');
  productos: string[] = ['Tv 32 Smartv', 'Plancha a vapor', 'Juego de comedor 6 sillas'];
  productosFiltrados: Observable<string[]>;

  constructor(private clienteService: ClienteService,
    private activateRoute:ActivatedRoute) { }

  ngOnInit(): void {
    //Se obtiene el cliente por id para asignar el cliente a nueva instancia de factura.
    this.activateRoute.paramMap.subscribe(params => {
      let clienteId = +params.get('clienteId');//Obtiene a travez de la ruta su clienteID.
      //Obtiene a clienteId desde backend y lo asignamos a atributo cliente de factura para su nueva instancia de factura.
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
    });

    this.productosFiltrados = this.autocompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

  }

  

 

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.productos.filter(option => option.toLowerCase().includes(filterValue));
  }

}
