import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1753150926733 implements MigrationInterface {
    name = 'Migration1753150926733'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedido" ADD "observacao" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedido" DROP COLUMN "observacao"`);
    }

}
