FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8-alpine3.10

# Install Python dependencies management tools
RUN pip install --no-cache-dir pip==21.0.1
RUN pip install --no-cache-dir pip-tools==6.0.1

# Copy list of Python logical dependencies
COPY ./backend/requirements.in /app

# Generate final list of Python dependencies
RUN pip-compile --generate-hashes \
                --output-file=requirements.txt \
                 requirements.in

# Install python dependencies
RUN apk add --no-cache --virtual .build-deps gcc libc-dev make \
    && pip install --no-cache-dir -r requirements.txt \
    && apk del .build-deps gcc libc-dev make

# Install frontend dependencies
RUN apk add nodejs
RUN apk add npm

# Copy project catalog
COPY ./backend /app


# Basic docker setup:
# 
# sudo docker build -t wiki-image .
# sudo docker run -d --name wiki-container -p 80:80 wiki-image
