-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_thankId_fkey";

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_thankId_fkey" FOREIGN KEY ("thankId") REFERENCES "Thank"("id") ON DELETE CASCADE ON UPDATE CASCADE;
