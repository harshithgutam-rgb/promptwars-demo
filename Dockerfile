# Use official lightweight Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application files
COPY . .

# Expose the port (Cloud Run defaults to 8080)
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
