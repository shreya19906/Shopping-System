 //here we are not setting up any other instance of passport ...the instance of passport 
//congiguration we set up is valid for this instance also
var passport =require('passport');
var User=require('../models/users');
var LocalStrategy=require('passport-local').Strategy;

//configure passport
passport.serializeUser((user,done)=>{
    //the call back function takes care that when a user needs to be stored in the session with the help of session id
    //done returns null(no error) after successfully storing the user in the session    
    done(null,user.id);
});
passport.deserializeUser((id,done)=>{
   //retrives the user from the session with the help of id and return using done
   User.findById(id,(err,user)=>{
       done(err,user);
   })

});
//passport startegy (create a user during signup) 
passport.use('local-signup',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true // pass the req to the call back function
},
    (req,email,password,done)=>{
         
        //validate the passed parameteres if they are correct or not or password is long enough
        req.checkBody('email','Invalid Email').notEmpty().isEmail();
        req.checkBody('password','Invalid Password').notEmpty().isLength({min:4});
        var errors=req.validationErrors();
        if(errors){
            var messages =[]
            errors.forEach((error)=>{
                messages.push(error.msg);
            });
            return done(null,false,req.flash('error',messages));

        }

            
        


        //we are creating a new user based on the credentials provided at the time of signup
         //if the credentials are found in the database then a new user could not be created

            User.findOne({'email':email},(err,user)=>{
                if(err)
                return done(err);

                //if email is found in database return with no new User
                if(user)
                return done(null,false,{message:'Email already in use'})

                //create new User and save the credentials in database
                var newUser=new User();
                newUser.email=email;
                newUser.password=newUser.encryptPassword(password);
                newUser.save((err,result)=>{
                    if(err) return done(err);
                    return done(null,newUser)
                })

             })

}))


//passport startegy ( during signin) 
passport.use('local-sign_in',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true // pass the req to the call back function
},
    (req,email,password,done)=>{
         
        //validate the passed parameteres if they are correct or not or password is long enough
        req.checkBody('email','Invalid Email').notEmpty().isEmail();
        req.checkBody('password','Invalid Password').notEmpty().isLength({min:4});
        var errors=req.validationErrors();
        if(errors){
            var messages =[]
            errors.forEach((error)=>{
                messages.push(error.msg);
            });
            return done(null,false,req.flash('error',messages));

        }

            
        


        //we are creating a new user based on the credentials provided at the time of signup
         //if the credentials are found in the database then a new user could not be created

            User.findOne({'email':email},(err,user)=>{
                if(err)
                return done(err);

                //if email is found in database return with no new User
                if(!user)
                return done(null,false,{message:'No User Found!!'})

                //match the password with the encrypted password in the database
                if(!user.validPassword(password)){
                    return done(null,false,{message:'Wrong Password!!'})   
                }

             //now return the found user 
             return done(null,user);
                

             })

}))


