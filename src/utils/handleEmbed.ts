import {db} from '../db/knex'
export async function handleEmbed(data: any[], currentTable: string, embedResource: string) {
  const foreignKey = `${currentTable.replace(/s$/, '')}_id`; 
  
  const parentIds = data.map(item => item.id);
  if (parentIds.length === 0) return data;

  const children = await db(embedResource).whereIn(foreignKey, parentIds);
  
  const childrenMap = children.reduce((acc, child) => {
    const parentId = child[foreignKey];
    if (!acc[parentId]) acc[parentId] = [];
    acc[parentId].push(child);
    return acc;
  }, {} as Record<string, any[]>);

  return data.map(item => ({
    ...item,
    [embedResource]: childrenMap[item.id] || []
  }));
}