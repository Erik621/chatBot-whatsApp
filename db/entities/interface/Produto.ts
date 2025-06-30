// src/db/entities/Produto.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Categoria } from "./Categoria";

@Entity()
export class Produto {


    constructor(id:number,nome:string,descricao:string,imagem:string, valor: number,categoria: Categoria){
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.imagem = imagem;
        this.valor = valor;
        this.categoria = categoria
    }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ nullable: true })
  descricao: string;

  @Column({ nullable: true })
  imagem: string;

  @Column("decimal", { precision: 10, scale: 2 })
  valor: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.produtos, { onDelete: "CASCADE" })
  categoria: Categoria;
}
