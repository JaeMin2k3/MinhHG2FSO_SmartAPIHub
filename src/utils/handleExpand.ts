import {db} from '../db/knex'
export async function handleExpand(data: any[], expandResource: string) {
  const foreignKey = `${expandResource.replace(/s$/, '')}_id`; 
  
  const parentIds = [...new Set(data.map(item => item[foreignKey]).filter(Boolean))];
  if (parentIds.length === 0) return data;

  const parents = await db(expandResource).whereIn('id', parentIds);
  const parentMap = parents.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});

  return data.map(item => ({
    ...item,
    [expandResource.replace(/s$/, '')]: parentMap[item[foreignKey]] || null
  }));
}