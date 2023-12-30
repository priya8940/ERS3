const express=require('express');
const reviewCtrlr=require('../controller/reviewCtrlr');
const reviewRaute=express.Router();

reviewRaute.post('/add',reviewCtrlr.addReview);
reviewRaute.get('/',reviewCtrlr.allReviews);
reviewRaute.delete('/delete/:id',reviewCtrlr.deleteReview);
reviewRaute.put('/update/:id',reviewCtrlr.updateReview);
reviewRaute.put('/feedback/:id', reviewCtrlr.addFeedback);




module.exports=reviewRaute;