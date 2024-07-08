import pool from '../../config/connectDB';
exports.showLogin = async(req,res) =>{
    res.render("auth/login");
  }
exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    if (email && password) {
        let [user] = await pool.execute('Select * from users where email = ? ', [email]);
        console.log(user.length);
        if(!user.length){
            res.redirect('login');
        }
        else{
            
                req.session.loggedin = true;
                req.session.user = user[0];
                
                res.redirect('/');
            // bcrypt.compare(password, user[0].pass, (err, result) => {
            //     if (result == true) {

            //     } else {
            //         // A user with that email address does not exists
            //         const conflictError = 'User credentials are not valid.';
            //         res.render('auth/login', { email, password, conflictError });
            //     }
            // })
        }
    } else {
        // A user with that email address does not exists
        const conflictError = 'User credentials are not valid.';
        res.render('auth/login', { email, password, conflictError });
    }
}

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) res.redirect('/404');
        res.redirect('/');
    })
}