// src/db/entities/Example.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Intent } from './Intent';

@Entity('examples')
export class Example {
  
  constructor(id:number,text:string,intent:Intent){
    this.id = id;
    this.text = text;
    this.intent = intent;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => Intent, (intent) => intent.examples)
  intent: Intent;
}
