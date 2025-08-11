#Use Node.js base image
FROM node:18

#Set working directory
WORKDIR /app

#Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

#Install the nodemon globally for hot-reloading
RUN npm install -g nodemon

# #Build the app
# RUN npm run build

#Copy the rest of the app
COPY . .

# Ensure environment variables are available during build
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN npm run prisma:generate

#Expose the port used by the app
EXPOSE 3000

#Command to run the app
CMD ["npm", "start"]