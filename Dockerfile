# Use an official Node.js runtime as a parent image with Node.js 19
FROM node:19

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose a port for the microservice to listen on (if applicable)
EXPOSE 3000

# Define the command to run your microservice
CMD ["npm", "start"]