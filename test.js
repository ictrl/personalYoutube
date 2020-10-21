
in vs code 
	check project structure as webhook

  check project is working on local host perfectly

changes in webhook.js (main file /app.js)
const path = require('path'); //install path module

//add this block to server front end from build file in production, paste this above app.listen block
if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}


const port = process.env.PORT || 4000; / /replace your port nubmber, in app.listen

  add Procfile in project directory
  in Pocfile add 'web: node app.js' <replace app.js with main js file>
  in package.json add
    "engines": {
    "node": "12.x"
  }
  
  ##in package.json add heroku postbuild command
    "heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm run build --prefix client"
  
  git add .
  git commit -m "add Procfile"
  git push

###install heroku cli

type in integrated terminal

 heroku login
 heroku create
 git push heroku master //deploy master branch to heroku,
 // if want to deploy different branch  use==>  git push heroku <different branch name>:master
 
 heroku config:set <ENVIRONMENT_VARIABLE=VALUE> 
 heroku ps:scale web=1 
 heroku open
 wait for 5 min
 done