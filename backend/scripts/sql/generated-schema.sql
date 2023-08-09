set names utf8mb4;
set foreign_key_checks = 0;

create table `forum` (`id` varchar(255) not null, `name` varchar(255) not null, `description` varchar(255) not null, `creation_date` datetime not null, `owner` varchar(255) null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;

create table `category` (`id` varchar(255) not null, `name` varchar(255) not null, `forum_id` varchar(255) not null, `parent_category_id` varchar(255) null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;
alter table `category` add index `category_forum_id_index`(`forum_id`);
alter table `category` add index `category_parent_category_id_index`(`parent_category_id`);

create table `forum_role` (`id` varchar(255) not null, `name` varchar(255) not null, `description` varchar(255) not null, `forum_id` varchar(255) not null, `precedence` int not null, `can_view_posts` tinyint(1) not null, `can_view_replies` tinyint(1) not null, `can_post` tinyint(1) not null, `can_reply` tinyint(1) not null, `can_hide_post` tinyint(1) not null, `can_hide_reply` tinyint(1) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;
alter table `forum_role` add index `forum_role_forum_id_index`(`forum_id`);

create table `link` (`forum_user` varchar(255) not null, `link` varchar(255) not null, primary key (`forum_user`)) default character set utf8mb4 engine = InnoDB;

create table `user` (`id` varchar(255) not null, `identifier` varchar(255) not null, `password` varchar(255) not null, `role` tinyint not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;

create table `forum_user` (`id` varchar(255) not null, `associated_user_id` varchar(255) not null, `forum_id` varchar(255) not null, `role_id` varchar(255) not null, `display_name` varchar(255) not null, `biography` varchar(255) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;
alter table `forum_user` add index `forum_user_associated_user_id_index`(`associated_user_id`);
alter table `forum_user` add index `forum_user_forum_id_index`(`forum_id`);
alter table `forum_user` add index `forum_user_role_id_index`(`role_id`);

create table `post` (`id` varchar(255) not null, `title` varchar(255) not null, `body` varchar(255) not null, `category_id` varchar(255) not null, `forum_id` varchar(255) not null, `author_id` varchar(255) not null, `hidden` tinyint(1) not null default false, `creation_date` datetime not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;
alter table `post` add index `post_category_id_index`(`category_id`);
alter table `post` add index `post_forum_id_index`(`forum_id`);
alter table `post` add index `post_author_id_index`(`author_id`);

alter table `category` add constraint `category_forum_id_foreign` foreign key (`forum_id`) references `forum` (`id`) on update cascade;
alter table `category` add constraint `category_parent_category_id_foreign` foreign key (`parent_category_id`) references `category` (`id`) on update cascade on delete set null;

alter table `forum_role` add constraint `forum_role_forum_id_foreign` foreign key (`forum_id`) references `forum` (`id`) on update cascade;

alter table `forum_user` add constraint `forum_user_associated_user_id_foreign` foreign key (`associated_user_id`) references `user` (`id`) on update cascade;
alter table `forum_user` add constraint `forum_user_forum_id_foreign` foreign key (`forum_id`) references `forum` (`id`) on update cascade;
alter table `forum_user` add constraint `forum_user_role_id_foreign` foreign key (`role_id`) references `forum_role` (`id`) on update cascade;

alter table `post` add constraint `post_category_id_foreign` foreign key (`category_id`) references `category` (`id`) on update cascade;
alter table `post` add constraint `post_forum_id_foreign` foreign key (`forum_id`) references `forum` (`id`) on update cascade;
alter table `post` add constraint `post_author_id_foreign` foreign key (`author_id`) references `forum_user` (`id`) on update cascade;

set foreign_key_checks = 1;

[32m[39m
