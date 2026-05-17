import { pool } from "../../db";

const createProfileIntoDB = async (payload: any) => {
  const { user_id, bio, address, phone, gender } = payload;
  //is the user exits

  const user = await pool.query(
    `
    SELECT * FROM users
    WHERE id=$1
    `,
    [user_id],
  );

  if (!user.rows.length) {
    throw new Error("User Not Found!");
  }

  const result = await pool.query(
    `
    INSERT INTO profiles(
    user_id,bio,address,phone,gender)
    VALUES($1,$2,$3,$4,$5)
    RETURNING *
    `,
    [user_id, bio, address, phone, gender],
  );

  return result;
};

export const profileService = {
  createProfileIntoDB,
};
