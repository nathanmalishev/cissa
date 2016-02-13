# cissa flappy bird

So i started out a bit of a repo here, basically the game is working (just scrapped that shit of some one elses repo). But im trying to hack together like a sign up & then scoreboard.

As it is sign up is going alright, can't play the game until you do it. There is no checking of details though.

Then after you play the game you submit your results to the server where it stores it basically in a hash on studentId's. If the person keeps on playing the server will only update that hash if the score is higher.

then on '/scoreboard' i want to render the highest 5 scores and the names associated. this is were i was getting to but got to tired. Will have to add the ability to delete users that get to this page as they could register with a slanderous name or some bs

Looking rough around the edges, but most of the functionality is there to be honest.

** HOW TO INSTALL **

install npm
install node
then run in projects base folder
npm install

then run
node server.js   or    nodemon server.js

