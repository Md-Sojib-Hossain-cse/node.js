import jwt, { type JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import config from "../config";
import { pool } from "../db";

const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.headers.authorization);
    const token = req?.headers?.authorization;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized Access!",
      });
    }

    const decoded = jwt.verify(
      token as string,
      config.jwt_secret as string,
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
      res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    }

    if (!user?.is_active) {
      res.status(403).json({
        success: false,
        message: "Forbidden!",
      });
    }
    next();
  };
};

export default auth;
