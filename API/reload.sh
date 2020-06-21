#!/bin/bash

# Update repo
git pull

# Kill running gunicorn processes
pids=(`ps aux | grep gunicorn | awk '{print $2}'`)
echo "PIDS: ${pids}"

for pid in ${pids}
do
	kill -9 ${pid}
	echo "Kiled ${pid}"
done

# Restart NGINX
#sudo /etc/init.d/nginx restart
# Start gunicorn
gunicorn --bind 0.0.0.0:5000 app:app --daemon --reload
echo "Gunicorn started"
