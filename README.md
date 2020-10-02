#Fauci's Goons Hackathon App

##This application is designed to run on AWS's Elastic Beanstalk service. Node.js is used to run an Express application which can serve the frontend static files as well as API endpoints if needed. The Gulp library is used to build the Angular application and pair it with the backend files into a build folder. 


#Prerequisites:
## Prerequisites to run locally 
Node.js latest stable version (v12): https://nodejs.org/en/download/
NPM (comes with Node.js)

## Prerequisites to deploy to AWS
AWS CLI: https://aws.amazon.com/cli/
Elasic Beanstalk CLI: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install-windows.html


##Getting Started Locally:

1) Copy and rename the sample.env to .env and in this file, set the "ENV" value to the environment you wish to deploying to 

2) Run 'npm install' in the root directory

3) Also run 'npm install' inside the "frontend" directory if it doesn't have a "node_modules" directory already.

3) Then navigate back to the root directory and run the command 'gulp'

4) If there are no errors after the gulp script executes, then there should be a new folder in the "builds" folder with the name "{ENV}-build"

5) To test the application locally, navigate to the "backend" folder inside the new build folder using the command prompt (I.E "cd ./builds/dev-build/backend")

6) Then run 'npm install' inside this folder

7) After installing dependencies, run the 'npm run start' command

8) If there are no errors, you should see this message: "Server listening on the port::8080"

9) Using your browser, navigate to "localhost:8080". You should see the application's landing page


##Deploying to Elastic Beanstalk:

There are 2 ways to deploy the application to an environment in Elastic Beanstalk at this point.

1) The gulp script should have also created a .zip file in the new build folder that was created. With this file, you can easily deploy/update an environment using the AWS Console. More information about this process can be found here: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/GettingStarted.CreateApp.html
If deploying a new application, make sure to choose the Node.js platform

2) If using the Elastic Beanstalk CLI, then the application can be deployed using that CLI with certain deploy commands within the new build folder. More information on that can be found here:
https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-configuration.html

