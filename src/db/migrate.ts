import path from "path";
import fs from 'fs'
import { db } from "./knex";
export async function runMigration(){
  const dbPath = path.join(__dirname, '../db.json');
  const raw = fs.readFileSync(dbPath, 'utf-8');
  const schema = JSON.parse(raw);
  for(const tableName of Object.keys(schema)){
    const exists = await db.schema.hasTable(tableName);
    const sample = schema[tableName][0];
    if(!exists){
      
      await db.schema.createTable(tableName, (table)=>{
        table.increments('id');
        Object.entries(sample).forEach(([col,val])=> {
          if(col === 'id') return;
          if(typeof val === "string" && val !== 'createdAt' && val !== 'updatedAt') table.integer(col);
          else if (typeof val   === "boolean") table.boolean(col);
          else if(val === 'createdAt' || val === 'updatedAt'){
            table.date(col);
          }
        })
      })
    }else {
    const hasCreatedAt = await db.schema.hasColumn(tableName, 'createdAt');
    const hasUpdatedAt = await db.schema.hasColumn(tableName, 'updatedAt');


      if (!hasCreatedAt || !hasUpdatedAt) {
        await db.schema.alterTable(tableName, (table) => {
          if (!hasCreatedAt) {
            table.timestamp('createdAt');
          }
          if (!hasUpdatedAt) {
            table.timestamp('updatedAt');
          }
        });
      }
    }
  }
}