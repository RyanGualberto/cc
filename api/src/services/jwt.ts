import jwt from "jsonwebtoken";

const secret = `${process.env.JWT_SECRET}`;

export function generateToken(payload: Record<string, any>) {
  return jwt.sign(payload, secret, {
    expiresIn: 60 * 60,
  });
}

export function decodeTokenFromHeader<T>(fullToken: string) {
  const token = fullToken.split(" ")[1];
  const decoded = jwt.decode(token) as T;
  return decoded;
}
