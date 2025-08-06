// src/db/entities/interface/Pagamento.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Pedido } from './Pedido';

@Entity()
export class Pagamento {


  constructor(id:number,formaPagamento:string,confirmado:boolean,pedidos:Pedido){
    this.id = id;
    this.formaPagamento = formaPagamento;
    this.confirmado = confirmado;
    this.pedido = pedidos;

}

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  formaPagamento: string; // ex: 'dinheiro', 'pix', 'cartão'

  @Column({ default: false })
  confirmado: boolean;

  @OneToOne(() => Pedido, pedido => pedido.pagamento, { onDelete: 'CASCADE' })
  @JoinColumn()
  pedido: Pedido;
}

