FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8-alpine3.10

# Copy project catalog
WORKDIR /app
COPY . .

# Install Python dependencies management tools
RUN pip install --no-cache-dir pip==21.0.1
RUN pip install --no-cache-dir pip-tools==6.0.1

# Generate list of Python dependencies
WORKDIR /app/backend
RUN pip-compile --generate-hashes \
                --output-file=requirements.txt \
                 requirements.in

# Install Python dependencies
RUN apk add --no-cache --virtual .build-deps gcc libc-dev make \
    && pip install --no-cache-dir -r requirements.txt \
    && apk del .build-deps gcc libc-dev make

# Install frontend dependencies
WORKDIR /app/frontend
RUN apk add nodejs
RUN apk add npm

# Docker setup manual:
# 
# sudo docker build -t wiki-image .
# sudo docker run -d --name wiki-container -p 80:80 wiki-image
