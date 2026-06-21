import { db } from "./db.js";
import { sql } from "drizzle-orm";

export async function migrate() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL DEFAULT 'Kisan User',
      phone TEXT NOT NULL UNIQUE,
      email TEXT,
      avatar TEXT,
      location TEXT DEFAULT 'India',
      lat REAL,
      lng REAL,
      farm_size TEXT,
      crop_types TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS otp_sessions (
      id SERIAL PRIMARY KEY,
      phone TEXT NOT NULL,
      otp TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS disease_scans (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      image_data TEXT,
      disease_name TEXT,
      confidence REAL,
      severity TEXT,
      affected_crop TEXT,
      symptoms TEXT,
      treatment TEXT,
      prevention TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS conversations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      title TEXT NOT NULL,
      type TEXT DEFAULT 'general',
      scan_id INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS transport_listings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      type TEXT NOT NULL,
      vehicle_name TEXT NOT NULL,
      capacity TEXT,
      price_per_km REAL,
      phone TEXT,
      from_location TEXT,
      to_location TEXT,
      lat REAL,
      lng REAL,
      available BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `);

  await db.execute(sql`
    INSERT INTO transport_listings (type, vehicle_name, capacity, price_per_km, phone, from_location, to_location, lat, lng, available)
    SELECT 'truck', 'Tata 407 Mini Truck', '2 Tonnes', 12.5, '+91 98765 43210', 'Pune', 'Mumbai', 18.5204, 73.8567, true
    WHERE NOT EXISTS (SELECT 1 FROM transport_listings LIMIT 1)
  `);

  await db.execute(sql`
    INSERT INTO transport_listings (type, vehicle_name, capacity, price_per_km, phone, from_location, to_location, lat, lng, available)
    SELECT 'tractor', 'Mahindra 575 Tractor', '1.5 Tonnes', 8.0, '+91 87654 32109', 'Nashik', 'Pune', 19.9975, 73.7898, true
    WHERE (SELECT COUNT(*) FROM transport_listings) < 2
  `);

  await db.execute(sql`
    INSERT INTO transport_listings (type, vehicle_name, capacity, price_per_km, phone, from_location, to_location, lat, lng, available)
    SELECT 'van', 'Force Traveller Van', '800 KG', 10.0, '+91 76543 21098', 'Aurangabad', 'Nashik', 19.8762, 75.3433, true
    WHERE (SELECT COUNT(*) FROM transport_listings) < 3
  `);

  await db.execute(sql`
    INSERT INTO transport_listings (type, vehicle_name, capacity, price_per_km, phone, from_location, to_location, lat, lng, available)
    SELECT 'truck', 'Ashok Leyland Cargo', '5 Tonnes', 15.0, '+91 65432 10987', 'Mumbai', 'Delhi', 28.6139, 77.2090, false
    WHERE (SELECT COUNT(*) FROM transport_listings) < 4
  `);

  await db.execute(sql`
    INSERT INTO transport_listings (type, vehicle_name, capacity, price_per_km, phone, from_location, to_location, lat, lng, available)
    SELECT 'tractor', 'Sonalika 750 DI', '2 Tonnes', 7.5, '+91 54321 09876', 'Jaipur', 'Agra', 26.9124, 75.7873, true
    WHERE (SELECT COUNT(*) FROM transport_listings) < 5
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS market_listings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      crop_name TEXT NOT NULL,
      category TEXT DEFAULT 'vegetable',
      quantity TEXT,
      unit TEXT DEFAULT 'kg',
      price REAL NOT NULL,
      location TEXT DEFAULT 'India',
      description TEXT,
      image_data TEXT,
      phone TEXT,
      available BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `);

  await db.execute(sql`
    INSERT INTO market_listings (crop_name, category, quantity, unit, price, location, description, phone, available)
    SELECT 'Tomato', 'vegetable', '500', 'kg', 18.50, 'Nashik, Maharashtra', 'Fresh hybrid tomatoes, just harvested. Bulk discount available.', '+91 98765 11111', true
    WHERE NOT EXISTS (SELECT 1 FROM market_listings LIMIT 1)
  `);
  await db.execute(sql`
    INSERT INTO market_listings (crop_name, category, quantity, unit, price, location, description, phone, available)
    SELECT 'Wheat', 'grain', '20', 'quintal', 2150, 'Ludhiana, Punjab', 'High quality wheat, Grade A. MSP price or better.', '+91 98765 22222', true
    WHERE (SELECT COUNT(*) FROM market_listings) < 2
  `);
  await db.execute(sql`
    INSERT INTO market_listings (crop_name, category, quantity, unit, price, location, description, phone, available)
    SELECT 'Alphonso Mango', 'fruit', '200', 'kg', 120, 'Ratnagiri, Maharashtra', 'GI-tagged Alphonso mangoes. Sweet, ripe and ready.', '+91 98765 33333', true
    WHERE (SELECT COUNT(*) FROM market_listings) < 3
  `);
  await db.execute(sql`
    INSERT INTO market_listings (crop_name, category, quantity, unit, price, location, description, phone, available)
    SELECT 'Turmeric', 'spice', '50', 'kg', 95, 'Sangli, Maharashtra', 'Organic turmeric powder, high curcumin content.', '+91 98765 44444', true
    WHERE (SELECT COUNT(*) FROM market_listings) < 4
  `);
  await db.execute(sql`
    INSERT INTO market_listings (crop_name, category, quantity, unit, price, location, description, phone, available)
    SELECT 'Chana Dal', 'pulse', '30', 'quintal', 4800, 'Indore, MP', 'Clean, sorted chana dal. Direct from farm.', '+91 98765 55555', true
    WHERE (SELECT COUNT(*) FROM market_listings) < 5
  `);
  await db.execute(sql`
    INSERT INTO market_listings (crop_name, category, quantity, unit, price, location, description, phone, available)
    SELECT 'Onion', 'vegetable', '300', 'kg', 22, 'Lasalgaon, Maharashtra', 'Red onions, medium size, good for export.', '+91 98765 66666', true
    WHERE (SELECT COUNT(*) FROM market_listings) < 6
  `);

  console.log("Database migrated successfully");
}
