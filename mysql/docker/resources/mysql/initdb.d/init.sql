SET NAMES utf8mb4;

create table sample1(
    id int auto_increment,
    col1 text,
    col2 text,
    primary key (id)
);

insert into sample1(col1, col2)values('aaa', '1111');
insert into sample1(col1, col2)values('bbb', '2222');
insert into sample1(col1, col2)values('ccc', '3333');
insert into sample1(col1, col2)values('ddd', '4444');
