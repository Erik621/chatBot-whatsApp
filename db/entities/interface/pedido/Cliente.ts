// src/db/entities/interface/Cliente.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Pedido } from './Pedido';

@Entity()
export class Cliente {

  constructor(id: number, nome: string, endereco: string, telefone: string, pedidos: Pedido[]) {
    this.id = id;
    this.nome = nome;
    this.endereco = endereco;
    this.telefone = telefone;
    this.pedidos = pedidos;

  }



  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  endereco: string;

  @Column()
  telefone: string;

  @OneToMany(() => Pedido, pedido => pedido.cliente)
  pedidos: Pedido[];
}
