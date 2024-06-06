
import { Router } from "express";
import { Users } from "../validation/users.validation";
import { validate } from "../middleware";
import { Userscontroller } from "../controllers";
import { authenticateToken } from "../middleware/authenticatetoken.middleware";

import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: any; // Adjust 'any' to your user type if you have a defined User interface or class
  }
}
const router = Router();

router.post("/signup", Users.create, validate, Userscontroller.createuser);
router.post("/signin", Users.login, validate, Userscontroller.loginUser);
router.post("/forgotpassword", Users.forget, Userscontroller.forgetUser);
router.post("/resetpassword", Users.reset, Userscontroller.resetuserPassword);
router.post("/changepassword", Users.changepassword,authenticateToken,Userscontroller.changePassword);
router.post('/updateinfo/:id',authenticateToken,Userscontroller.updateInfo);

router.get("/currentuser", authenticateToken, (req, res) => {
  res.status(200).json({ user: req.user.role});
});

export default router;
