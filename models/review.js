const mongoose=require('mongoose');
const reviewSchema=new mongoose.Schema({
    message:{
        type:String,
        requered:true
    },
    review_for:{
        type:mongoose.Schema.Types.ObjectId,
          ref:"employeeview"
    },
    review_by:{
        type:mongoose.Schema.Types.ObjectId,
          ref:"employeeview"
    },
    feedback:{
        type:String,
        requered:false
    }

},
    {timestamps:true})

    const reviewModel=mongoose.model('review',reviewSchema);
    module.exports=reviewModel;