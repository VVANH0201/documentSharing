import  express  from "express";
import login from "../controller/auth/login.controller"
import register from "../controller/auth/register.controller"
import authMiddleware from "../middleware/auth.middleware"
const router = express.Router();
const initAuthRoute = (app) => {
    
    router.get('/login', authMiddleware.isAuth, login.showLogin)
    .post('/login', login.login)
    router.post('/register',register.register)
    router.get('/logout', authMiddleware.loggedin,login.logout)
    return app.use('/', router)
    
}


export default initAuthRoute;