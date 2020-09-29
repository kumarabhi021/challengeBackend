# utubecommentBackend

will take the input youtube live video and keywords for comments as input and output : Only those comments will be sent to frontend which contain the sent keywords as provided in the input.
if no keyword provided, the program will return all the values.

# how to run 
1. clone the repository to your local system.
2. In the Project Directory, Run the command : 
   npm install
3. In the project Directory, create a ".env" file.
4. Edit the ".env" file with below information : 
   api_key=[provide the api_key as shared over Email]
   example , for reference only : 
   api_key=FSqbISpAhQazxswDfe4QSLP8QPIu42NH2kLuQ8
5. Save ".env" file.
6. To run the backend, run the below command in the project directory : 
   node server.js
7. you should get a message in the console : 
   " server started on 8080"
8. Go to Browser and hit "http://localhost:8080/"
   " hello world" should be displayed.
   this confimrs the server is up and running. 
9. Data polling rate is set at 5000 milli secs.   


# Pre-requisites :
1. the .env file should have api_key mentioned.
2. this program runs on 8080, make sure the 8080 port is free, or else you can se the port by providng the port number in the ".env" file, example : PORT = 5000 , to run it on port number 5000


# important points :
1. data polling rate is @ 5000 milli secs. 

