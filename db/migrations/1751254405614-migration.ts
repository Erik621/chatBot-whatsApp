import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751254405614 implements MigrationInterface {
    name = 'Migration1751254405614'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "produto" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, "descricao" character varying, "imagem" character varying, "valor" numeric(10,2) NOT NULL, "categoriaId" integer, CONSTRAINT "PK_99c4351f9168c50c0736e6a66be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categoria" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, "ativa" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_f027836b77b84fb4c3a374dc70d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "produto" ADD CONSTRAINT "FK_8a1e81267ae184590ce1ee9a39b" FOREIGN KEY ("categoriaId") REFERENCES "categoria"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "produto" DROP CONSTRAINT "FK_8a1e81267ae184590ce1ee9a39b"`);
        await queryRunner.query(`DROP TABLE "categoria"`);
        await queryRunner.query(`DROP TABLE "produto"`);
    }

}
