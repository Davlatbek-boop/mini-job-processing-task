import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTableAndTaskTable1772455503833 implements MigrationInterface {
    name = 'UserTableAndTaskTable1772455503833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "type" character varying NOT NULL, "priority" "public"."task_priority_enum" NOT NULL DEFAULT 'NORMAL', "payload" jsonb NOT NULL, "status" "public"."task_status_enum" NOT NULL DEFAULT 'PENDING', "idempotency_key" character varying(255) NOT NULL, "attempts" integer NOT NULL DEFAULT '0', "last_error" text, "scheduled_at" TIMESTAMP WITH TIME ZONE, "started_at" TIMESTAMP WITH TIME ZONE, "completed_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1518a6d2856283ac3f1e7ee8742" UNIQUE ("idempotency_key"), CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_task_idempotency_key" ON "task" ("idempotency_key") `);
        await queryRunner.query(`CREATE INDEX "idx_task_scheduled_at" ON "task" ("scheduled_at") `);
        await queryRunner.query(`CREATE INDEX "idx_task_type" ON "task" ("type") `);
        await queryRunner.query(`CREATE INDEX "idx_task_status" ON "task" ("status") `);
        await queryRunner.query(`CREATE INDEX "idx_task_user_id" ON "task" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'USER', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_6ea2c1c13f01b7a383ebbeaebb0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_6ea2c1c13f01b7a383ebbeaebb0"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."idx_task_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_task_status"`);
        await queryRunner.query(`DROP INDEX "public"."idx_task_type"`);
        await queryRunner.query(`DROP INDEX "public"."idx_task_scheduled_at"`);
        await queryRunner.query(`DROP INDEX "public"."idx_task_idempotency_key"`);
        await queryRunner.query(`DROP TABLE "task"`);
    }

}
