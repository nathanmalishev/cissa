# cissa flappy bird

Things to be done
  - Aesthitics
    - Render dashboards properly through mustache
  - Compatibility
    - Iphone 5 safari ios9.3
    - Samsumg internet app
  - Pagination
    - Admin page, shows first 100 users. no pagination 
    - Scoreboard, shows only first 10 users. no pagination. maybe search feature
  - Production
      - minify and bundle js/css etc

Things to check out if you haven't
  /scoreboard - takes you to public scoreboard
  /admin - takes you to admin dashboard, user:cissa, password:cissasisters
  /admin/student/:id - the id param takes in a student id and returns there dets

  

** HOW TO INSTALL **

install npm
install node
then run in projects base folder
npm install

then run
node server.js   or    nodemon server.js


also in server.js if you want to run it lcoal you will have to switch out
url with local_url in the database call

To push to production use ```git push heroku prodcution:master```

