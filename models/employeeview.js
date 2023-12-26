//creating schema 
const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true

    },
    password:{
         type:String,
         required:true,

    },
    name:{
        type:String,
        required:true
    },

   is_admin:{
        type:Boolean,
        required:true,
        default:false
    },
    reviewer_for:[{
        type:String,
        
        
    }],
     //for review we will creat array
     review:[
               {
                type:mongoose.Schema.Types.ObjectId,
                ref:"review"
               }

         ]

 },
    {
        timestamps:true,
});
const user=mongoose.model('user',userSchema);
module.exports=user;