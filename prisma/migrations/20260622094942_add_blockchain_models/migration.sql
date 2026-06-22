-- AlterTable
ALTER TABLE "User" ADD COLUMN     "walletAddress" TEXT;

-- CreateTable
CREATE TABLE "Reward" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "thankId" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "txHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reward_thankId_key" ON "Reward"("thankId");

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_thankId_fkey" FOREIGN KEY ("thankId") REFERENCES "Thank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
