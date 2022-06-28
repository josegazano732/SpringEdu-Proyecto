import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { tap } from 'rxjs';



@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {

  clientes: Cliente [] ;


  constructor(private http:ClienteService) { }

  ngOnInit(): void {
    let page = 0;
    this.http.getClientes(page).pipe(
      tap(response => {
        console.log('ClienteComponent: Tap 3');
        (response.content as Cliente[]).forEach(cliente =>{
          console.log(cliente.nombre);
        });
      })
    ).subscribe(
      response => this.clientes = response.content as Cliente[]
    );
  }

  delete(cliente:Cliente): void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Esta seguro?',
      text: `¿Seguro desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar!',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli  => cli !== cliente)
            swalWithBootstrapButtons.fire(
              'Cliente Eliminado!',
              `Cliente ${cliente.nombre} elimindado con exito.`,
              'success'
            )
          }
        )
        
      } 
    })
  }

}
