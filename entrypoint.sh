#!/bin/bash
if [ ! -f /debug0 ]; then
  while getopts 'rhd' flag; do
    case "${flag}" in
      r)
        pip3 install six
        pip3 install -r requirements.txt --ignore-installed

        touch /debug0
        ;;
      h)
        echo "options:"
        echo "-h        show brief help"
        echo "-d        debug mode, no nginx or uwsgi, direct start with 'python app.py'"
        exit 0
        ;;
      d) touch /debug1 ;;
      *) break ;;
    esac
  done
fi

if [ -e /debug1 ]; then
  echo "Running app in debug mode!"
  export FLASK_APP=/backend/app.py
  export FLASK_DEBUG=1
  flask run --host=0.0.0.0 --port=8000 --with-threads
else
  echo "Running app in production mode!"
  nginx && uwsgi --ini /uwsgi.ini --master
fi
