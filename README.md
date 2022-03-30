
# Simple Web File Manager

It's a simple web file manager created for simple upload directories and files or sharing
file between computers.




## Tech Stack

**Frontend:** React

**Backend:** Python 3.9, fastAPI  


## Run Locally

Clone the project

```bash
  git clone https://github.com/n2oneProgrammer/webFileManager.git
```

Go to the project directory

```bash
  cd webFileManager
```

### Run Backend

Go to server directory

``` bash
  cd backend
```
Install dependencies

```bash
  pip install -r requirenments.txt
```

Set environment variable
```bash
  export NODE_ENV=production
  export ADMIN_PASS_SHA256=XXXX
  export ADMIN_LOGIN=XXXX
  export SECRET_KET=XXXXX
```
``` batch
  set NODE_ENV=production
  set ADMIN_PASS_SHA256=XXXX
  set ADMIN_LOGIN=XXXX
  set SECRET_KET=XXXXX
```
Start the server

```bash
  uvicorn main:app --host 0.0.0.0 --port 8000
```

### Run Frontend

Go to Frontend directory

``` bash
  cd frontend
```
Install dependencies

```bash
  npm install
```

Start the frontend server

```bash
  npm run dev
```


## Deployment

To deploy this project run
On Linux
```bash
  source build.sh
```
On Windows
``` batch
  .\build.bat
```

