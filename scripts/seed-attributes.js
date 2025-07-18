const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, "../data/attributes.csv");
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
    const { part_number, product_type, description, quantity, ...rawAttributes } = row;

    if (!part_number || !product_type || !description || !quantity) {
      console.warn("Skipping incomplete row:", row);
      skipped++;
      continue;
    }

    const attributes = {};

    for (const [key, value] of Object.entries(rawAttributes)) {
      if (value && value.trim() !== "") {
        attributes[key] = value.trim();
      }
    }

    // Add required 'quantity' field to attributes explicitly
    attributes.quantity = quantity.trim();

    try {
      await prisma.fastener.upsert({
        where: { partNumber: part_number },
        update: {
          type: product_type,
          locationDesc: description,
          attributes,
        },
        create: {
          partNumber: part_number,
          type: product_type,
          locationDesc: description,
          attributes,
        },
      });
    } catch (e) {
      console.error(`❌ Error processing ${part_number}:`, e);
      skipped++;
      continue;
    }

    count++;
    if (count % 1000 === 0) {
      console.log(`Processed ${count.toLocaleString()} rows...`);
    }
  }

  console.log(`✅ Import complete. ${count} fasteners processed. ${skipped} rows skipped.`);
}

main()
  .catch((e) => {
    console.error("❌ Script failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
