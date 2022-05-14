let express = require('express');
let router = express.Router();
let OpenAIApi = require('openai');
let passport = require('passport');
let DB = require('../config/db');
let userModel = require('../models/users');
let User = userModel.User;
let question = require('../models/questions')
require('dotenv').config();
const configuration = new OpenAIApi.Configuration({
    user:'Juan Sebastian Galvis Chaves',
    apiKey: process.env['OPEN_API_KEY'],
});
const openai = new OpenAIApi.OpenAIApi(configuration);

function requireAuth(req, res, next) {
  // check if the user is logged in H
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
}
/* GET home page. */
router.get('/', function(req, res, next) {
  
  (async () => {
    const input = req.query.inputText
    const tool = req.query.tool
    let response = '';
    if(input == undefined){
      response = ''
    }
    else{
        response = await openai.createCompletion("text-curie-001",{
        prompt: input,
        max_tokens: 256
      })
    }
    question.find((err, questions) => {
      if (err) {
        return console.error(err);
      } else{
        console.log(questions)
        res.render('home', { 
          title: 'Answer generation tool',
          response: (response == '') ? '': response.data.choices[0].text,
          question: (input == undefined) ? '' : input,
          tool: tool,
          questions: questions,
          displayName: req.user ? req.user.displayName : "" 
        });
      }
    })
  })();
});

/*GET login page*/
router.get('/login', function(req, res, next) {
  if(!req.user)
  {
      res.render('login', 
      {
         title: "Login",
         messages: req.flash('loginMessage'),
         displayName: req.user ? req.user.displayName : '' 
      })
  }
  else
  {
      return res.redirect('/');
  }
}
);
 /*POST login page */
 router.post('/login', function(req, res, next) {
  passport.authenticate('local',
  (err, user, info) => {
      // server err?
      if(err)
      {
          return next(err);
      }
      // is there a user login error?
      if(!user)
      {
          req.flash('loginMessage', 'Authentication Error');
          return res.redirect('/login');
      }
      req.login(user, (err) => {
          // server error?
          if(err)
          {
              return next(err);
          }

          return res.redirect('/');
      });
  })(req, res, next);
});

/*GET register page*/
router.get('/register', function(req, res, next) {
  // check if the user is not already logged in
  if(!req.user)
  {
      res.render('register',
      {
          title: 'Register',
          messages: req.flash('registerMessage'),
          displayName: req.user ? req.user.displayName : ''
      });
  }
  else
  {
      return res.redirect('/');
  }
});

/* GET Route for processing the register page.*/
router.post('/register', function(req, res, next) {
  // instantiate a user object
  let newUser = new User({
      username: req.body.username,
      displayName: req.body.displayName
  });

  User.register(newUser, req.body.password, (err) => {
      if(err)
      {
          console.log("Error: Inserting New User");
          if(err.name == "UserExistsError")
          {
              req.flash(
                  'registerMessage',
                  'Registration Error: User Already Exists!'
              );
              console.log('Error: User Already Exists!')
          }
          return res.render('register',
          {
              title: 'Register',
              messages: req.flash('registerMessage'),
              displayName: req.user ? req.user.displayName : ''
          });
      }
      else
      {
          return passport.authenticate('local')(req, res, () => {
              res.redirect('/')
          });
      }
  });
});
/*GET Logout */
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});
/*GET Delete question*/
router.get("/delete/:id", requireAuth, (req, res, next) => {
  let id = req.params.id;
  question.remove({ _id: id }, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      res.redirect("/");
    }
  });
});
router.post('/', requireAuth,(req,res,next) => {
  
  let newQuestion = question({
    Username: req.user.id,
    ToolUsed:req.body.toolUsed,
    Question: req.body.questionText,
    Answer: req.body.responseText
  })

  question.create(newQuestion, (err, question) => {
    if(err){
      console.log(err);
      res.end(err);
    }
    else{
      res.redirect('/')
    }
  })
});
module.exports = router;
