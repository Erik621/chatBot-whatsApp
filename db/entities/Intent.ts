import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Example } from './Example';
import { Answer } from './Answer';

@Entity('intents')
export class Intent {


  constructor(id:number,name: string, examples:Example[],answers:Answer[]) {
    this.id = id;
    this.name = name;
    this.examples = examples;
    this.answers = answers;
  }
// src/db/entities/Intent.ts
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Example, (example) => example.intent)
  examples: Example[];

  @OneToMany(() => Answer, (answer) => answer.intent)
  answers: Answer[];
}
