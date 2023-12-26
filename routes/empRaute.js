const express=require('express');
const empRouter=express.Router();
const empctrlr=require('../controller/empCtrlr');

empRouter.post('/register',empctrlr.register);
empRouter.post('/login',empctrlr.login);
empRouter.get('/logout',empctrlr.logout);
empRouter.get('/all',empctrlr.employees);
empRouter.get('/whoami',empctrlr.whoAmI);


empRouter.get('/:id',empctrlr.employee);
empRouter.delete('/delete/:id',empctrlr.delete);
empRouter.put('/update/:id', empctrlr.update);
empRouter.put('/addreviewer', empctrlr.addreviewParticipant);
//exporting route
module.exports=empRouter;