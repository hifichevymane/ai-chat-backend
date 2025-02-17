// @deno-types="npm:@types/express@5.0.0"
import { Router } from "npm:express@4.21.2";
import chatRouter from "./chat.ts";

const router = Router();
router.use(chatRouter);

export default router;
