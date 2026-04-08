import {db} from '../db/knex'

export async function tableExits(tableName: string): Promise<boolean>{
  const result = await db('information_schema.tables').where({
    table_schema: 'public',
    table_name: 'tableName'
  }).count('table_name as acount')
  .first();
  return Number(result?.count) > 0;
}