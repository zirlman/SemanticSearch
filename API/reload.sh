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

# Stop apache2 because NGINX needs to bind on port 80
# sudo lsof -i:80 # shows processes using the port
sudo service apache2 stop
echo "Apache stopped"
# Start NGINX
sudo /etc/init.d/nginx start
# Start gunicorn
gunicorn --bind 0.0.0.0:5000 app:app --daemon --reload
echo "Gunicorn started"
