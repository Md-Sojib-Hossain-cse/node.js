import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  connection_string: process.env.CONNECTION_STRING,
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET,
  refresh_secret: process.env.REFRESH_SECRET,
  access_expired_in: process.env.ACCESS_EXPIRED_IN,
  refresh_expired_in: process.env.REFRESH_EXPIRED_IN,
};

export default config;
