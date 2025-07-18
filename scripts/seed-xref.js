const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, "../data/xref.csv");
  let fileContent = fs.readFileSync(filePath, "utf8");
  fileContent = fileContent.replace(/^\uFEFF/, ""); // Remove BOM if present

  const records = parse(fileContent, {
    columns: (header) =>
      header.map((col) => col.trim().toLowerCase().replace(/\s+/g, "_")),
    skip_empty_lines: true,
  });

  console.log(`Loaded ${records.length} rows from CSV`);

  let count = 0;
  let skipped = 0;

  for (const row of records) {
    if (!row.part_number || !row.oem_number) {
      console.warn("Skipping incomplete row:", row);
      skipped++;
      continue;
    }

    const fastener = await prisma.fastener.findUnique({
      where: { partNumber: row.part_number },
    });

    if (!fastener) {
      console.warn(`Part number not found: ${row.part_number}`);
      skipped++;
      continue;
    }

    try {
      await prisma.oemPartNumber.upsert({
        where: {
          oemNumber_fastenerId: {
            oemNumber: row.oem_number,
            fastenerId: fastener.id,
          },
        },
        update: {},
        create: {
          oemNumber: row.oem_number,
          fastenerId: fastener.id,
        },
      });
    } catch (e) {
      console.error(`Error inserting OEM number for ${row.part_number}:`, e);
      skipped++;
      continue;
    }

    count++;
    if (count % 1000 === 0) {
      console.log(`Processed ${count.toLocaleString()} rows...`);
    }
  }

  console.log(`✅ Import complete. ${count} records added. ${skipped} rows skipped.`);
}

main()
  .catch((e) => {
    console.error("❌ Script failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
