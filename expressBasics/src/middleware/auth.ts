import jwt, { type JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import config from "../config";
import { pool } from "../db";
import type { TUserRoles } from "../types";

const auth = (...roles: TUserRoles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log(req.headers.authorization);

      //check if the token exists
      //verify the token
      //check if the user exists
      //check if status is active
      //check user roles
      const token = req?.headers?.authorization;

      console.log(roles);

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

      if (roles.length && roles.includes(user.role)) {
        res.status(403).json({
          success: false,
          message: "Forbidden!",
        });
      }

      req.user = decoded;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
