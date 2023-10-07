create TABLE users (
	id int PRIMARY KEY AUTO_INCREMENT,
	firstName varchar(32),
	lastName varchar(32),
	email varchar(64),
	hash varchar(255),
	updatedAt datetime,
	createdAt datetime
)

CREATE TABLE tokens (
	id int PRIMARY KEY AUTO_INCREMENT,
	userId int,
	refreshToken varchar(250),
	expiresIn varchar(64),
	updatedAt datetime,
	createdAt datetime,
	FOREIGN KEY (userId) REFERENCES Users(id)
)