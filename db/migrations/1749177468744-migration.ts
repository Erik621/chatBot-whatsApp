import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749177468744 implements MigrationInterface {
    name = 'Migration1749177468744'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "examples" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "intentId" integer, CONSTRAINT "PK_ea56499b0a3a29593d3405080e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "answers" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "intentId" integer, CONSTRAINT "PK_9c32cec6c71e06da0254f2226c6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "intents" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_3c872dee52ac2d2f2a46148618e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_menu" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ce79d21753f316e8e63a6a860ed" UNIQUE ("email"), CONSTRAINT "PK_5da755acaae4237420ac4da27d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "examples" ADD CONSTRAINT "FK_a207b2728a04ec7caa11f5c8711" FOREIGN KEY ("intentId") REFERENCES "intents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answers" ADD CONSTRAINT "FK_a036c95d5161e09430e7e025948" FOREIGN KEY ("intentId") REFERENCES "intents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answers" DROP CONSTRAINT "FK_a036c95d5161e09430e7e025948"`);
        await queryRunner.query(`ALTER TABLE "examples" DROP CONSTRAINT "FK_a207b2728a04ec7caa11f5c8711"`);
        await queryRunner.query(`DROP TABLE "users_menu"`);
        await queryRunner.query(`DROP TABLE "intents"`);
        await queryRunner.query(`DROP TABLE "answers"`);
        await queryRunner.query(`DROP TABLE "examples"`);
    }

}
