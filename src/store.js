"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const DB_PATH = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.join(__dirname, "..", "data", "db.json");

function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify({ trips: [], shares: {}, offline: {} }, null, 2), "utf8");
  }
}

function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf8");
  return JSON.parse(raw);
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

function listTrips() {
  const db = readDb();
  return db.trips || [];
}

function saveTrip(payload) {
  const db = readDb();
  const id = crypto.randomUUID();
  const normalizedPayload = payload && payload.payload ? payload.payload : payload;
  const row = {
    id,
    name: payload.name || `行程-${new Date().toLocaleString("zh-CN")}`,
    payload: normalizedPayload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.trips = db.trips || [];
  db.trips.unshift(row);
  writeDb(db);
  return row;
}

function updateTrip(id, payload) {
  const db = readDb();
  const idx = (db.trips || []).findIndex((x) => x.id === id);
  if (idx < 0) return null;
  db.trips[idx].payload = payload;
  db.trips[idx].updatedAt = new Date().toISOString();
  writeDb(db);
  return db.trips[idx];
}

function removeTrip(id) {
  const db = readDb();
  const before = (db.trips || []).length;
  db.trips = (db.trips || []).filter((x) => x.id !== id);
  writeDb(db);
  return before !== db.trips.length;
}

function createShare(tripPayload) {
  const db = readDb();
  const token = crypto.randomBytes(6).toString("hex");
  db.shares = db.shares || {};
  db.shares[token] = {
    payload: tripPayload,
    createdAt: new Date().toISOString()
  };
  writeDb(db);
  return token;
}

function getShare(token) {
  const db = readDb();
  return (db.shares || {})[token] || null;
}

function saveOfflineCache(key, data) {
  const db = readDb();
  db.offline = db.offline || {};
  db.offline[key] = {
    data,
    savedAt: new Date().toISOString()
  };
  writeDb(db);
  return db.offline[key];
}

function readOfflineCache(key) {
  const db = readDb();
  return (db.offline || {})[key] || null;
}

module.exports = {
  listTrips,
  saveTrip,
  updateTrip,
  removeTrip,
  createShare,
  getShare,
  saveOfflineCache,
  readOfflineCache
};
