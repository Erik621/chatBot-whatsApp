

  
    import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

    @Entity()
    export class User {

        constructor(id:number, email: string, name: string) {
            this.id = id;
            this.name = name;
            this.email = email;
        
        }
      @PrimaryGeneratedColumn()
      id: number;
    
      @Column()
      name: string;
    
      @Column()
      email: string;
    }
    