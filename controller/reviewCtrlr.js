const reviewModel=require('../models/review');
const empModel=require('../models/employeeview');

module.exports.addReview=async (req,res)=>{
const {message,review_for}=req.body;
    //console.log(message);
if(message==undefined || message==null){
    res.json({
        'status_code':500,
        'message':'Message Cant be empty'
    });
    return res;

}
//if cookie is true then split it
const review_by=req.headers.cookie?.split('=')[1];
if(review_by==null || review_by==undefined || review_by==-1){
    res.json({
        'status_code':403,
        'message':'please login first'
    });
    return res;

}
// console.log(message);
// console.log(review_by);
// console.log(review_for);
const review= await reviewModel.create({
    "message":message,
     "review_for":review_for,
     "review_by":review_by
});

//updating employee with review id for whom review has been given
 let empObj=await empModel.findById(review_for);
 empObj.review.push(review._id.toString());
 await empObj.save();
res.status(201);
 res.json({
    "message":"review added succesfully",
    "review":review,
});
  return res;
}
module.exports.allReviews=async (req,res)=>{
     const reviewArray=await reviewModel.find();
     res.status(200);
     res.json({
        "message":"Review fetched succesfully",
        'reviews':reviewArray
     })
     return res;
}
module.exports.deleteReview = async (req, res)=>{
    const reviewId = req.params.id;
    const review_by = req.headers.cookie?.split('=')[1];
    if(review_by == null || review_by == undefined || review_by == -1){
        res.status(403);
        res.json({
            "message":"Please Login first"
        });
        return res;
    }
    if(reviewId!=null){
        const deletedReview = await reviewModel.findByIdAndDelete(reviewId);
        const review_for = deletedReview.review_for;
        let empObj = await empModel.findById(review_for);
        let i=0;
        for(;i<empObj.review.length;i++){
            if(empObj.review[i]===reviewId){
                empObj.review.splice(i,1);
                break;
            }
        }
        //either i is pointing to the element which we want to remove
        //or element was not found
        await empObj.save();
        res.json({
            "status_code":204,
            "message":"Review was deleted successfully",
            'review':deletedReview
        });
        return res;
    }
}
module.exports.updateReview=async (req,res)=>{
    const reviewId = req.params.id;
    const review_by = req.headers.cookie?.split('=')[1];
    if(review_by == null || review_by == undefined || review_by == -1){
        res.status(403);
        res.json({
           "messege":'please log in first'
        })
        return res;
    }

        if(reviewId!=null){
         const message=req.body.message;
         const review=await reviewModel.findByIdAndUpdate(reviewId,{"message": message});
         const updatedReview=await reviewModel.findById(review._id.toString());
         res.json({
            'status_code':'200',
            'messege':'Review has been Updated Succesfully',
            "review":updatedReview
           
         });
         return res;
        }

   
}