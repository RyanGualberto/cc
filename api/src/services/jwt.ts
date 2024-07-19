import jwt from "jsonwebtoken";

const secret = `${process.env.JWT_SECRET}`;

export function generateToken(payload: Record<string, any>) {
  return jwt.sign(payload, secret, {
    expiresIn: 60 * 60,
  });
}

function getTokenFromHeader(authorization: string) {
  return authorization.split(" ")[1];
}

export function verifyTokenFromHeader(authorization: string) {
  const token = getTokenFromHeader(authorization);
  return jwt.verify(token, secret);
}

export function decodeTokenFromHeader(authorization: string) {
  const token = getTokenFromHeader(authorization);
  return jwt.decode(token);
}
