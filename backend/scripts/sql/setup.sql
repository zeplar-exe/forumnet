# MySql

CREATE DATABASE IF NOT EXISTS forumnet;
USE forumnet

CREATE TABLE IF NOT EXISTS user(
    id VARCHAR(36) PRIMARY KEY NOT NULL,
    identifier TEXT NOT NULL,
    password TEXT NOT NULL,
    role INT NOT NULL
);

CREATE TABLE IF NOT EXISTS forum(
    id VARCHAR(36) PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    creation_date DATETIME NOT NULL,
    owner VARCHAR(36) NOT NULL
);

CREATE TABLE IF NOT EXISTS forum_user(
    id VARCHAR(36) PRIMARY KEY NOT NULL,
    associated_user VARCHAR(36) NOT NULL,
    forum VARCHAR(36) NOT NULL,
    display_name TEXT NOT NULL,
    biography TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS post(
    id VARCHAR(36) PRIMARY KEY NOT NULL,
    forum VARCHAR(36) NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    category TEXT NOT NULL,
    author_forum_user VARCHAR(36) NOT NULL,
    creation_ate DATETIME NOT NULL
);