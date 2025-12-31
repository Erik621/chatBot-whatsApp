// src/db/entities/interface/PedidoItem.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
  } from 'typeorm';
  import { Pedido } from './Pedido';
  import { PedidoIngrediente } from './PedidoIngrediente';
  
  @Entity()
  export class PedidoItem {

    constructor(id:number,pedido:Pedido,nomeProduto:string,imagem:string,precoUnitario:number,quantidade:number,adicionais: PedidoIngrediente[]){
      this.id = id;
      this.pedido = pedido;
      this.nomeProduto = nomeProduto;
      this.imagem = imagem;
      this.precoUnitario = precoUnitario;
      this.adicionais = adicionais;
      this.quantidade = quantidade;
  
  }

    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Pedido, pedido => pedido.itens)
    pedido: Pedido;
  
    @Column()
    nomeProduto: string;
  
    @Column()
    imagem: string;
  
    @Column('decimal', { precision: 10, scale: 2 })
    precoUnitario: number;
  
    @Column()
    quantidade: number;
  
    @OneToMany(() => PedidoIngrediente, ing => ing.pedidoItem, { cascade: true, eager: true })
    adicionais: PedidoIngrediente[];
  }
  