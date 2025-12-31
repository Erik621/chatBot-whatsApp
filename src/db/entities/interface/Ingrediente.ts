// src/db/entities/Ingrediente.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Produto } from "./Produto";

@Entity()
export class Ingrediente {

  constructor(id: number, nome: string, produto: Produto, valorIngrediente: number, quantMax: number) {
    this.id = id;
    this.nome = nome;
    this.Produto = produto;
    this.valorIngrediente = valorIngrediente;
    this.quantMax = quantMax;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  valorIngrediente: number;

  @Column({ type: 'int', default: 0 })
  quantMax: number;

  @ManyToOne(() => Produto, (produto) => produto.ingredientes, { onDelete: "CASCADE" })
  Produto: Produto;
}
