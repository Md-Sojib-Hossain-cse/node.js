import bcrypt from "bcrypt";
import { pool } from "../../db";
import type { IAuth } from "./auth.interface";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
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
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign(jwtPayload, config.refresh_secret as string, {
    expiresIn: "365d",
  });

  return { accessToken, refreshToken };
};

const generateRefreshToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized!");
  }

  const decoded = jwt.verify(
    token as string,
    config.refresh_secret as string,
  ) as JwtPayload;

  const userData = await pool.query(
    `
        SELECT * FROM users
        WHERE email=$1
        `,
    [decoded.email],
  );

  const user = userData.rows[0];

  if (!userData.rows[0]) {
    throw new Error("User not found!");
  }

  if (!user?.is_active) {
    throw new Error("Forbidden!");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    is_active: user.is_active,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: "1d",
  });

  return { accessToken };
};

export const authService = {
  loginUserFromDB,
  generateRefreshToken,
};
