docker stop forumnet_mariadb
docker rm forumnet_mariadb
docker run --name forumnet_mariadb -e MYSQL_ROOT_PASSWORD=just_mariadb -e MYSQL_DATABASE=forumnet -v "/$(dirname "$0"):/home/scripts" -p 3306:3306 -d mariadb

echo "Press any key to exit..."
read -n 1 -s