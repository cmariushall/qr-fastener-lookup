// scripts/seed-images.js
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, '../data/images.csv');
  const fileContent = fs.readFileSync(filePath);
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });

  console.log(`Loaded ${records.length} rows from CSV`);

  let count = 0;
  for (const row of records) {
    const {
      part_number,
      image_1,
      image_2,
      image_3,
      image_4,
      image_5
    } = row;

    if (!part_number || !image_1) {
      console.log('Skipping row due to missing data:', row);
      continue;
    }

    await prisma.fastener.update({
      where: { partNumber: part_number },
      data: {
        images: [image_1, image_2, image_3, image_4, image_5].filter(Boolean)
      }
    });

    count++;
    if (count % 1000 === 0) {
      console.log(`Processed ${count} rows`);
    }
  }

  console.log(`Finished processing ${count} rows.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
