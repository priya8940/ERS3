
let registerButton = document.getElementById('register');

registerButton.addEventListener('click',()=>{
    let rootEle = document.getElementById('root');
    rootEle.innerHTML="";
    let nameEle = document.createElement('input');
    nameEle.setAttribute('type','text');
    nameEle.setAttribute('name','name');
    nameEle.setAttribute('placeholder','Enter your name');
    nameEle.setAttribute('id','name');

    let emailEle = document.createElement('input');
    emailEle.setAttribute('type','email');
    emailEle.setAttribute('name','email');
    emailEle.setAttribute('placeholder','Enter your email');
    emailEle.setAttribute('id','email');

    let passwordEle = document.createElement('input');
    passwordEle.setAttribute('type','password');
    passwordEle.setAttribute('name','password');
    passwordEle.setAttribute('placeholder','Enter your password');
    passwordEle.setAttribute('id','password');

    let buttonEle = document.createElement('button');
    buttonEle.innerText = 'Register';

    let divEle = document.createElement('div');
    divEle.classList.add('register');

    divEle.appendChild(nameEle);
    divEle.appendChild(emailEle);
    divEle.appendChild(passwordEle);
    divEle.appendChild(buttonEle);

    rootEle.appendChild(divEle);

    //adding do-register event listern in do register button
    buttonEle.addEventListener('click',function doRegister(){
        const name = nameEle.value;
        const email = emailEle.value;
        const password = passwordEle.value;
        const rqData = {
            'name':name,
            'email':email,
            'password':password
        };
        fetch("http://localhost:8000/v1/employees/register",{
            'method':'POST',
            'credentials':'include',
            'headers':{
                'Content-Type':'application/json'
            },
            'body':JSON.stringify(rqData)

        }).then((data)=>{
          return data.json();
        }).then((data)=>{
          h1Ele=document.createElement('h1');
          if(data.status_code===409){
            h1Ele.innerText=`${data.message}` 
          }
          else{
            h1Ele.innerText=`Hi ${data.user.name} you have been registerd succesfully`
               }
             rootEle.innerHTML=null;
             rootEle.appendChild(h1Ele);
          
        })
    })
});


//show log in UI code

let loginButton = document.getElementById('login');
loginButton.addEventListener('click',()=>{
    let rootEle = document.getElementById('root');
    rootEle.innerHTML="";
    let emailEle = document.createElement('input');
    emailEle.setAttribute('type','email');
    emailEle.setAttribute('name','email');
    emailEle.setAttribute('placeholder','Enter your email');
    emailEle.setAttribute('id','email');

    let passwordEle = document.createElement('input');
    passwordEle.setAttribute('type','password');
    passwordEle.setAttribute('name','password');
    passwordEle.setAttribute('placeholder','Enter your password');
    passwordEle.setAttribute('id','password');

    let buttonEle = document.createElement('button');
    buttonEle.innerText = 'Login';

    let divEle = document.createElement('div');
    divEle.classList.add('login');

    divEle.appendChild(emailEle);
    divEle.appendChild(passwordEle);
    divEle.appendChild(buttonEle);

    rootEle.appendChild(divEle);

    //Adding DO-Login event listner code
    buttonEle.addEventListener('click', function doLogin(){
        const emailId = emailEle.value;
        const pass = passwordEle.value;

        const reqData = {
            'email':emailId,
            'password':pass
        }

        fetch('http://localhost:8000/v1/employees/login',{
            'method':'POST',
            'credentials':'include',
            'headers':{
                'Content-Type':'application/json'
            },
            'body':JSON.stringify(reqData)
        }).then((data)=>{
            return data.json();
        }).then((data)=>{
          h1Ele=document.createElement('h1');
          let rootEle=document.getElementById('root');
          rootEle.innerHTML="";
               if(data.status_code===404){
                    //1.user's email not registered in database
                    h1Ele.innerText=`user is not registered please register`
                    rootEle.appendChild(h1Ele);
                   }else if(data.status_code==400){
                    //2.wrong credentials
                    h1Ele.innerText=`incorrect userid or password` 
                    rootEle.appendChild(h1Ele);
               }else{
                    let loginBtn=document.getElementById('login');
                    loginBtn.style.visibility='hidden';
                    let registerBtn=document.getElementById('register');
                    registerBtn.style.visibility='hidden';

                    let logOutBtn=document.getElementById('logout');
                    logOutBtn.style.visibility='visible';
                    
                   if(data.user.is_admin===true){
                  //3. user is a admin
                    welcomeAdmin(data);
                 }
                   else{
                       //4. USER is an employee
                       welcomeEmployee(data.user);
                    }
                  }
        })
    })


})

let logOutBtn=document.getElementById('logout');
logOutBtn.addEventListener('click',()=>{
  fetch(`http://localhost:8000/v1/employees/logout`,{
       
     'method':'GET',
     'credentials':'include',
     'headers':{
      'content-type':'application/json'
     },
  }).then(data=>{
    return data.json();
  }).then(data=>{
    let loginBtn=document.getElementById('login');
    loginBtn.style.visibility='visible';
    let registerBtn=document.getElementById('register');
    registerBtn.style.visibility='visible';

    let logOutBtn=document.getElementById('logout');
    logOutBtn.style.visibility='hidden';
    let h3Ele=document.createElement('h3');
    h3Ele.innerText=data.message;
    let rootEle=document.getElementById('root');
    rootEle.innerHTML='';
    let reviewContainerDiv=document.getElementById('reviews-container');
    reviewContainerDiv.innerHTML='';
    rootEle.appendChild(h3Ele); 
   // window.alert(data.massege);

  })

})

function welcomeAdmin(loggedinData){
  fetch('http://localhost:8000/v1/employees/all',{
        'method':'GET',
        'credentials':'include',
        'headers':{
            'Content-Type':'application/json'
        },
    }).then((data)=>{
        return data.json();
    }).then((data=>{
        let rootEle = document.getElementById('root');
        rootEle.innerHTML="";
        const empList = data.allEmp;
        for(empObj of empList){
            showEmployeeUtil(empObj, true);
        }
    }))

}

function showEmployeeUtil(empObj,is_admin){ 
  let rootEle = document.getElementById('root');
    let nameEle = document.createElement('label');
    nameEle.innerText = empObj.name;
    nameEle.classList.add('credentials');

    let emailEle = document.createElement('label');
    emailEle.innerText = empObj.email;
    emailEle.classList.add('credentials');

    let roleEle = document.createElement('label');
    roleEle.innerText = empObj.is_admin===true?'Admin':'Employee';
    roleEle.classList.add('btn-field');

    let reviewButton = document.createElement('button');
    reviewButton.innerText = 'Reviews';
    reviewButton.classList.add('btn-field');

    //Adding review listener
    reviewButton.addEventListener('click', (event)=>showReviews(event));

    let divEle = document.createElement('div');
    divEle.classList.add('emp');

    divEle.setAttribute('id',empObj._id.toString());

    divEle.appendChild(nameEle);
    divEle.appendChild(emailEle);
    divEle.appendChild(roleEle);
    divEle.appendChild(reviewButton);
    if(is_admin === true){
        let updateButton = document.createElement('button');
        updateButton.innerText = 'Update';
        updateButton.classList.add('btn-field');

        //Adding update listener
        updateButton.addEventListener('click',updateEmployee);

        let deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.classList.add('btn-field');

        //Adding delete listener
        deleteButton.addEventListener('click', deleteEmployee);
        divEle.appendChild(updateButton);
        divEle.appendChild(deleteButton);
    }
    rootEle.appendChild(divEle);;

}

//welcome Employee function starts here
function welcomeEmployee(empObj){ 
         showEmployeeUtil(empObj);
  //1.employee can see all the review about him
  //2. employee can see all those employees for whom he has been a reviewer 
        //    let rootEle=document.getElementById('root');
        //   let nameEle = document.createElement('label');
        //   nameEle.innerText = empObj.name;
        //   nameEle.classList.add('credentials')

        //   let emailEle = document.createElement('label');
        //   emailEle.innerText = empObj.email;
        //   emailEle.classList.add('credentials')
        //   let roleEle = document.createElement('label');
        //   roleEle.innerText = empObj.is_admin===true?'Admin':'Employee';
        //   roleEle.classList.add('btn-field')

        //   let reviewButton = document.createElement('button');
        //   reviewButton.innerText = 'Reviews';
        //   reviewButton.classList.add('btn-field')

        //   //adding review listener
        // //  reviewButton.addEventListener('click',(event)=>(event)); 
        //   reviewButton.addEventListener('click',(event)=>showReviews(event)); 

        //   // let updateButton = document.createElement('button');
        //   // updateButton.innerText = 'Update';
        //   // updateButton.classList.add('btn-field')
        //   //adding update listener
        //   // updateButton.addEventListener('click',updateEmployee);

        //   // let deleteButton = document.createElement('button');
        //   // deleteButton.innerText = 'Delete';
        //   // deleteButton.classList.add('btn-field')

        //   //adding delete listener
        //   // deleteButton.addEventListener('click', deleteEmployee);

        //   let divEle = document.createElement('div');
        //   divEle.classList.add('emp');
            
        //   divEle.setAttribute('id',empObj._id.toString());

        //   divEle.appendChild(nameEle);
        //   divEle.appendChild(emailEle);
        //   divEle.appendChild(roleEle);
        //   divEle.appendChild(reviewButton);
        //   // divEle.appendChild(updateButton);
        //   // divEle.appendChild(deleteButton);
        //   rootEle.appendChild(divEle);

          let reviewerFor= empObj.reviewer_for;
          for(let empId of reviewerFor){
            fetch(`http://localhost:8000/v1/employees/${empId}`,{

              'method':'GET',
              'headers':{
                'content-type':'application/json'
              },
              'credentials':'include',
              'body':JSON.stringify()
            }).then(data=>{
              return data.json();
            }).then(
              response=>{
                empObj=response.allEmp;
                showEmployeeUtil(empObj,false ); 
        //   let rootEle=document.getElementById('root');
        //   let nameEle = document.createElement('label');
        //   nameEle.innerText = empObj.name;
        //   nameEle.classList.add('credentials')

        //   let emailEle = document.createElement('label');
        //   emailEle.innerText = empObj.email;
        //   emailEle.classList.add('credentials')
        //   let roleEle = document.createElement('label');
        //   roleEle.innerText = empObj.is_admin===true?'Admin':'Employee';
        //   roleEle.classList.add('btn-field')

        //   let reviewButton = document.createElement('button');
        //   reviewButton.innerText = 'Reviews';
        //   reviewButton.classList.add('btn-field')

        //   //adding review listener
        // //  reviewButton.addEventListener('click',(event)=>(event)); 
        //   reviewButton.addEventListener('click',(event)=>showReviews(event)); 

        //   // let updateButton = document.createElement('button');
        //   // updateButton.innerText = 'Update';
        //   // updateButton.classList.add('btn-field')
        //   //adding update listener
        //   // updateButton.addEventListener('click',updateEmployee);

        //   // let deleteButton = document.createElement('button');
        //   // deleteButton.innerText = 'Delete';
        //   // deleteButton.classList.add('btn-field')

        //   // //adding delete listener
        //   // deleteButton.addEventListener('click', deleteEmployee);

        //   let divEle = document.createElement('div');
        //   divEle.classList.add('emp');
            
        //   divEle.setAttribute('id',empObj._id.toString());

        //   divEle.appendChild(nameEle);
        //   divEle.appendChild(emailEle);
        //   divEle.appendChild(roleEle);
        //   divEle.appendChild(reviewButton);
        //   // divEle.appendChild(updateButton);
        //   // divEle.appendChild(deleteButton);
        //   rootEle.appendChild(divEle);
              }
            )
          }

}
function deleteEmployee(event){
  let divEle = event.target.parentElement;
  let id = divEle.id;
  fetch(`http://localhost:8000/v1/employees/delete/${id}`,{
      'method':'DELETE',
      'credentials':'include',
      'headers':{
          'content-cype':'application/json'
      }

  }).then((data)=>{
      return data.json();
  }).then((data)=>{
      let rootEle = document.getElementById('root');
      if(data.status_code===204){
          rootEle.removeChild(divEle)
      }
  }) 
}

 
function updateEmployee(event){
  let clickedDivEle=event.target.parentElement;
  let id=clickedDivEle.id;
  //console.log(id);

  let inputName=document.createElement('input');
  inputName.classList.add('credentials');
  console.log(clickedDivEle.children[0].innerText)
  inputName.setAttribute('value',clickedDivEle.children[0].innerText);

  let inputEmail=document.createElement('input');
  inputEmail.classList.add('credentials');
  inputEmail.setAttribute('value',clickedDivEle.children[1].innerText);

  let inputRole=document.createElement('input');
  inputRole.classList.add('credentials');
  inputRole.setAttribute('value',clickedDivEle.children[2].innerText)

  let reviewButton=document.createElement('button');
  reviewButton.classList.add('btn-field');
  reviewButton.innerText=clickedDivEle.children[3].innerText;
  

  let doneButton=document.createElement('button');
  doneButton.classList.add('btn-field');
  doneButton.innerText='Done';

  //Update data in database
  doneButton.addEventListener('click',()=>{
    let name=inputName.value;
    let email=inputEmail.value;
    let role=inputRole.value;

    let reqData={
      'name':name,
      'email':email,
      'is_Admin':role==='Admin'?true:false
    }
    fetch(`http://localhost:8000/v1/employees/update/${id}`,{
      'creadentials':'include',
      'method':'PUT',
       'headers':{
        'content-type':'application/json'
       },
       body:JSON.stringify(reqData)
    }).then((data)=>{
      return data.json();

    }).then((data)=>{
      
       console.log(data);
        welcomeAdmin();
    })

    }
  )
  
  let deleteButton=document.createElement('button');
  deleteButton.classList.add('btn-field');
  deleteButton.innerText=clickedDivEle.children[5].innerText

  let divEle=document.createElement('div');
  divEle.classList.add('emp');

  divEle.setAttribute('id',id);

  divEle.appendChild(inputName);
  divEle.appendChild(inputEmail);
  divEle.appendChild(inputRole);
  divEle.appendChild(reviewButton);
  divEle.appendChild(doneButton);
  divEle.appendChild(deleteButton);


  let rootEle=document.getElementById('root');
  rootEle.replaceChild(divEle,clickedDivEle);
  
  }

//   //show review function
//   function  showReviews(event){
//     let emp_id = event.target.parentElement.id;
//  // let id = divEle.id;
//    // console.log(event.target.parentElement.id);
//     fetch(`http://localhost:8000/v1/employees/${emp_id }`,{
//       "method":'GET',
//       'credentials':'include',
//       'headers':{
//          'content-type':'application/json'
//       }
//     }).then((data)=>{
//       return data.json();
//     }).then((data)=>{
//           //call whoamI
//           fetch(`http://localhost:8000/v1/employees/whoAmI`,{
//             'method':'GET',
//             "credentials":'include',
//             "headers":{
//               'content-type':'application/json'
//             },
//           }).then((whoamIdata)=>{
//             return whoamIdata.json();
//           }).then((whoamiRes)=>{
//             //call whoami
//             //if your own reviews, show diffrent UI
//             //else shoew diffrent UI
//             if(whoamiRes.user._id.toString()==emp_id){
//               console.log('viewing own view');
//               let reviewArr=data.allEmp.reviews;
//               let id=data.allEmp._id.toString();
//               let name=data.allEmp.name;
//               let email=data.allEmp.email;

//               let nameEle=document.createElement('h3');
//               nameEle.innerText=`Name:${name}`;
//               let emailEle=document.createElement('h3');
//               emailEle.innerText=`Email:${email}`;

//               let sectionEle1=document.createElement('section');
//               sectionEle1.appendChild(nameEle);
//               sectionEle1.appendChild(emailEle);

//                 let rootEle=document.getElementById('root');
//                 rootEle.innerHTML='';
//                  let revewsArr=data.allEmp.review; 
  
//                 for(let review of revewsArr){
//                   let reviewEle=document.createElement('p')
//                   reviewEle.innerText=review.message;

//                   let autherEle=document.createElement('p')
//                   autherEle.classList.add('auther');
//                   fetch(`http://localhost:8000/v1/employees/${review.review_by.toString()}`,{
//                       "credentials":'include'
//                   }).then((data)=>{
//                     return data.json();
//                   }).then((data)=>{
//                   autherEle.innerText=`Review BY:${data.allEmp.name}`;
//                   }) 
//                   autherEle.classList.add('auther');

//                   let divEle=document.createElement('div');
//                   divEle.classList.add('reviews')
//                   divEle.setAttribute('id',review._id.toString());
            
//                   divEle.appendChild(reviewEle);
//                   divEle.appendChild(autherEle);

            
//               // let feedbackMessage = review?.feedback ? review.feedback: null;
//               // if(feedbackMessage == null){
//                 let feedbackbtnEle = document.createElement('button');
//                 feedbackbtnEle.addEventListener('click',()=>addFeedback( review._id.toString()));
//                 feedbackbtnEle.innerText = 'Add-Feddback';
//                 divEle.appendChild(feedbackbtnEle);

//               // }else{  
//               //   let h4Ele = document.createElement('h4');
//               //   h4Ele.innerText = "Employee's Feedback";
//               //   divEle.appendChild(h4Ele);
//               //   let pEle = document.createElement('p');
//               //   pEle.innerText = feedbackMessage;
//               //   divEle.appendChild(pEle);
//               //}
              
//               let reviewContainer=document.getElementById('reviews-container');
//               reviewContainer.appendChild(divEle);
       

//           }
//             }else{
//               console.log("viewing employees review");
//           //let reviewArr=data.allEmp.reviews;
//           let id=data.allEmp._id.toString();
//           let name=data.allEmp.name;
//           let email=data.allEmp.email;

//           let nameEle=document.createElement('h3');
//           nameEle.innerText=`Name:${name}`;

//           let emailEle=document.createElement('h3');
//           emailEle.innerText=`Email:${email}`;

//           let sectionEle1=document.createElement('section');
//           sectionEle1.appendChild(nameEle);
//           sectionEle1.appendChild(emailEle);

//           let textarea=document.createElement('textarea');
//           //  textarea.setAttribute('value','sjdfvnufbvd');
//           textarea.setAttribute('cols','60');
//           textarea.setAttribute('rows','4');
//           textarea.setAttribute('id','input-textarea')

//           let buttonEle=document.createElement('button')
//           buttonEle.innerText='Add-Review'
//           buttonEle.addEventListener('click',(event)=>addReview(event,id));


//             //input field for adding revievwer
//             let reverInputEle=document.createElement('input');
//             reverInputEle.setAttribute('placeholder','Enter Reviewers Email');
//             reverInputEle.setAttribute('type','email');
//             reverInputEle.id='reviewer-input';

//           //add reviewer button
//           let reviewerbuttonEle=document.createElement('button')
//           reviewerbuttonEle.innerText='Add-Reviewer'
//           reviewerbuttonEle.addEventListener('click',(event)=>  addReviewer(id));

//           let sectionEle2=document.createElement('section');
//           sectionEle2.classList.add('right-div')
//           sectionEle2.appendChild(textarea);
//           sectionEle2.appendChild(buttonEle);
//           sectionEle2.appendChild(reverInputEle);
//           sectionEle2.appendChild(reviewerbuttonEle);
        

//           let inputContainerDiv=document.createElement('div');
//           inputContainerDiv.classList.add('review');

//           inputContainerDiv.appendChild(sectionEle1);
//           inputContainerDiv.appendChild(sectionEle2);

//           let rootEle=document.getElementById('root');
//           rootEle.innerHTML='';
//           rootEle.appendChild(inputContainerDiv);
//             console.log(data);
          
//             //show all reviews of employee ASK this to him
//             //so ful review array will come here
//               let revewsArr=data.allEmp.review; 
//               for(let review of revewsArr){
//                 let reviewEle=document.createElement('p')
//                 reviewEle.innerText=review.message;
//                 let autherEle=document.createElement('p')
//                 autherEle.classList.add('auther');
//                 fetch(`http://localhost:8000/v1/employees/${review.review_by.toString()}`,{
//                     "credentials":'include'
//                 }).then((data)=>{
//                   return data.json();
//                 }).then((data)=>{
//                 autherEle.innerText=`Review BY:${data.allEmp.name}`;
//                 }) 
              
//                 autherEle.classList.add('auther');
          
//                 let divEle=document.createElement('div');
//                 divEle.classList.add('reviews')
//                 divEle.setAttribute('id',review._id.toString());
          
//                 divEle.appendChild(reviewEle);
//                 divEle.appendChild(autherEle);
                 
//                 let feedbackMessage = review?.feedback ? review.feedback: null;

//                 if(feedbackMessage != null){
//                     let h4Ele = document.createElement('h4');
//                     h4Ele.innerText = "Employee's Feedback";
//                     divEle.appendChild(h4Ele);
//                     let pEle = document.createElement('p');
//                     pEle.innerText = feedbackMessage;
//                     divEle.appendChild(pEle);
//                 }
//                 ////Delete Button
//                 let btnEle = document.createElement('button');
//                 btnEle.addEventListener('click',(event)=>deleteReview(event, review._id.toString()));
//                 btnEle.innerText = 'Delete';
//                 divEle.appendChild(btnEle);

//                 let updateButtonEle=document.createElement('button');
//                 updateButtonEle.addEventListener('click',()=>updateReview(review._id.toString()))
//                 updateButtonEle.innerText='Update';
        
                
//                 divEle.appendChild(updateButtonEle);

//                 let reviewContainer=document.getElementById('reviews-container');
//                 reviewContainer.appendChild(divEle);
//               }
//             }
//           })
//           //if your own reviews, show diffrent UI
//           //else show diffrent UI



//       // let reviewArr=data.allEmp.reviews;
//       //  let id=data.allEmp._id.toString();
//       //  let name=data.allEmp.name;
//       //  let email=data.allEmp.email;

//       //  let nameEle=document.createElement('h3');
//       //  nameEle.innerText=`Name:${name}`;

//       //  let emailEle=document.createElement('h3');
//       //  emailEle.innerText=`Email:${email}`;

//       //  let sectionEle1=document.createElement('section');
//       //  sectionEle1.appendChild(nameEle);
//       //  sectionEle1.appendChild(emailEle);

//       //  let textarea=document.createElement('textarea');
//       // //  textarea.setAttribute('value','sjdfvnufbvd');
//       //  textarea.setAttribute('cols','60');
//       //  textarea.setAttribute('rows','4');
//       //  textarea.setAttribute('id','input-textarea')

//       //  let buttonEle=document.createElement('button')
//       //  buttonEle.innerText='Add-review'
//       //  buttonEle.addEventListener('click',(event)=>addReview(event,id));


//       //   //input field for adding revievwer
//       //   let reverInputEle=document.createElement('input');
//       //   reverInputEle.setAttribute('placeholder','Enter Reviewers Email');
//       //   reverInputEle.setAttribute('type','email');
//       //   reverInputEle.id='reviewer-input';

//       //  //add reviewer button
//       //  let reviewerbuttonEle=document.createElement('button')
//       //  reviewerbuttonEle.innerText='Add-Reviewer'
//       //  reviewerbuttonEle.addEventListener('click',(event)=>  addReviewer(id));

//       //  let sectionEle2=document.createElement('section');
//       //  sectionEle2.classList.add('right-div')
//       //  sectionEle2.appendChild(textarea);
//       //  sectionEle2.appendChild(buttonEle);
//       //  sectionEle2.appendChild(reverInputEle);
//       //  sectionEle2.appendChild(reviewerbuttonEle);
     

//       //  let inputContainerDiv=document.createElement('div');
//       //  inputContainerDiv.classList.add('review');

//       //  inputContainerDiv.appendChild(sectionEle1);
//       //  inputContainerDiv.appendChild(sectionEle2);

//       //  let rootEle=document.getElementById('root');
//       //  rootEle.innerHTML='';
//       //  rootEle.appendChild(inputContainerDiv);
//       //   console.log(data);
       
//       //    //show all reviews of employee ASK this to him
//       //    //so ful review array will come here
//       //     let revewsArr=data.allEmp.review; 
//       //     for(let review of revewsArr){
//       //       let reviewEle=document.createElement('p')
//       //       reviewEle.innerText=review.message;
//       //       let autherEle=document.createElement('p')
//       //       autherEle.classList.add('auther');
//       //       fetch(`http://localhost:8000/v1/employees/${review.review_by.toString()}`,{
//       //           "credentials":'include'
//       //       }).then((data)=>{
//       //         return data.json();
//       //       }).then((data)=>{
//       //        autherEle.innerText=`Review BY:${data.allEmp.name}`;
//       //       }) 
          
//       //       autherEle.classList.add('auther');
       
//       //       let divEle=document.createElement('div');
//       //       divEle.classList.add('reviews')
//       //       divEle.setAttribute('id',review._id.toString());
       
//       //       divEle.appendChild(reviewEle);
//       //       divEle.appendChild(autherEle);

            
//       //       let btnEle = document.createElement('button');
//       //       btnEle.addEventListener('click',(event)=>deleteReview(event, review._id.toString()));
//       //       btnEle.innerText = 'Delete';
//       //       divEle.appendChild(btnEle);

//       //       let updateButtonEle=document.createElement('button');
//       //       updateButtonEle.addEventListener('click',()=>updateReview(review._id.toString()))
//       //       updateButtonEle.innerText='Update';
    
             
//       //       divEle.appendChild(updateButtonEle);

//       //       let reviewContainer=document.getElementById('reviews-container');
//       //       reviewContainer.appendChild(divEle);
       

//       //     }


       

//      })
//   }
  
  function addReview(event, empId){
  //push review  in to the database
  let textInputAreaEle=document.getElementById('input-textarea');
  let text=textInputAreaEle.value;
  let data={
    'message':text,
    'review_for':empId
  }
  fetch(`http://localhost:8000/v1/reviews/add`,{
  'method':'POST',
  'credentials':'include',
   'headers':{
    'content-type':'application/json'
   },
   'body':JSON.stringify(data)
  }).then((data)=>{
    return data.json();
  }).then((data)=>{
     //console.log(data);
     //show review in UI
     let reviewEle=document.createElement('p')
     reviewEle.innerText=data.review.message;
     let autherEle=document.createElement('p')
     autherEle.classList.add('auther');
     autherEle.innerText=`Review BY: ${data.review.review_by.name}`;

     fetch(`http://localhost:8000/v1/employees/${data.review.review_by.toString()}`,{
      "credentials":'include'
       }).then((data)=>{
        return data.json();
        }).then((data)=>{
       autherEle.innerText=`Review BY :${data.allEmp.name}`;
       })    
     
     let divEle=document.createElement('div');
     divEle.classList.add('reviews')
     divEle.setAttribute('id',data.review._id.toString());

     divEle.appendChild(reviewEle);
     divEle.appendChild(autherEle);
       //delete button
     let btnEle=document.createElement('button');
     btnEle.addEventListener('click',(event)=>deleteReview(event, data.review._id.toString()));
     btnEle.innerText='Delete';
     
      //update button
     let updateButtonEle=document.createElement('button');
     updateButtonEle.addEventListener('click',()=>updateReview(data.review._id.toString()))
     updateButtonEle.innerText='update';
    

     divEle.appendChild(btnEle);
     divEle.appendChild(updateButtonEle);
    


     let reviewContainer=document.getElementById('reviews-container');
     reviewContainer.appendChild(divEle);
     
     
     

  })
  
}
function deleteReview(event, id){
  fetch(`http://localhost:8000/v1/reviews/delete/${id}`,{
      'method':'DELETE',
      'credentials':'include',
      'headers':{
          'content-type':'application/json'
      }
  }).then((data)=>{
      return data.json();
  }).then((data)=>{
      //console.log(data);
      if(data.status_code===204){
          let reviewContainerEle = document.getElementById('reviews-container');
          let deletedChildEle = document.getElementById(id);
          reviewContainerEle.removeChild(deletedChildEle);
      }
  })
}

function addReviewer(id){
  // console.log(id);
   let inputEle=document.getElementById('reviewer-input');
  // console.log(inputEle.value);
  let email=inputEle.value;
  let reqData={
    'id':id,
    'email':email
  }
  fetch(`http://localhost:8000/v1/employees/addReviewer`,{
    'method':'PUT',
    'credentials':'include',
     'headers':{
      'content-type':'application/json'
     },
     'body':JSON.stringify(reqData)

  }).then(data=>{
    return data.json();
  }).then(data=>{
    
  })

}
function updateReview(id){
//console.log(id);
let reviewDiv=document.getElementById(id);
// console.log(reviewDiv);
// console.log(reviewDiv.firstChild);
// console.log(reviewDiv.lastChild);
 let peElemnt=reviewDiv.firstChild;
 let inputEle=document.createElement('input');
 inputEle.value=peElemnt.innerText;
 reviewDiv.replaceChild(inputEle,peElemnt);
 let doneButton=document.createElement('button');
 doneButton.innerText='Done';

 reviewDiv.replaceChild(doneButton,reviewDiv.lastChild);

 doneButton.addEventListener('click', function updatedReviewInDB(){
  let updatedMessage = inputEle.value;
  let reqData={
    'message':updatedMessage,
  };
  fetch(`http://localhost:8000/v1/reviews/update/${id}`,{
      'method':'PUT',
      'credentials':'include',
      'headers':{
        'content-type':'application/json'
      },
     'body':JSON.stringify(reqData)
  }).then(data=>{
      return data.json();
  }).then(data=>{
    let pUpdated=document.createElement('p');
    pUpdated.innerText=data.review.message;
    reviewDiv.replaceChild(pUpdated,inputEle); 
  })
});
}
function addFeedback(id){
  let reviewDiv=document.getElementById(id);
  //console.log(`hey its priting reviewDiv ${reviewDiv}`);
  //reviewDiv.removeChild(reviewDiv.lastChild);
  let textAreaEle=document.createElement('textarea');
  textAreaEle.setAttribute('col','100');
  textAreaEle.setAttribute('row','10');
  reviewDiv.appendChild(textAreaEle);

  let doneButton=document.createElement('button');
  doneButton.innerText='Done';
  reviewDiv.appendChild(doneButton);

  doneButton.addEventListener('click',()=>{
    let feedBackText=textAreaEle.value;
    console.log(feedBackText);

    let reqData={
      'feedback':feedBackText
    }

    fetch(`http://localhost:8000/v1/reviews/feedback/${id}`,{
      'method':'PUT',
      'credentials':'include',
      'headers':{
        'content-type':'application/json'
      },
     'body':JSON.stringify(reqData)
    }).then((promiseData)=>{
      return promiseData.json();
    }).then((responseData)=>{
      //console.log(responseData);

      reviewDiv.removeChild(reviewDiv.lastChild);
      reviewDiv.removeChild(reviewDiv.lastChild);
      reviewDiv.removeChild(reviewDiv.lastChild);

      let h4Ele=document.createElement('h4');
      h4Ele.innerText="Employee's FeedBack";
      reviewDiv.appendChild(h4Ele);

      let pEle=document.createElement('p');
      pEle.innerText=responseData.review.feedback;
      reviewDiv.appendChild(pEle);


    })

  })
}

function initSession(){
   fetch(`http://localhost:8000/v1/employees/whoAmI`,{
    'method':'GET',
    'credentials':'include',
    'headers':{
      'content-type':'application/json'
    }, 
   }).then(promiseObj=>{
    return promiseObj.json();
   }).then(responseData=>{
       if(responseData.status_code===200){
        //hide logi or register button
        let loginButton=document.getElementById('login');
        loginButton.style.visibility='hidden';

        let registerButton=document.getElementById('register');
        registerButton.style.visibility='hidden';

        let logOutBtn=document.getElementById('logout');
        logOutBtn.style.visibility='visible';

        //user is  logged in
         if(responseData.user.is_Admin===true){
         
          welcomeAdmin();

         }else{
          welcomeEmployee(responseData.user);
         }
       }else{
        //user is not logged in
       
        let h3Ele=document.createElement('h3');
        h3Ele.innerText=`WELCOME to ERS homepage, please register or login to use ERS application `;
        let rootEle=document.getElementById('root');
        rootEle.innerHTML='';
        rootEle.appendChild(h3Ele); 
        }
       
   })
} 
initSession();

function showReviews(event){
  let emp_id = event.target.parentElement.id;
  fetch(`http://localhost:8000/v1/employees/${emp_id}`,{
      'method':'GET',
      'credentials':'include',
      'headers':{
          'content-type':'application/json'
      },

  }).then((data)=>{
      return data.json();
  }).then((data)=>{
      //call whoami
      fetch(`http://localhost:8000/v1/employees/whoami`,{
          'method':'GET',
          'credentials':'include',
          'headers':{
              'content-type':'application/json'
          },
      }).then(
          (wmiData)=>{
              return wmiData.json();
          }
      ).then(
          (wmiResp)=>{
              if(wmiResp.user._id.toString() == emp_id){
                  let reviewArr = data.allEmp.reviews;
                  let id = data.allEmp._id.toString();
                  let name = data.allEmp.name;
                  let email = data.allEmp.email;

                  let nameEle = document.createElement('h3');
                  nameEle.innerText = `Name : ${name}`
                  let emailEle = document.createElement('h3');
                  emailEle.innerText = `Email : ${email}`

                  let sectionEle1 = document.createElement('section');
                  sectionEle1.appendChild(nameEle);
                  sectionEle1.appendChild(emailEle);

                  let rootEle = document.getElementById('root');
                  rootEle.innerHTML = '';
                  //show all reviews of employee
                  const revewsArr = data.allEmp.review;
                  for(let review of revewsArr){
                      let reviewEle = document.createElement('p');
                      reviewEle.innerText = review.message;

                      let authorEle = document.createElement('p');
                      authorEle.classList.add('auther');
                      fetch(`http://localhost:8000/v1/employees/${review.review_by.toString()}`,{
                          'credentials':'include'
                      }).then((data)=>{
                          return data.json();
                      }).then((data)=>{
                          authorEle.innerText =`Review By : ${data.employee.name}`;
                      })
                      //authorEle.innerText =`Review By : ${reviewrName}`;
                      authorEle.classList.add('auther');

                      let divEle = document.createElement('div');
                      divEle.classList.add('reviews');
                      divEle.setAttribute('id',review._id.toString());

                      divEle.appendChild(reviewEle);
                      divEle.appendChild(authorEle);

                      let feedbackMessage = review?.feedback ? review.feedback: null;

                      if(feedbackMessage == null){
                          let feedbackBtnEle = document.createElement('button');
                          feedbackBtnEle.addEventListener('click',()=>addFeedback(review._id.toString()));
                          feedbackBtnEle.innerText = 'Add Feedback';
                          divEle.appendChild(feedbackBtnEle);
                      }else{
                          let h4Ele = document.createElement('h4');
                          h4Ele.innerText = "Employee's Feedback";
                          divEle.appendChild(h4Ele);
                          let pEle = document.createElement('p');
                          pEle.innerText = feedbackMessage;
                          divEle.appendChild(pEle);
                      }
                      let reviewContainer = document.getElementById('reviews-container');
                      reviewContainer.appendChild(divEle);
                  }
              }else{
                  let reviewArr = data.employee.reviews;
                  let id = data.employee._id.toString();
                  let name = data.employee.name;
                  let email = data.employee.email;

                  let nameEle = document.createElement('h3');
                  nameEle.innerText = `Name : ${name}`
                  let emailEle = document.createElement('h3');
                  emailEle.innerText = `Email : ${email}`

                  let sectionEle1 = document.createElement('section');
                  sectionEle1.appendChild(nameEle);
                  sectionEle1.appendChild(emailEle);

                  let textAreaEle = document.createElement('textarea');
                  textAreaEle.setAttribute('cols','60');
                  textAreaEle.setAttribute('rows','4');
                  textAreaEle.setAttribute('id', 'input-text-area');
                  
                  let buttonEle = document.createElement('button');
                  buttonEle.innerText = 'Add Review';
                  buttonEle.addEventListener('click',(event)=> addReview(event, id));

                  //input field for adding reviewer
                  let reveInputEle = document.createElement('input');
                  reveInputEle.setAttribute('placeholder', 'Enter reviewer email');
                  reveInputEle.setAttribute('type', 'email');
                  reveInputEle.id = 'reviewer-input';

                  //Add reviewer button
                  let reveButtonEle = document.createElement('button');
                  reveButtonEle.innerText = 'Add Reviewer';
                  reveButtonEle.addEventListener('click',(event)=> addReviewer(id));

                  let sectionEle2 = document.createElement('section');
                  sectionEle2.classList.add('right-review-section');
                  sectionEle2.appendChild(textAreaEle);
                  sectionEle2.appendChild(buttonEle);
                  sectionEle2.appendChild(reveInputEle);
                  sectionEle2.appendChild(reveButtonEle);

                  let inputContainerDiv = document.createElement('div');
                  inputContainerDiv.classList.add('review-input');

                  inputContainerDiv.appendChild(sectionEle1);
                  inputContainerDiv.appendChild(sectionEle2);

                  let rootEle = document.getElementById('root');
                  rootEle.innerHTML = '';
                  rootEle.appendChild(inputContainerDiv);

                  //show all reviews of employee
                  const revewsArr = data.employee.reviews;
                  for(let review of revewsArr){
                      let reviewEle = document.createElement('p');
                      reviewEle.innerText = review.message;

                      let authorEle = document.createElement('p');
                      authorEle.classList.add('auther');
                      fetch(`http://localhost:8000/v1/employees/${review.review_by.toString()}`,{
                          'credentials':'include'
                      }).then((data)=>{
                          return data.json();
                      }).then((data)=>{
                          authorEle.innerText =`Review By : ${data.employee.name}`;
                      })
                      //authorEle.innerText =`Review By : ${reviewrName}`;
                      authorEle.classList.add('auther');

                      let divEle = document.createElement('div');
                      divEle.classList.add('reviews');
                      divEle.setAttribute('id',review._id.toString());

                      divEle.appendChild(reviewEle);
                      divEle.appendChild(authorEle);

                      //showing feedback
                      let feedbackMessage = review?.feedback ? review.feedback: null;

                      if(feedbackMessage != null){
                          let h4Ele = document.createElement('h4');
                          h4Ele.innerText = "Employee's Feedback";
                          divEle.appendChild(h4Ele);
                          let pEle = document.createElement('p');
                          pEle.innerText = feedbackMessage;
                          divEle.appendChild(pEle);
                      }
                      //Delete Button
                      let btnEle = document.createElement('button');
                      btnEle.addEventListener('click',(event)=>deleteReview(event, review._id.toString()));
                      btnEle.innerText = 'Delete';

                      //Update Button
                      //Update Button
                      let updateBtnEle = document.createElement('button');
                      updateBtnEle.addEventListener('click',()=>updateReview(review._id.toString()));
                      updateBtnEle.innerText = 'Update';

                      divEle.appendChild(btnEle);
                      divEle.appendChild(updateBtnEle);

                      let reviewContainer = document.getElementById('reviews-container');
                      reviewContainer.appendChild(divEle);
                  }
              }
          }
      )
  })
}
 