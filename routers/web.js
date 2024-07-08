import  express  from "express";
import webController from '../controller/webcontroller';
import authMiddleware from "../middleware/auth.middleware"
import uploadFile from '../middleware/upload';
const router = express.Router();


    // router.get('/login', webController.login);
    router.get('/register',webController.register);
    router.get('/',authMiddleware.loggedin, webController.homepage);
    router.get('/about',authMiddleware.loggedin, webController.about);
    router.get('/add', webController.addCustomer);
    router.post('/add',uploadFile.upload.single("file"),webController.postCustomer);
    //router.post('/âddfile', we bController.changefile);
    router.get('/view/:id', webController.view);
    router.get('/edit/:id', webController.edit);
    router.post('/update_user', webController.editPost);
    router.post('/delete_user', webController.deleteCustomer);
    router.post('/changefile', webController.changefile);
    router.post('/search', webController.searchCustomers);
    router.get('/home',authMiddleware.loggedin, webController.home);
    router.get('/account',authMiddleware.loggedin, webController.account);
    router.get('/upload',authMiddleware.loggedin, webController.upload);
    router.post('/updateuser', webController.updateUsers);
    router.post('/uploaddocument',uploadFile.upload.single("file"), webController.uploaddocument);
    router.get('/uploadpost',authMiddleware.loggedin, webController.uploadpost )
    router.post('/uploadPost',uploadFile.upload.single("file"), webController.uploadPost);
    router.post('/updatepost',uploadFile.upload.single("file"), webController.updatepost);

    router.get('/message', authMiddleware.loggedin, webController.message);
    router.get('/friend', authMiddleware.loggedin, webController.following);
    router.get('/noti', authMiddleware.loggedin, webController.listnoti);

    
    router.get('/document/view/:id', authMiddleware.loggedin,webController.documentdetail);
    router.get('/user/:id',authMiddleware.loggedin, webController.userdetail);
    router.get('/types/:id',authMiddleware.loggedin, webController.listtypes);
    router.get('/types', authMiddleware.loggedin, webController.AllTypes);
    router.get('/post/:id', authMiddleware.loggedin, webController.postdetail );
    router.get('/tag/:id', authMiddleware.loggedin,webController.tags);
    router.get('/mydocument',authMiddleware.loggedin, webController.mydocument);
    router.get('/mypost',authMiddleware.loggedin, webController.mypost);
    router.get('/search',authMiddleware.loggedin, webController.search);
    router.get('/viewpost/:id', authMiddleware.loggedin, webController.viewpost);

    router.get('/forgotpass', webController.forgotpass);
    
    //admin
    router.get('/admin/',authMiddleware.loggedin,webController.adminhomepage);
    router.get('/admin/customer', webController.admincustomer);
    router.get('/admin/login', webController.adminlogin);
    router.get('/admin/user', authMiddleware.loggedin, webController.adminuser);
    router.get('/admin/post', authMiddleware.loggedin, webController.adminpost);
    router.get('/admin/document', authMiddleware.loggedin, webController.admindocument);
    router.get('/admin/comment', authMiddleware.loggedin, webController.admincomment);
    router.get('/admin/addpost', authMiddleware.loggedin, webController.getadminaddpost);
    router.post('/admin/addPost',uploadFile.upload.single("file"), webController.adminaddposst);
    router.get('/admin/viewpost/:id', authMiddleware.loggedin, webController.adminviewpost);
    router.get('/admin/viewdocument/:id', authMiddleware.loggedin, webController.adminviewdocument);
    router.get('/admin/viewuser/:id',authMiddleware.loggedin, webController.adminviewuser);
    router.get('/admin/type', authMiddleware.loggedin, webController.adminType);
    router.get('/admin/tag', authMiddleware.loggedin, webController.admintag);
    router.get('/admin/feedback', authMiddleware.loggedin, webController.adminfeedback);
    router.get('/admin/report', authMiddleware.loggedin, webController.adminreport);
    router.get('/admin/report/review', authMiddleware.loggedin, webController.adminrewiewreport);
    router.get('/admin/report/resolve', authMiddleware.loggedin, webController.adminresolvereport);
module.exports = router;