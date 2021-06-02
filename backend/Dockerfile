FROM python:3.9-alpine3.13

# Create app directory
RUN mkdir -p /app

# Install Python dependency manager (Poetry)
RUN apk add curl
RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | POETRY_HOME=/opt/poetry python && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false

# Copy list of Python dependencies
WORKDIR /app
COPY ./poetry.lock ./pyproject.toml ./

# Install Python dependencies
RUN apk add --no-cache --virtual .build-deps gcc libc-dev make \
    && poetry install --no-root \
    && apk del .build-deps gcc libc-dev make

# Copy backend files and run app
COPY . ./
EXPOSE 80
CMD ["uvicorn", "app.main:app", "--host=0.0.0.0", "--port=80", "--root-path /api"]

# Manual setup
# sudo docker build . -t backend-image
# sudo docker run -p 80:80 --name backend-container backend-image:latest

# uvicorn app.main:app --host=0.0.0.0 --port=3001 --root-path /api