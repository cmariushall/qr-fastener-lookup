const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, "../data/vehicles.csv");
  let fileContent = fs.readFileSync(filePath, "utf8");
  fileContent = fileContent.replace(/^\uFEFF/, ""); // Remove BOM

  const records = parse(fileContent, {
    columns: (header) =>
      header.map((col) => col.trim().toLowerCase().replace(/\s+/g, "_")),
    skip_empty_lines: true,
  });

  console.log(`Loaded ${records.length} rows from CSV`);

  let count = 0;

  for (const row of records) {
    if (!row.year || !row.make || !row.model || !row.part_number) {
      console.warn("Skipping row due to missing data:", row);
      continue;
    }

    const fastener = await prisma.fastener.upsert({
      where: { partNumber: row.part_number },
      update: {},
      create: { partNumber: row.part_number },
    });

    const vehicle = await prisma.vehicle.upsert({
      where: {
        year_make_model: {
          year: parseInt(row.year.trim()),
          make: row.make.trim(),
          model: row.model.trim(),
        },
      },
      update: {},
      create: {
        year: parseInt(row.year.trim()),
        make: row.make.trim(),
        model: row.model.trim(),
      },
    });

    await prisma.fitment.create({
      data: {
        vehicleId: vehicle.id,
        fastenerId: fastener.id,
      },
    });

    count++;
    if (count % 1000 === 0) {
      console.log(`Processed ${count.toLocaleString()} rows...`);
    }
  }

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
