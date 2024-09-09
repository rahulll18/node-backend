import dotenv from 'dotenv'
import express from "express";
import connectDB from './db/mongodb.js'

dotenv.config({});
const app = express();

connectDB();

