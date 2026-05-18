import fs from "fs";
import type { NextFunction, Request, Response } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const log = `-Method -> ${req.method} -Time -> ${Date.now()} -Url -> ${req.url} \n`;

  fs.appendFile("logger.txt", log, (err) => {
    console.log(err);
  });
  next();
};

export default logger;
