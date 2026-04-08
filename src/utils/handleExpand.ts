import { db } from '../db/knex';

export async function handleExpand(data: any[], expandResource: string) {
  const baseResource = expandResource.replace(/s$/, ''); 
  
  const foreignKey = `${baseResource}_id`; 
  
  const targetTable = `${baseResource}s`; 

  const parentIds = [...new Set(data.map(item => item[foreignKey]).filter(Boolean))];
  if (parentIds.length === 0) return data;

  const parents = await db(targetTable).whereIn('id', parentIds);
  
  const parentMap = parents.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {} as Record<string, any>);

  return data.map(item => ({
    ...item,
    [expandResource]: parentMap[item[foreignKey]] || null 
  }));
}