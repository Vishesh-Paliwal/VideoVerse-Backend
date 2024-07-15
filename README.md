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

STEP 3:

  * Now for all the api calls add header to them :

            Authorization : Your generated token

   Upload Video :

   > Post request at http://localhost:3000/upload

   > Body : form -data , (key : video , value: select video)

  ![Screenshot from 2024-07-15 15-13-58](https://github.com/user-attachments/assets/b1634a74-279d-47fd-8551-abb615aedd07)


   Merge Video :

   > Post request at http://localhost:3000/merge

   > Additional Header : Content-Type : application/json

   > Body : {
              "videoIds": [1, 2]
            }

  ![Screenshot from 2024-07-15 15-32-45](https://github.com/user-attachments/assets/cfeb0d17-c765-4b61-b330-294f90462897)


   Trim Video :

   > Post request at http://localhost:3000/trim

   > Additional Header : Content-Type : application/json

   > Body :{
  "videoId" : 1,
  "startTime":3,
  "endTime":10
}

  ![Screenshot from 2024-07-15 15-47-51](https://github.com/user-attachments/assets/ed4d9b03-7b92-496f-91a3-50194e9de035)



YOU CAN RUN ALL TESTS USING :

        npm test

![Screenshot from 2024-07-15 14-46-42](https://github.com/user-attachments/assets/f0d8a866-084d-490b-95e6-c4580c532bf1)

 
