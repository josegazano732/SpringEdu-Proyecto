import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from '../clientes/cliente.service';
import { Factura } from './models/factura';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, flatMap, mergeMap} from 'rxjs/operators';
import { FacturaService } from './services/factura.service';
import { Producto } from './models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ItemFactura } from './models/item-factura';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  
})
export class FacturasComponent implements OnInit {

  titulo:string = 'Nueva Factura';
  factura:Factura = new Factura();

  autocompleteControl = new FormControl('');
  
  productosFiltrados: Observable<Producto[]>;

  constructor(private clienteService: ClienteService,
    private activateRoute:ActivatedRoute,
    private facturaService:FacturaService) { }

  ngOnInit(): void {
    //Se obtiene el cliente por id para asignar el cliente a nueva instancia de factura.
    this.activateRoute.paramMap.subscribe(params => {
      let clienteId = +params.get('clienteId');//Obtiene a travez de la ruta su clienteID.
      //Obtiene a clienteId desde backend y lo asignamos a atributo cliente de factura para su nueva instancia de factura.
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
    });

    this.productosFiltrados = this.autocompleteControl.valueChanges.pipe(
      map(value => typeof value === 'string'? value: value.nombre),
      mergeMap(value => value? this._filter(value): []),
    );

  }

  private _filter(value: string): Observable <Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Producto): string | undefined {
    return producto? producto.nombre : undefined;
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    let producto = event.option.value as Producto;
    console.log(producto);

    let nuevoItem = new ItemFactura();
    nuevoItem.producto = producto;
    this.factura.items.push(nuevoItem);

    this.autocompleteControl.setValue(' ');
    event.option.focus();
    event.option.deselect();
  }

  actualizarCantidad(id:number, event:any): void{
    let cantidad:number = event.target.value as number;

    this.factura.items = this.factura.items.map((item:ItemFactura) => {
      if(id === item.producto.id){
        item.cantidad = cantidad;
      }
      return item;
    });
  }

}
