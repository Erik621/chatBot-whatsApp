// src/db/entities/interface/Pedido.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  CreateDateColumn,
} from 'typeorm';
import { Cliente } from './Cliente';
import { PedidoItem } from './PedidoItem';
import { Pagamento } from './Pagamento';

@Entity()
export class Pedido {
  constructor(id: number, cliente: Cliente, itens: PedidoItem[], pagamento: Pagamento, criadoEm: Date, finalizado:boolean,finalizadoEm:Date|null,observacao:string) {
    this.id = id;
    this.cliente = cliente;
    this.itens = itens;
    this.pagamento = pagamento;
    this.criadoEm = criadoEm;
    this.finalizado = finalizado;
    this.finalizadoEm = finalizadoEm;
    this.observacao = observacao;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cliente, cliente => cliente.pedidos, { eager: true })
  cliente: Cliente;

  @OneToMany(() => PedidoItem, item => item.pedido, { cascade: true, eager: true })
  itens: PedidoItem[];

  @OneToOne(() => Pagamento, pagamento => pagamento.pedido, { cascade: true, eager: true })
  pagamento: Pagamento;

  @Column('varchar', { nullable: true })
  observacao: string;

  @CreateDateColumn()
  criadoEm: Date;

  @Column({ default: false })
  finalizado: boolean;

  @Column({ type: 'timestamp', nullable: true })
  finalizadoEm: Date | null;
}
