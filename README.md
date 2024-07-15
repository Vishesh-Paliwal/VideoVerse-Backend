# ABOUT THE PROJECT :

  > This repo contains backend for VideoVerse .

  > Functionalities Supporeted are :

   * All API calls are authenticated

   * Allows user to upload videos with configurable limits of size and duration

   * Allow trimming a video

   * Allow merging video clips

   * Allow link sharing with time based expiry (customizable)

  > Tech Stack :

   * Node and express for backend

   * sqlite for database

   * fluent-ffmpeg for video processing

   * jest for unit testing



# SET-UP GUIDE FOR VideoVerse-Backend

* Requirements :
    > IDE
    
    > NODE
     
    > NPM

STEP 1 :

  * Fork and Clone the repo in your disered location
  * open it in the IDE of your choice
  * run npm install 
  * now run node server.js to start server at localhost:3000

  ![Screenshot from 2024-07-15 14-28-25](https://github.com/user-attachments/assets/4e3c0a8d-3245-4eec-aa00-97ed421a858d)


STEP 2:

  * Generate a token to be able to use api , it is valid for 200 h (set by default to make it serve like static token , you may change it as per your need)
    
  * run this to generate token :
    
        curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"username":"admin", "password":"password"}'

NOW ALL THE API DOCUMENTATION IS DONE VIA SWAGGER AND CAN BE EASILY FOUND AT : http://localhost:3000/api-docs

YOU CAN RUN ALL TESTS USING :

        npm test
