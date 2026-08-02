import express from 'express';
import { allCoinPurchase, allReport } from '../controllers/admin.controller.js';

const AdminRoute = express.Router();

AdminRoute.get("/all-report",allReport);
AdminRoute.get("/all-transaction",allCoinPurchase);

export default AdminRoute;