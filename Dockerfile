# syntax=docker/dockerfile:1

FROM python:3.11-bullseye

WORKDIR /linguaaudiredocker

COPY requirements.txt /linguaaudiredocker/requirements.txt
RUN pip3 install -r requirements.txt

COPY . .
# ADD languages .

RUN dir

EXPOSE 80
ENV FLASK_APP=start.py
CMD ["waitress-serve", "--port", "8080", "--host", "0.0.0.0", "--call", "backend.api:create_app"]