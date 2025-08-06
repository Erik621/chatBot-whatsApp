import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Categoria } from "./Categoria";
import { Ingrediente } from "./Ingrediente";

@Entity()
export class Produto {

  constructor(
    id: number,
    nome: string,
    imagem: string,
    descricao: string,
    valor: number,
    categoria: Categoria,
    ingredientes: Ingrediente[]
  ) {
    this.id = id;
    this.nome = nome;
    this.imagem = imagem;
    this.valor = valor;
    this.categoria = categoria;
    this.ingredientes = ingredientes;
    this.descricao = descricao
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  descricao: string;

  @Column({ nullable: true })
  imagem: string;

  @Column("decimal", { precision: 10, scale: 2 })
  valor: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.produtos, { onDelete: "CASCADE" })
  categoria: Categoria;

  @OneToMany(() => Ingrediente, (ingrediente) => ingrediente.Produto, { cascade: true })
  ingredientes: Ingrediente[];
}
