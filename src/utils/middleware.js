const userAuth = function(req,res,next){
    console.log('User authentication started.')
    const token = 'xyz'
    const isUserAuthenticated = token === 'xyz'
    if(!isUserAuthenticated){
        res.status(401).send("Unauthorized User.")
    }
    else{
        next();
    }
}
const adminAuth = function(req,res,next){
    console.log('Admin authentication started.')
    const token = 'xyz'
    const isAdminAuthenticated = token === 'xyz'
    if(!isAdminAuthenticated){
        res.status(401).send("Unauthorized Admin.")
    }
    else{
        next();
    }
}

module.exports = {
    userAuth,
    adminAuth
}