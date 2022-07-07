import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  cliente: Cliente;
  titulo:string= "Detalle del cliente";
  private fotoSleccionada:File;

  constructor(private clienteService:ClienteService,
     private activateRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe(params=>{
      let id:number = +params.get('id');
      if(id){
        this.clienteService.getCliente(id).subscribe(cliente =>{
          this.cliente =  cliente;
        });
      }
    });
  }

  seleccionarFoto(event){
    this.fotoSleccionada = event.target.files[0];
    console.log(fotoSleccionada);
    
  }

  subirFoto(){
    this.clienteService.subriFoto(this.fotoSleccionada, this.cliente.id).
    subscribe(cliente => {
      this.cliente = cliente;
    })
  }

}
