import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751669777663 implements MigrationInterface {
    name = 'Migration1751669777663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "produto" DROP COLUMN "descricao"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "produto" ADD "descricao" character varying`);
    }

}
