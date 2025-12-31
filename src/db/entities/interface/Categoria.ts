// src/db/entities/Categoria.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Produto } from "./Produto";

@Entity()
export class Categoria {

    constructor(id:number,nome:string,ativa:boolean,produtos:Produto[]){
        this.id = id;
        this.nome = nome;
        this.ativa = ativa;
        this.produtos = produtos;
    
    }


  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ default: true })
  ativa: boolean;

  @OneToMany(() => Produto, (produto) => produto.categoria, { cascade: true })
  produtos: Produto[];
}
