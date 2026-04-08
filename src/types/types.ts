export const ALLOWS_RESOURCE: Record<string, string> = {
  users: 'user',
  products: 'product',
  orders: 'order'
}

export type CustomJwtPayload = {
  userId: string;
  role: string;
}