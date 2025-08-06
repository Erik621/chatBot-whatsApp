import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1753746057208 implements MigrationInterface {
    name = 'Migration1753746057208'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedido" ALTER COLUMN "observacao" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pedido" ALTER COLUMN "observacao" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedido" ALTER COLUMN "observacao" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "pedido" ALTER COLUMN "observacao" SET NOT NULL`);
    }

}
