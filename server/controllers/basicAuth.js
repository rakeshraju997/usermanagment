const mysql = require('mysql');

exports.authUser = () => {

    return(req, res, next) => {
        session = req.session;      
        let userRole = session.userid;
        if(userRole){
            next()
        }else{
            res.render('loginrequired');
            // return res.status(401).json("You Need to login");
        }
        

    }
}

exports.authUserRole = (permissions) => {

    return(req, res, next) => {
        session = req.session;     
        let userRole = session.role;
        if(permissions.includes(userRole)){
            next()
        }else{
            res.render('403');
            // return res.status(401).json("You dont have permission");
        }
        

    }
}
