import express from "express";
import { SignUser, getProfile, loginUser,    forgotpassword , setforgotpassword} from "../controller/userControllers.js";
import { getWork , getworkpost , getpostbyid , deletebyid } from "../controller/workController.js";
const router = express.Router();




router.post('/signup', SignUser)
router.post('/login', loginUser)
router.get('/getdetails' , getProfile)
router.post('/reset' , forgotpassword)
router.post('/setpassword' , setforgotpassword)
router.post('/getwork' , getWork )
router.get('/getworkpost' , getworkpost)
router.get('/post/:id' , getpostbyid)
router.delete('/delete/:id' , deletebyid)


export default router


