import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1767144533884 implements MigrationInterface {
    name = 'Migration1767144533884'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contatos_geral" ("id" SERIAL NOT NULL, "whatsappId" character varying NOT NULL, "telefone" character varying NOT NULL, "ultimaInteracao" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9eedbd3fab356bf7ca6d9f1a81b" UNIQUE ("whatsappId"), CONSTRAINT "PK_568bf043fe99fd45a445262d1dd" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "contatos_geral"`);
    }

}
