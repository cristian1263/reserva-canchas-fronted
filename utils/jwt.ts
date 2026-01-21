export type JwtPayload = {
  sub: string;
  email: string;
  user_id: number;
  is_admin: boolean;
  exp: number;
};

export function decodeJwt(token: string): JwtPayload {
  const payload = token.split('.')[1];
  const decoded = atob(payload);
  return JSON.parse(decoded);
}
