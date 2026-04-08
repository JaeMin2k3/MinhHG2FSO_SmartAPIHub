
import {ALLOWS_RESOURCE} from '../types/types'
export const getTableName = (resource : string) => {
  const tableName = ALLOWS_RESOURCE[resource.toLocaleLowerCase()];
  if(!tableName) throw new Error("Resource không hợp lệ");
  return tableName;
}