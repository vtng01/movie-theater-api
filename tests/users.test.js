const request = require("supertest");
const seed = require("../src/db/seed");
const { User } = require("../src/models");
const app = require("../src/server");
