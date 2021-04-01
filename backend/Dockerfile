FROM python:3.9-slim

# Install Python dependency manager (Poetry)
RUN apt-get update && apt-get -y install curl
RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | POETRY_HOME=/opt/poetry python && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false

# Copy list of Python dependencies
WORKDIR /app
COPY ./poetry.lock ./pyproject.toml ./

# Install Python dependencies
RUN poetry install --no-root

# Copy backend code and run server
COPY . ./
EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host=0.0.0.0", "--reload"]

# MANUAL
# sudo docker build -t inner-docs-backend .
# sudo docker run -p 8000:8000 --name backend-container inner-docs-backend:latest