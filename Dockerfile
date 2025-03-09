FROM denoland/deno:alpine

# Set working directory
WORKDIR /app

# Copy dependency lock file if you have one
COPY deno.lock* .
# Copy application source
COPY . .

# Cache the dependencies
RUN deno cache main.ts

# Expose the port
EXPOSE 8000

# Run the application
CMD ["deno", "run", "dev"]
