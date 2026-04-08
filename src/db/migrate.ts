import path from "path";
import fs from "fs";
import { db } from "./knex";

export async function runMigration() {
  const dbPath = path.join(__dirname, "../db.json");
  const raw = fs.readFileSync(dbPath, "utf-8");
  const schema = JSON.parse(raw);

  for (const tableName of Object.keys(schema)) {
    const exists = await db.schema.hasTable(tableName);
    const dataToSeed = schema[tableName]; 
    const sample = dataToSeed[0]; 

    if (!sample) continue; 

    if (!exists) {
      await db.schema.createTable(tableName, (table) => {
        table.increments("id").primary();
        
        Object.entries(sample).forEach(([col, val]) => {
          if (col === "id") return; 
          if (typeof val === "string" && col !== "createdAt" && col !== "updatedAt") {
            table.string(col);
          } else if (typeof val === "number") {
            table.integer(col); 
          } else if (typeof val === "boolean") {
            table.boolean(col);
          }
        });

        if (!sample.createdAt) table.timestamp("createdAt").defaultTo(db.fn.now());
        if (!sample.updatedAt) table.timestamp("updatedAt").defaultTo(db.fn.now());
      });
      console.log(`[Migrate] Đã tạo bảng: ${tableName}`);
    } else {
      const hasCreatedAt = await db.schema.hasColumn(tableName, "createdAt");
      const hasUpdatedAt = await db.schema.hasColumn(tableName, "updatedAt");

      if (!hasCreatedAt || !hasUpdatedAt) {
        await db.schema.alterTable(tableName, (table) => {
          if (!hasCreatedAt) table.timestamp("createdAt").defaultTo(db.fn.now());
          if (!hasUpdatedAt) table.timestamp("updatedAt").defaultTo(db.fn.now());
        });
        console.log(`[Migrate] Đã cập nhật cột timestamps cho bảng: ${tableName}`);
      }
    }

    const result = await db(tableName).count("* as count").first() as { count: string | number };
    const recordCount = Number(result?.count || 0);
    if (recordCount === 0 && dataToSeed.length > 0) {
      console.log(`[Seed] Đang insert dữ liệu mẫu cho bảng: ${tableName}...`);
      
      const insertData = dataToSeed.map((item: any) => {
        return {
          ...item,
          createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
        };
      });

      await db(tableName).insert(insertData);
      
      await db.raw(`SELECT setval(pg_get_serial_sequence(?, 'id'), (SELECT MAX(id) FROM ??))`, [tableName, tableName]);

      console.log(`[Seed] Thành công! Đã insert ${insertData.length} bản ghi và đồng bộ Sequence cho bảng ${tableName}.`);
    }
  }
}