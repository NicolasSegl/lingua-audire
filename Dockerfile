# syntax=docker/dockerfile:1

FROM python:3.11-bullseye

WORKDIR /linguaaudiredocker

COPY requirements.txt /linguaaudiredocker/requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 5000
ENV FLASK_APP=start.py
CMD ["flask", "--app", "start", "run", "--host", "0.0.0.0"]