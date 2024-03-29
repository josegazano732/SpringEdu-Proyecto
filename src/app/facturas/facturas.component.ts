import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../clientes/cliente.service';
import { Factura } from './models/factura';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import { FacturaService } from './services/factura.service';
import { Producto } from './models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ItemFactura } from './models/item-factura';
import Swal from 'sweetalert2';

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
    private facturaService:FacturaService,
    private router:Router) { }

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

    if(this.existeItem(producto.id)){
      this.incrementaCantidad(producto.id);
    } else{
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }

    

    this.autocompleteControl.setValue(' ');
    event.option.focus();
    event.option.deselect();
  }

  //Metodo para actualizar cantidad la cantidad de producto.
  actualizarCantidad(id:number, event:any): void{
    //Obtengo cant. de input
    let cantidad:number = event.target.value as number;
    
    if(cantidad == 0){
      return this.eliminarItemFactura(id);
    }

    this.factura.items = this.factura.items.map((item:ItemFactura) => {
      if(id === item.producto.id){
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  existeItem(id:number):boolean{
    let existe = false;
    this.factura.items.forEach((item:ItemFactura) =>{
      if(id === item.producto.id){
        existe = true;
      } 
    });
    return existe;
  }

  incrementaCantidad(id:number):void{

    this.factura.items = this.factura.items.map((item:ItemFactura) => {
      if(id === item.producto.id){
        item.cantidad = item.cantidad + 1;
      }
      return item;
    });
  }

  eliminarItemFactura(id:number):void{
    this.factura.items = this.factura.items.filter((item: ItemFactura) => id !== item.producto.id);
  }

  create(facturaForm):void{
    console.log(this.factura);
    if(this.factura.items.length == 0){
      this.autocompleteControl.setErrors({'invalid': true});
    }
    if(facturaForm.form.valid && this.factura.items.length > 0){    
    this.facturaService.create(this.factura).subscribe(factura => {
      Swal.fire(this.titulo, `Factura ${factura.descripcion} creada con exito! `, `success` );
      this.router.navigate(['/facturas', factura.id]);
    })
  }
}

}
