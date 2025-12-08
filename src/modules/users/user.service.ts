import { pool } from '../../config/db';

const createUser = async (name: string, email: string) => {
  const result = await pool.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
    [name, email],
  );
  return result.rows[0];
};

const getUsers = async () => {};

export const userService = { createUser };
