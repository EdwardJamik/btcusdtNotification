const { Login, Logout,DeleteUser, userList, banUser, updatedAccess, updatedAdminData} = require("../controller/controllers");
const {userVerification} = require("../middlewares/middleware");

const router = require("express").Router();


router.get("/userList", userList);
router.post("/banTgUser", banUser);
router.post("/updatedAccess", updatedAccess);


router.post("/updatedAdminData", updatedAdminData);
router.post("/deleteUser", DeleteUser);
router.post('/login', Login);
router.post('/logout', Logout);
router.post('/',userVerification)


module.exports = router;