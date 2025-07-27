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
