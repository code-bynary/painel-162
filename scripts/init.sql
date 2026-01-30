CREATE DATABASE IF NOT EXISTS pw_auth;
CREATE DATABASE IF NOT EXISTS pw_users;

USE pw_auth;

CREATE TABLE IF NOT EXISTS users (
    ID int(11) NOT NULL AUTO_INCREMENT,
    name varchar(32) NOT NULL DEFAULT '',
    passwd varchar(64) NOT NULL DEFAULT '',
    email varchar(64) NOT NULL DEFAULT '',
    qq varchar(32) NOT NULL DEFAULT '',
    is_admin int(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (ID),
    UNIQUE KEY name (name)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO users (name, passwd, email, is_admin) VALUES 
('admin', MD5('admin'), 'admin@example.com', 1),
('player', MD5('player'), 'player@example.com', 0);

USE pw_users;

-- Future tables for user data
CREATE TABLE IF NOT EXISTS characters (
    id int(11) NOT NULL AUTO_INCREMENT,
    userid int(11) NOT NULL,
    roleid int(11) NOT NULL DEFAULT '0',
    name varchar(32) NOT NULL DEFAULT '',
    cls int(11) NOT NULL DEFAULT '0',
    gender int(11) NOT NULL DEFAULT '0',
    spouse int(11) NOT NULL DEFAULT '0',
    level int(11) NOT NULL DEFAULT '0',
    level2 int(11) NOT NULL DEFAULT '0',
    hp int(11) NOT NULL DEFAULT '0',
    mp int(11) NOT NULL DEFAULT '0',
    status int(11) NOT NULL DEFAULT '1',
    delete_time int(11) NOT NULL DEFAULT '0',
    create_time int(11) NOT NULL DEFAULT '0',
    lastlogin_time int(11) NOT NULL DEFAULT '0',
    posx float NOT NULL DEFAULT '0',
    posy float NOT NULL DEFAULT '0',
    posz float NOT NULL DEFAULT '0',
    worldtag int(11) NOT NULL DEFAULT '0',
    reputation int(11) NOT NULL DEFAULT '0',
    PRIMARY KEY (id),
    KEY userid (userid),
    KEY roleid (roleid)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Mock Characters for admin (user_id 1)
INSERT INTO characters (userid, roleid, name, cls, level, gender, reputation) VALUES 
(1, 1024, 'AdminChar', 0, 100, 0, 5000), -- Blademaster (WR)
(1, 1025, 'Healer', 1, 80, 1, 2000);  -- Wizard (MG)

-- Donation Tables
CREATE TABLE IF NOT EXISTS donate_packages (
    id int(11) NOT NULL AUTO_INCREMENT,
    name varchar(64) NOT NULL,
    price decimal(10,2) NOT NULL,
    gold int(11) NOT NULL,
    bonus int(11) NOT NULL DEFAULT '0',
    image_url varchar(255) DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS donate_transactions (
    id varchar(64) NOT NULL,
    userid int(11) NOT NULL,
    package_id int(11) NOT NULL,
    status varchar(16) NOT NULL DEFAULT 'pending', -- pending, approved, delivered, cancelled
    gateway varchar(16) NOT NULL DEFAULT 'mock',
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY userid (userid)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Mock Packages
INSERT INTO donate_packages (name, price, gold, bonus) VALUES 
('Pacote Iniciante', 10.00, 1000, 0),
('Pacote Aventureiro', 30.00, 3000, 150),
('Pacote Veterano', 50.00, 5000, 500),
('Pacote Lendário', 100.00, 10000, 1500);
