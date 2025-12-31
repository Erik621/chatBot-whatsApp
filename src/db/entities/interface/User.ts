// src/modules/users/entities/User.ts
import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn,} from 'typeorm';

@Entity('users_menu')
export class User {


    constructor(id:string,email:string,password:string,isActive:boolean,createdAt: Date,updatedAt: Date){
        this.id = id;
        this.email = email;
        this.password = password;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt
    }


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
