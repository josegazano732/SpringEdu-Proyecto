import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {

  clientes: Cliente [] = [
    {id:1, nombre:'Jose Luis',apellido:'Gazano',email:'josegazano7@outlook.com',createAt:'2022-03-30'},
    {id:2, nombre:'Hugo fabian',apellido:'Gazano',email:'josegazano7@outlook.com',createAt:'2017-01-16'},
    {id:3, nombre:'Adriana de Los Angeles',apellido:'Opichani',email:'opichaniadriana@outlook.com',createAt:'2009-06-11'},
    {id:4, nombre:'Jeremias santiago',apellido:'Gazano',email:'jeremias@gmail.com',createAt:'2001-09-11'},
    {id:5, nombre:'Sergio Luis',apellido:'fernandez',email:'sergiolf@outlook.com',createAt:'2022-03-30'},
    {id:6, nombre:'Juan francisco ',apellido:'Gazano',email:'joaofrans7@outlook.com',createAt:'2014-11-20'}
  ];


  constructor() { }

  ngOnInit(): void {
  }

}
