import bcrypt from "bcrypt";
import { pool } from "../../db";
import type { IAuth } from "./auth.interface";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUserFromDB = async (payload: IAuth) => {
  const { email, password } = payload;
  //is user exists
  const userData = await pool.query(
    `
    SELECT * FROM users
    WHERE email=$1
    `,
    [email],
  );

  if (!userData.rows[0]) {
    throw new Error("Invalid Credentials!");
  }
  const user = userData.rows[0];
  //is password matched

  const matchedPassword = await bcrypt.compare(password, user.password);

  if (!matchedPassword) {
    throw new Error("Invalid Credentials!");
  }

  //   generate jwt token
  const jwtPayload = {
    id: user.id,
    name: user.name,
    is_active: user.is_active,
    email: user.email,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: "1d",
  });

  return { accessToken };
};

export const authService = {
  loginUserFromDB,
};
