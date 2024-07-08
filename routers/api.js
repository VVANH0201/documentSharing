import express from "express";
import APIController from '../controller/APIController';
import test from '../controller/testregister'
import likeController from '../controller/likeController'
import commentController from '../controller/commentController'
import documentController from '../controller/documentController'
import followsController from '../controller/userflowingController'
import postController from '../controller/postController'
import notificationController from '../controller/notificationController'
import userController from '../controller/userController'
import typeController from '../controller/typeController'
import tagController from '../controller/tagController'
import uploadFile from '../middleware/upload';
import emailController from '../controller/emailController'
import adminController from '../controller/adminController'
import feedbackController from '../controller/feedbackController'
import reportController from '../controller/reportController'
let router = express.Router();

const initAPIRoute = (app) => {
    router.get('/users', APIController.getAllUsers); // method GET -> READ data
    router.post('/create-user', APIController.createNewUser); // method POST -> CREATE data
    router.put('/update-user', APIController.updateUser); //method PUT -> UPDATE data
    router.delete('/delete-user/:id', APIController.deleteUser); //method DELETE -> DELETE data
    router.post('/test', test.register);
    router.get('/email', test.checkEmailUser);
    router.post('/testlogin', test.login);
    router.post('/resetpass', test.resetpass);
    //like
    router.get('/like/user/:user_id', likeController.getAllLikeByUser );
    router.get('/like/document/:document_id', likeController.getAllLikeOfDocument);
    router.get('/like/post/:post_id', likeController.getAllLikeOfPost);
    router.get('/like/comment/:comment_id',likeController.getAllLikeOfComment);
    router.post('/like/document', likeController.likeDocument);
    router.post('/like/post', likeController.likePost);
    router.post('/like/comment', likeController.likeComment);
    //comment
    router.get('/comment/user/:user_id', commentController.getAllCommentByUser );
    router.get('/comment/post/:post_id', commentController.getAllCommentOfPost);
    router.get('/comment/document/:document_id', commentController.getAllCommentOfDocument);
    router.get('/comment/:comment_id', commentController.getAllCommentOfComment);
    router.post('/comment/post', commentController.newCommentPost);
    router.post('/comment/document', commentController.newCommentDocument);
    router.post('/comment/parentcomment', commentController.newCommentInComment);
    router.post('/comment/parentcommentpost',commentController.newCommentInCommentPost);
    router.post('/comment/del', commentController.deleteComment);
    router.post('/comment/update', commentController.updateComment);
    router.post('/comment/checkuser', commentController.checkCommentByUser);
    router.post('/comment/admindel/:id', commentController.adminDeleteComment);
    //document
    router.post('/document/updateview',documentController.updateViewCount);
    router.post('/document/updatedownloadview', documentController.updateDownloadCount);
    router.get('/document/:id', documentController.getDocumentById);
    router.get('/types', documentController.getAllTypes);
    router.post('/types/statistic-by-user',typeController.statisticTypeDocumentByUserId);
     router.get('/documents/getbyview', documentController.getdocumentbyview);
    router.get('/documents/getbytime', documentController.getdocumentbytime);
    router.get('/documents/getbytype', documentController.getDocumentByType);
    router.post('/document/delele/:id', documentController.deleteDocument);
    router.get('/document/get-by-user/:id', documentController.getDocumentByUserId);
    router.post('/document/set-public', documentController.publicDocument);
    router.post('/document/set-private', documentController.privateDocument);
    router.get('/documents/get-by-user', documentController.getDocumentByUsers);
    router.get('/documents/types', documentController.documentByTimes);
    //post
    //router.post('/changefile', test.changefile);
    router.get('/post/:id', postController.getPostById );
    router.post('/search', documentController.find);
    router.get('/post/tag/:id', postController.getType);
    router.post('/post/delete/:id', postController.deletePost);
    router.get('/post/get-by-user/:id', postController.getPostByUserId);
    router.post('/post/updateview', postController.updateViewCount);
    router.get('/posts/get-by-view', postController.mostPotByViewCount);
    router.get('/posts/get-by-time', postController.getPostByTime);
    router.post('/posts/set-public', postController.publicPost);
    router.post('/posts/set-private',postController.privatePost);
    router.post('/posts/get-by-tag', postController. getPostByTag);
    router.get('/posts/find', postController.findPost);
    //
    router.post('/user/follows',followsController.addNew );
    router.post('/user/unfollows', followsController.deleteFollow);
    router.post('/user/check',followsController.checkfollows );
    router.get('/user/following/:id',followsController.countfollow);
    router.get('/user/followed/:id',followsController.countfollow1);
    router.get('/user/find', userController.findUser);
    
    //notifications 
    router.get('/notification/:user_id', notificationController.getAllNotification);
    router.post('/notification/update', notificationController.updatenoti);
    router.get('/noti/admin/:user_id', notificationController.getallNotiAdmin);
    
    router.post('/send-email', emailController.send);
    router.post("/download-file", emailController.downloadFile);

    //types
    router.post('/types/addnew',typeController.addNewType);
    router.post('/types/update', typeController.updateType);
    router.get('/types/:id', typeController.getTypeById);
    router.get('/types/children/:parentId', typeController.gettypeByParentId);
    router.post('/types/delete', typeController.deleteType);

    //report
    router.post('/report', reportController.newReport);

    //tags
    router.get('/tags', postController.getAllType);
    router.post('/tags/addnew',tagController.addNewTag);
    router.post('/tags/update', tagController.updateTag);
    router.get('/tags/:id', tagController.getTagById);
    router.post('/tags/delete', tagController.deleteTag);
    //feedback
    router.post('/feedback/addnew',feedbackController.addNewFeedBack);
    router.post('/feedback/del',feedbackController.deleteFeedBack);

    router.post('/admin/deluser/:id', userController.adminDelUser);
    router.post('/admin/search-user',userController.searchUser);
    router.post('/admin/search-post', postController.search_post);
    router.post('/admin/search-document', documentController.search_document);
    router.get('/admin/statisticsByTag', adminController.statisticsByTag );
    router.get('/admin/statisticsByTypes', adminController.statisticsByTypes);
    router.get('/admin/user/statisticUser-day', adminController.newUserStatisticsForDay);
    router.get('/admin/post/statisticPost-day', adminController.newPostStatisticsForDay);
    router.post('/admin/post-by-month', adminController.statisticsPostByMonth);
    router.post('/admin/document-by-month', adminController.statisticsDocumentByMonth);
    router.get('/admin/docuemnt/statisticDocument-day', adminController.newDocumentStatisticsForDay);
    router.post('/admin/StatisticsForMonth', adminController.StatisticsForMonth);
    router.get('/admin/StatisticsForYear', adminController.StatisticsForYear);
    router.post('/admin/user/lockout',userController.accountLockout );
    router.post('/admin/user/unlockout', userController.unAccountLockout);
    router.post('/admin/reports/:id/review', reportController.reviewReport);
    router.post('/admin/reports/:id/resolve', reportController.resolveReport);
   
    router.get('/admin/topUser',adminController.top5User);
    return app.use('/api/v1/', router)
}


export default initAPIRoute;