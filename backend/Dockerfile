FROM mariadb:latest

ADD /scripts/sql/ /docker-entrypoint-initdb.d

ENV MYSQL_ROOT_PASSWORD=dev_test_mariadb
ENV MYSQL_DATABASE=forumnet

RUN apt-get update && apt-get -y install vim

EXPOSE 3306

CMD ["mariadb"]