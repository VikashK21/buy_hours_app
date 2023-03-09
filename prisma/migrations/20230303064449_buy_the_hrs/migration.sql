-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "avatar" TEXT,
    "name" TEXT NOT NULL,
    "pro" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT,
    "phone_num" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profession" (
    "id" SERIAL NOT NULL,
    "category" TEXT,
    "profession" TEXT NOT NULL,
    "professional_d" TEXT NOT NULL,
    "images" TEXT[],
    "ratings" INTEGER NOT NULL,
    "dates_times" TEXT[],
    "amt" TEXT NOT NULL,

    CONSTRAINT "Profession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booked" (
    "id" SERIAL NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "reciever_id" INTEGER NOT NULL,
    "payment" BOOLEAN NOT NULL,
    "paid" TEXT NOT NULL,
    "booked_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booked_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_num_key" ON "Users"("phone_num");

-- AddForeignKey
ALTER TABLE "Profession" ADD CONSTRAINT "Profession_id_fkey" FOREIGN KEY ("id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booked" ADD CONSTRAINT "Booked_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booked" ADD CONSTRAINT "Booked_reciever_id_fkey" FOREIGN KEY ("reciever_id") REFERENCES "Profession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
