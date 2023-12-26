 //to fetch data from employee model
 const empModel = require('../models/employeeview');
const userModel=require('../models/review');
 
 //making register function to register user
 module.exports.register= async (req,res)=>{
    //console.log(req.body);
    const {email,name,password}=req.body;
    // console.log(email);
    // console.log(password);
    // console.log(name);

    //check if user already exist or not 
    const userFound=await empModel.findOne({'email':email});
    //if not register
    let savedUser;
    if(userFound==null){
        //push data in database (for push we use create method)
         savedUser=await empModel.create({
           'email': email,
           'name':name,
           'password':password 
        })
    }else{
        //user already exist return response
        res.status(200);
        res.json({
            'status_code':409, 
            'message':'user already registerd',
            'user': userFound
        });
        return res;
    }
    res.status(201);
    res.json({
        'status_code':201, 
        'message':'user has been registered succesfully',
        'user': savedUser
    });
    return res;

} 
//making log in function
module.exports.login=async(req,res)=>{
    const {email,password}=req.body;
    //check if user is trying to log in is he registered or not
    const userFound=await empModel.findOne({'email':email});
    if(userFound==null){
        res.json({
            'status_code':404,
            'message':'user not found in database',
        })
        return res;
    }
    if(password===userFound.password){
        //user logged in succesfully
        res.cookie('emp_id',userFound._id.toString(),{
            httpOnly:true,
            secure:true,
            sameSite:'None'
        });
        res.json({
            'status_code':200,
            'message':'user logged in succesfully',
            'user':userFound
        });
        return res;
    }else{
        //password is not correct 
        res.json({
            'status_code':400,
            'message':'Enter correct password '
        });
        return res;
    }

    
}
//making logout function

module.exports.logout=async(req,res)=>{
    res.cookie('emp_id','-1');
    //indicates a successful HTTP request.
    res.json({
        'status_code':200,
        'message':'logged out succesfully'
    });
    return res;
}

//making function to get all employee
module.exports.employees=async (req,res)=>{
    const cookie=req.headers.cookie;
    //fetch all employees from database
    const empList= await empModel.find().populate('review');
    res.status(200);
    res.json({
        'message':'employees fetched succesfully',
        'allEmp':empList
    })
    return res;
}
//
module.exports.employee=async (req,res)=>{
    const cookie=req.headers.cookie;
    //fetch  employees from database
 
    let id=req.params.id;
    //console.log(id);
    const empObject= await empModel.findById(id).populate('review');
    res.status(200);
    res.json({
        'message':'Employee fetched succesfully',
        'allEmp':empObject
    })
    return res;
}
//making delete function
module.exports.delete=async(req,res)=>{
    //get id from url parameter
    const cookie=req.headers.cookie?.split('=')[1];
    if(cookie===-1 || cookie==null || cookie==undefined){
        res.json({
            "message":"you need to log in first"
        })
        return res;
    }
    const empId=req.params.id;
    //console.log(empId);
    const delVar= await empModel.findByIdAndDelete(empId);
    //console.log(delVar);
    res.json({
        "status_code":204,
        "deletedUser":delVar,
        "message":"User has been deleted succesfully"
    })
    return res; 

}

module.exports.update=async (req,res)=>{
    //get id from url parameter
    const empId=req.params.id;
     const {password,name,is_admin}=req.body;
     let data={};
     if(password!=null){
        data.password=password;
     }
     if(name!=null){
        data.name=name;
     }
     if(is_admin!=null){
        data.is_admin=is_admin;
     }
     const userData= await empModel.findByIdAndUpdate(empId,data);
     res.status(201);
     res.json({
        "message":"employee Updated succesfully",
        "user":userData
     })
    return res;

}

module.exports.addreviewParticipant=async (req,res)=>{
    const userId=req.headers.cookie?.split('=')[1];
    if(userId==null || userId==undefined || userId==-1){
        res.json({
            'status_code':403,
            'message':"Please log  in First"
        })
        return res;
    }
    const empObj=await empModel.findById(userId);
    if(empObj.is_admin==false){
        res.json({
            'status_code':403,
             "message":"Only Admin is Allowed to Add Reviewer"
        })
        return res;
    }
    let revieweeId=req.body.id;
    let reviewerEmail=req.body.email;
    // console.log(revieweeId);
    // console.log(reviewerEmail);
    let revieverEmployee=await empModel.findOne({'email':reviewerEmail});
    revieverEmployee.reviewer_for.push(revieweeId);
    await revieverEmployee.save();

    res.json({
        'status_code':201,
        'message':'Reviewer added Succesfully'
    })
    return res;




}

module.exports.whoAmI=async(req,res)=>{  
    const cookie=req.cookies.emp_id;
    if(cookie==-1 || cookie=='-1' || cookie==null || cookie==undefined){
        res.json({
            'status_code':403,
            'message':"User is Not LoggedIn"
           
        })
        return res;
    }
    const loggedInUser=await empModel.findById(cookie);
        res.json({
            'status_code':200,
            'user':loggedInUser
        })
         return res; 

}