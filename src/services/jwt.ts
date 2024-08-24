import { sign, verify } from "jsonwebtoken";
import "dotenv/config";

type TokenData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  type: string;
};

const secret = process.env.JWT_SECRET as string;
if (!secret) throw new Error("JWT_SECRET is not defined");

export function generateToken({
  id,
  firstName,
  lastName,
  email,
  image,
  type,
}: TokenData) {
  return sign({ id, firstName, lastName, email, image, type }, secret);
}

export function verifyToken(token: string) {
  try {
    return verify(token, secret) as TokenData;
  } catch (error) {
    console.error(error);
    return null;
  }
}
