const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userModel } = require("./auth.model");

exports.registerUser = async (req, res, next) => {
    const {name, email, password} = req.body;
    if(name && email && password){
        try{
            let salt = await bcrypt.genSalt(parseInt(process.env.ENCRYPT_SALT, 10));
            let pwd_hash = await bcrypt.hash(password, salt);
            try{
                let data = await userModel.updateOne({email}, {$set: {...req.body, password: pwd_hash}}, {"upsert": true});
                console.log(data);
                
                if(data.matchedCount === 0 && data.upsertedCount === 1){
                    res.json({message: "User registered", data: {id: data.upsertedId, email}});
                }
                else{
                    next(new Error(`Email already exsists`));    
                }
            }
            catch(e){
                next(new Error(`Database query error ${e.message}`));   
            }            
        }
        catch(e){
            next(new Error(`Password encrypt error: ${e.message}`));
        }
    }
    else{
        next(new Error("Invalid inputs"));
    }
}

exports.loginUser = async (req, res, next) => {
    const {email, password} = req.body;
    if(email && password){
        try{
            let user = await userModel.findOne({email});
            if(user){
                let {name, email} = user;
                try{
                    let pwd_match = await bcrypt.compare(password, user.password);
                    if(pwd_match){
                        
                        let jwt_token = await jwt.sign({name, email}, process.env.JWT_SECRET, {expiresIn: '10m'});
                        res.json({message: "User login success", data: {token: jwt_token}});  
                    }
                    else{
                        next(new Error(`Wrong password`));   
                    }
                }
                catch(e){
                    next(new Error(`Password encrypt error: ${e.message}`));    
                }
            }
            else{
                next(new Error(`Email not registered`));    
            }        
        }
        catch(e){
            next(new Error(`Database query error ${e.message}`));     
        }
    }
    else{
        next(new Error("Invalid inputs"));
    }
}

exports.getUser = async (req, res, next) => {
    const user = req.user;
    //console.log(user);
    if(user){
        try{
            let users = await userModel.find();
            if(users){
                let temp_users = users.map((e) => {
                    return ({
                        id: e._id, name: e.name, email: e.email
                    })
                });
                res.json({message: "Users", data: {users: temp_users, totalUser: users.length}});     
            }
            else{
                next(new Error(`No user registered`));
            }
        }
        catch(e){
            next(new Error(`Database query error ${e.message}`));
        }
    }
    else{
        next(new Error(`Unauthorized access`));    
    }
}

exports.checkAuth = async (req, res, next) => {
    const token = req.headers.authorization;
    if(token){
        try{
            const payload = await jwt.verify(token, process.env.JWT_SECRET);
            req.user = payload;
            next();
        }
        catch(e){
            next(new Error(`JWT verify error ${e.message}`));    
        }
    }
    else{
        next(new Error("Invalid token"));
    }   
}


