import express from 'express';
import { allApplication, allCoinPurchase, allReport, allRoomsOpens, checkCertificate, createCertificate, loginAdmin, logoutAdmin, registerAdmin } from '../controllers/admin.controller.js';
import { verifyAdmin } from '../middlewares/admin.middleware.js';

const AdminRoute = express.Router();

AdminRoute.post("/admin-register",registerAdmin);
AdminRoute.post("/admin-login",loginAdmin);
AdminRoute.post("/admin-logout",logoutAdmin);
AdminRoute.get("/all-application",verifyAdmin,allApplication);
AdminRoute.get("/all-openrooms",verifyAdmin,allRoomsOpens);
AdminRoute.get("/all-report",verifyAdmin,allReport);
AdminRoute.get("/all-transaction",verifyAdmin,allCoinPurchase);
AdminRoute.post("/create-certificate",verifyAdmin,createCertificate);
AdminRoute.get("/issuecertificate/:id",checkCertificate);

export default AdminRoute;