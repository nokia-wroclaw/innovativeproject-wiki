FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8-alpine3.10

# Create project catalogs
RUN mkdir /app/backend && \
    mkdir /app/frontend

# Install Python dependencies management tools
RUN pip install --no-cache-dir pip==21.0.1 && \
    pip install --no-cache-dir pip-tools==6.0.1

# Copy list of Python logic dependencies
COPY ./backend/requirements.in /app/backend

# Generate final list of Python dependencies
RUN pip-compile --generate-hashes \
                --output-file=/app/backend/requirements.txt \
                 /app/backend/requirements.in

# Install Python dependencies
RUN apk add --no-cache --virtual .build-deps gcc libc-dev make \
    && pip install --no-cache-dir -r /app/backend/requirements.txt \
    && apk del .build-deps gcc libc-dev make

# Copy list of Node dependencies
COPY ./frontend/package.json /app/frontend
COPY ./frontend/package-lock.json /app/frontend

# Install frontend dependencies
RUN apk add --no-cache nodejs npm
WORKDIR /app/frontend
RUN npm install && \
    npm install -g serve

# Copy app code and create build
COPY . /app
RUN npm run build
RUN rm -rf node_modules

# App setup manual:
# 
# sudo docker build -t wiki-image .
# sudo docker run -d -it -p 80:80 -p 3000:3000 --name wiki-container wiki-image:latest
# sudo docker exec -it wiki-container serve -s build -l 3000
