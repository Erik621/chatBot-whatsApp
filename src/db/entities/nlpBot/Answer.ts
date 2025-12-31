// src/db/entities/Answer.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Intent } from "./Intent";

@Entity('answers')
export class Answer {

    constructor(id:number,text:string,intent:Intent){
        this.id = id;
        this.text = text;
        this.intent = intent;
    }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => Intent, (Intents) => Intents.answers)
  intent: Intent;
}
