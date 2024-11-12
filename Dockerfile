FROM node:latest as node
WORKDIR /app

RUN npm install -g @angular/cli

COPY ./package.json .
RUN npm install -g gulp
COPY . .
RUN yarn install
#RUN ng build --configuration production
RUN gulp build && ng build --configuration production
FROM nginx as runtime
#COPY --from=build /app/dist/MyAngularApp /usr/share/nginx/html
#COPY ./dist /usr/share/nginx/html
COPY --from=node /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
	
#FROM nginx:latest
#COPY ./dist /usr/share/nginx/html