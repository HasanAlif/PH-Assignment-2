import { Pool } from 'pg';
import config from '.';

export const pool = new Pool({
  connectionString: config.connection_string,
});

const initDB = async () => {
  await pool.query(`DO $$ BEGIN
    CREATE TYPE vehicle_type AS ENUM ('car', 'bike', 'van', 'SUV');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;`);

  await pool.query(`DO $$ BEGIN
    CREATE TYPE booking_status_enum AS ENUM ('active', 'cancelled', 'returned');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;`);

  await pool.query(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

  await pool.query(`CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        veichle_name VARCHAR(100) NOT NULL,
        type vehicle_type NOT NULL,
        registration_number VARCHAR(50) UNIQUE NOT NULL,
        daily_rental_price NUMERIC(10, 2) NOT NULL CHECK (daily_rental_price > 0),
        availability_status BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

  await pool.query(`CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
        total_price NUMERIC(10, 2) NOT NULL CHECK (total_price > 0),
        status booking_status_enum NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
};

export default initDB;
