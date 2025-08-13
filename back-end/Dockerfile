<<<<<<< HEAD
# Use official Python image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the whole backend folder
COPY . /app/

# Collect static files (if any)
RUN python manage.py collectstatic --noinput

# Start with gunicorn
CMD ["gunicorn", "Hackathon.wsgi:application", "--bind", "0.0.0.0:$PORT"]
=======
FROM python:3.10

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app
COPY . /app

RUN pip install --upgrade pip
RUN pip install -r requirements.txt
COPY db.sqlite3 /app/db.sqlite3
RUN python manage.py collectstatic --noinput

CMD gunicorn Hackathon.wsgi:application --bind 0.0.0.0:$PORT
>>>>>>> 5663f63 (Added a lot of things)
