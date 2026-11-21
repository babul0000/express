import { Router } from "express";

import { userControler } from "./user.controler";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../types";

const router = Router()



router.post("/", userControler.createUser);

router.get("/",auth(USER_ROLE.admin, USER_ROLE.agent), userControler.getAllUsers);

router.get("/:id",auth(USER_ROLE.admin, USER_ROLE.agent), userControler.getSingleUser );

router.put("/:id", userControler.getPutUser );

router.delete("/:id", userControler.deleteUser);

export const userRoute = router;
