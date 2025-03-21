### STAGE 1: Build ###

# We label our stage as 'builder'
FROM node:22-alpine as builder

COPY package*.json ./

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i --legacy-peer-deps && mkdir /ng-app && cp -R ./node_modules ./ng-app

WORKDIR /ng-app

COPY . .

## Build the angular app in production mode and store the artifacts in dist folder
RUN NODE_OPTIONS="--max-old-space-size=4096 --openssl-legacy-provider" npm run build


### STAGE 2: Setup ###

FROM nginx:stable-alpine

## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /ng-app/dist/browser /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
