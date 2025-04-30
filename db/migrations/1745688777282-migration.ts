import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1745688777282 implements MigrationInterface {
    name = 'Migration1745688777282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answers" DROP COLUMN "aa"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answers" ADD "aa" integer NOT NULL`);
    }

}
