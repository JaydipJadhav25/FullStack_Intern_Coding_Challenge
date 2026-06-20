const authService = require('../services/authService');


//signup user
async function signup(req, res, next) {
   const { name, email, password, address } = req.body;
   console.log("user data : " ,  name, email, password, address );
  try {
    const { user, token } = await authService.signup({ name, email, password, address });

    console.log("user data : ", user , token);

    res.status(201).json({ user, token });


  } catch (err) {
    next(err);
  }
}


//user login 
async function login(req, res, next) {
  try {
    const { user, token } = await authService.login(req.body);
    res.status(200).json({ user, token });
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    const result = await authService.changePassword(req.user.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login, changePassword };
