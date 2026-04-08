export const ALLOWS_RESOURCE: Record<string, string> = {
  users: 'users',
  products: 'products',
  orders: 'orders'
}

export type CustomJwtPayload = {
  userId: string;
  role: string;
}