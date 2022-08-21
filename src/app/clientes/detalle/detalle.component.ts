import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';
import Swal from 'sweetalert2';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { AuthService } from 'src/app/usuarios/auth.service';
import { FacturaService } from 'src/app/facturas/services/factura.service';
import { Factura } from 'src/app/facturas/models/factura';




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
     public modalService:ModalService,
     private authService: AuthService,
     private facturaService: FacturaService) { }

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

        this.modalService.notificarUpload.emit(this.cliente);

        Swal.fire('La foto se cargo completamente!',response.mensaje, 'success');
      }
    });
  }
  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

  delete(factura: Factura):void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Esta seguro?',
      text: `¿Seguro desea eliminar la factura ${factura.descripcion}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar!',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.facturaService.delete(factura.id).subscribe(
          response => {
            this.cliente.facturas = this.cliente.facturas.filter(f => f !== factura)
            swalWithBootstrapButtons.fire(
              'Factura Eliminada!',
              `Factura ${factura.descripcion} elimindada con exito.`,
              'success'
            )
          }
        )

      }
    })
  }

}
