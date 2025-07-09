import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751595558572 implements MigrationInterface {
    name = 'Migration1751595558572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ingrediente" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, "produtoId" integer, CONSTRAINT "PK_5d2b1ec0f5d2a4cb767ac13f554" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ingrediente" ADD CONSTRAINT "FK_c0bf74e5330efd0e227a93b56ac" FOREIGN KEY ("produtoId") REFERENCES "produto"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingrediente" DROP CONSTRAINT "FK_c0bf74e5330efd0e227a93b56ac"`);
        await queryRunner.query(`DROP TABLE "ingrediente"`);
    }

}
