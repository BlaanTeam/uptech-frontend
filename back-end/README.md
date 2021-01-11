# UpTech back-end

This is the back-end of UpTech social media website

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install all dependencies.

```bash
npm i --save
```

After installing all dependencies, you must create a new file `.env` and put inside it the following.

```env
ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=27017
DB_USER=DB USER
DB_PASS=DB PASS
DB_NAME=DB NAME

DB_HOST_PRODUCTION=xxxxcluster.xxxxx..net
DB_PORT_PRODUCTION=27017
DB_USER_PRODUCTION=DB USER
DB_PASS_PRODUCTION=DB PASS
DB_NAME_PRODUCTION=DB NAME

JWT_ACCESS_TOKEN_SECRET_KEY=supre-secret-key-here
JWT_REFRESH_TOKEN_SECRET_KEY=supre-secret-key-here
JWT_CONFIRMATION_SECRET_KEY=supre-secret-key-here
JWT_FORGOR_PASSWORD_SECRET_KEY=supre-secret-key-here

MAIL_SMTP_HOST=smtp.xxx.com
MAIL_SMTP_PORT=2525
MAIL_SMTP_USER=SMTP USER
MAIL_SMTP_PASS=SMTP PASS
MAIL_SMTP_SENDER=MAIL SENDER
USE_TLS=false

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASS=REDIS PASS
```

Note: change all the above with your credentials.

## Running

In case you wanna run the script :

```sh
npm start
```
