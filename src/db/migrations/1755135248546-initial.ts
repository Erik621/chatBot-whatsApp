import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1755135248546 implements MigrationInterface {
    name = 'Initial1755135248546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "examples" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "intentId" integer, CONSTRAINT "PK_ea56499b0a3a29593d3405080e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "answers" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "intentId" integer, CONSTRAINT "PK_9c32cec6c71e06da0254f2226c6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "intents" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_3c872dee52ac2d2f2a46148618e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_menu" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ce79d21753f316e8e63a6a860ed" UNIQUE ("email"), CONSTRAINT "PK_5da755acaae4237420ac4da27d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ingrediente" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, "valorIngrediente" numeric(10,2) NOT NULL DEFAULT '0', "quantMax" integer NOT NULL DEFAULT '0', "produtoId" integer, CONSTRAINT "PK_5d2b1ec0f5d2a4cb767ac13f554" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "produto" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, "descricao" character varying NOT NULL, "imagem" character varying, "valor" numeric(10,2) NOT NULL, "categoriaId" integer, CONSTRAINT "PK_99c4351f9168c50c0736e6a66be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categoria" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, "ativa" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_f027836b77b84fb4c3a374dc70d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pedido_ingrediente" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, "valor" numeric(10,2) NOT NULL, "quantidade" integer NOT NULL, "pedidoItemId" integer, CONSTRAINT "PK_d7be7bc812440332c150eb24e00" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pedido_item" ("id" SERIAL NOT NULL, "nomeProduto" character varying NOT NULL, "imagem" character varying NOT NULL, "precoUnitario" numeric(10,2) NOT NULL, "quantidade" integer NOT NULL, "pedidoId" integer, CONSTRAINT "PK_debcac4cf65cba2bec324d55415" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pagamento" ("id" SERIAL NOT NULL, "formaPagamento" character varying NOT NULL, "confirmado" boolean NOT NULL DEFAULT false, "pedidoId" integer, CONSTRAINT "REL_2e58ea8831ba85eb9c87a29135" UNIQUE ("pedidoId"), CONSTRAINT "PK_ac81e75b741a26f350c5fb1ff20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pedido" ("id" SERIAL NOT NULL, "observacao" character varying, "criadoEm" TIMESTAMP NOT NULL DEFAULT now(), "finalizado" boolean NOT NULL DEFAULT false, "finalizadoEm" TIMESTAMP, "clienteId" integer, CONSTRAINT "PK_af8d8b3d07fae559c37f56b3f43" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cliente" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, "endereco" character varying NOT NULL, "telefone" character varying NOT NULL, CONSTRAINT "PK_18990e8df6cf7fe71b9dc0f5f39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "examples" ADD CONSTRAINT "FK_a207b2728a04ec7caa11f5c8711" FOREIGN KEY ("intentId") REFERENCES "intents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answers" ADD CONSTRAINT "FK_a036c95d5161e09430e7e025948" FOREIGN KEY ("intentId") REFERENCES "intents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ingrediente" ADD CONSTRAINT "FK_c0bf74e5330efd0e227a93b56ac" FOREIGN KEY ("produtoId") REFERENCES "produto"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "produto" ADD CONSTRAINT "FK_8a1e81267ae184590ce1ee9a39b" FOREIGN KEY ("categoriaId") REFERENCES "categoria"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pedido_ingrediente" ADD CONSTRAINT "FK_193d065760bf6fbce589255df7e" FOREIGN KEY ("pedidoItemId") REFERENCES "pedido_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pedido_item" ADD CONSTRAINT "FK_f184ca9c5c640a3ff3be75c5698" FOREIGN KEY ("pedidoId") REFERENCES "pedido"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pagamento" ADD CONSTRAINT "FK_2e58ea8831ba85eb9c87a29135b" FOREIGN KEY ("pedidoId") REFERENCES "pedido"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pedido" ADD CONSTRAINT "FK_2730a0c3947641edf256551f10c" FOREIGN KEY ("clienteId") REFERENCES "cliente"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedido" DROP CONSTRAINT "FK_2730a0c3947641edf256551f10c"`);
        await queryRunner.query(`ALTER TABLE "pagamento" DROP CONSTRAINT "FK_2e58ea8831ba85eb9c87a29135b"`);
        await queryRunner.query(`ALTER TABLE "pedido_item" DROP CONSTRAINT "FK_f184ca9c5c640a3ff3be75c5698"`);
        await queryRunner.query(`ALTER TABLE "pedido_ingrediente" DROP CONSTRAINT "FK_193d065760bf6fbce589255df7e"`);
        await queryRunner.query(`ALTER TABLE "produto" DROP CONSTRAINT "FK_8a1e81267ae184590ce1ee9a39b"`);
        await queryRunner.query(`ALTER TABLE "ingrediente" DROP CONSTRAINT "FK_c0bf74e5330efd0e227a93b56ac"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP CONSTRAINT "FK_a036c95d5161e09430e7e025948"`);
        await queryRunner.query(`ALTER TABLE "examples" DROP CONSTRAINT "FK_a207b2728a04ec7caa11f5c8711"`);
        await queryRunner.query(`DROP TABLE "cliente"`);
        await queryRunner.query(`DROP TABLE "pedido"`);
        await queryRunner.query(`DROP TABLE "pagamento"`);
        await queryRunner.query(`DROP TABLE "pedido_item"`);
        await queryRunner.query(`DROP TABLE "pedido_ingrediente"`);
        await queryRunner.query(`DROP TABLE "categoria"`);
        await queryRunner.query(`DROP TABLE "produto"`);
        await queryRunner.query(`DROP TABLE "ingrediente"`);
        await queryRunner.query(`DROP TABLE "users_menu"`);
        await queryRunner.query(`DROP TABLE "intents"`);
        await queryRunner.query(`DROP TABLE "answers"`);
        await queryRunner.query(`DROP TABLE "examples"`);
    }

}
