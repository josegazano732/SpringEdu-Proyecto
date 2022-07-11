import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;

  titulo:string= "Detalle del cliente";

  fotoSeleccionada:File;

  progreso: number= 0;

  constructor(private clienteService:ClienteService,
     private activateRoute:ActivatedRoute) { }

  ngOnInit(): void {
    
  }

  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso=0;
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      Swal.fire('Error seleccionar imagen: ','El archivo debe ser de tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto(){
    if (!this.fotoSeleccionada) {
      Swal.fire('Error upload: ','debe seleccionar una foto', 'error');
    }else{
    this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).
    subscribe(event => {

      if (event.type === HttpEventType.UploadProgress) {
        this.progreso = Math.round((event.loaded/event.total)*100)
      }else if (event.type === HttpEventType.Response){
        let response:any = event.body;
        this.cliente = response.cliente as Cliente;
        Swal.fire('La foto se cargo completamente!',response.mensaje, 'success');
      }
    });
  }
  }

}
