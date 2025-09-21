import { Router } from "express";
import { getBooks } from "../Controllers/books.controller.js";

const router = Router();
router.route("/").get(getBooks);


export default router;