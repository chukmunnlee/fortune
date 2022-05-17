ARG VERSION=18

FROM node:${VERSION} as builder

WORKDIR /app

ADD package.json .
ADD package-lock.json .

RUN npm ci

ADD main.js .
ADD assets assets
ADD public public
ADD views views

FROM gcr.io/distroless/nodejs:${VERSION}

COPY --from=builder /app /app

WORKDIR /app

ENV PORT=3000

EXPOSE ${PORT}

CMD [ "main" ]
