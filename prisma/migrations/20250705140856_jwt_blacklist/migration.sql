-- CreateTable
CREATE TABLE "jwt_blacklist" (
    "id" UUID NOT NULL,
    "jti" VARCHAR(255) NOT NULL,
    "user_id" UUID NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jwt_blacklist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jwt_blacklist_jti_key" ON "jwt_blacklist"("jti");

-- AddForeignKey
ALTER TABLE "jwt_blacklist" ADD CONSTRAINT "jwt_blacklist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
