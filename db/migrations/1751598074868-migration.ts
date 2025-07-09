import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751598074868 implements MigrationInterface {
    name = 'Migration1751598074868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingrediente" DROP CONSTRAINT "FK_c0bf74e5330efd0e227a93b56ac"`);
        await queryRunner.query(`ALTER TABLE "ingrediente" RENAME COLUMN "produtoId" TO "idProdutoId"`);
        await queryRunner.query(`ALTER TABLE "ingrediente" ADD CONSTRAINT "FK_b0997ab7d218b4956ce93702c8c" FOREIGN KEY ("idProdutoId") REFERENCES "produto"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingrediente" DROP CONSTRAINT "FK_b0997ab7d218b4956ce93702c8c"`);
        await queryRunner.query(`ALTER TABLE "ingrediente" RENAME COLUMN "idProdutoId" TO "produtoId"`);
        await queryRunner.query(`ALTER TABLE "ingrediente" ADD CONSTRAINT "FK_c0bf74e5330efd0e227a93b56ac" FOREIGN KEY ("produtoId") REFERENCES "produto"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
