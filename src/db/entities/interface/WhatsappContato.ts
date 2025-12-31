import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, } from 'typeorm';

@Entity('contatos_geral')
export class WhatsappContato {

    constructor(id: number, whatsappId: string, telefone: string, ultimaInteracao: Date) {
        this.id = id;
        this.whatsappId = whatsappId;
        this.telefone = telefone;
        this.ultimaInteracao = ultimaInteracao;
    
    }



    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    whatsappId: string; // 5577998067093@c.us

    @Column()
    telefone: string; // 77998067093 ou 7798067093

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    ultimaInteracao: Date;
}
