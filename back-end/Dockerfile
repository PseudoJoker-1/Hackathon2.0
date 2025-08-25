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
