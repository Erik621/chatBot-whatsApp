// src/db/entities/interface/PedidoIngrediente.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PedidoItem } from './PedidoItem';

@Entity()
export class PedidoIngrediente {
  

  constructor(id:number,pedidoItem:PedidoItem,nome:string,valor:number,quantidade:number){
      this.id = id;
      this.pedidoItem = pedidoItem;
      this.nome = nome;
      this.valor = valor;
      this.quantidade = quantidade;

  
  }
  
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PedidoItem, item => item.adicionais)
  pedidoItem: PedidoItem;

  @Column()
  nome: string;

  @Column('decimal', { precision: 10, scale: 2 })
  valor: number;

  @Column()
  quantidade: number;
}
