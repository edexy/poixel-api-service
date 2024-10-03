import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1727951215691 implements MigrationInterface {
    name = 'CreateUserTable1727951215691'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" varchar(11) PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "businessType" varchar, "password" varchar NOT NULL, "role" varchar NOT NULL DEFAULT ('user'), "isActive" boolean NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE INDEX "idx_user_email" ON "users" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_ace513fa30d485cfd25c11a9e4" ON "users" ("role") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_ace513fa30d485cfd25c11a9e4"`);
        await queryRunner.query(`DROP INDEX "idx_user_email"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
