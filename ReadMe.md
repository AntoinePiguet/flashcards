if you have docker desktop installed on your computer, 
1) open a BASH terminal with a path going to /AdonisCode
2) run command: ./docker-start.sh
it will create the containers, install the dependencies, do the migrations and start the server on localhost:3333


///these lines are deprecated please check upper lines

0. open a terminal with a path going to /AdonisCode (if you dont have nodeJS, install it and refer to node documentation for the nodeJS installation)
1. run command: docker compose up -d
2. run command: npm i
3. run command: node ace migration:fresh
4. run command: node ace db:seed
5. run command: npm run dev
6. go to http://localhost:3333/ for the website
7. go to http://localhost:8081/ for the db on PhpMyAdmin
///
