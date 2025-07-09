import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751674172430 implements MigrationInterface {
    name = 'Migration1751674172430'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingrediente" ADD "valorIngrediente" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "ingrediente" ADD "quantMax" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingrediente" DROP COLUMN "quantMax"`);
        await queryRunner.query(`ALTER TABLE "ingrediente" DROP COLUMN "valorIngrediente"`);
    }

}
