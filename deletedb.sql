
--to run these sql statements, nav to the root dir of project and type
--"psql -f deletedb.sql baz"

--to get into psql you must first change the linux user from "vagrant" to "postgres" via :  "$ sudo su postgres"

-- then "psql"  --> viola

-- then connect to the database via: $ \c baz

-- now you see: baz=#

-- start entering sql statements

-- baz=# selct * from blocks;

drop table youser cascade;
-- drop table "order" cascade;
drop table category cascade;
drop table item cascade;
drop table message cascade;
drop table inventory cascade;
drop table patient cascade;
drop table parent cascade;
--drop table appointment cascade;
drop table code cascade;
drop table status cascade;
drop table template cascade;
drop table appliedtemplate cascade;
drop table chair cascade;
drop table block cascade;
drop table schedule cascade;
drop table sequence cascade;
drop table day cascade;
drop table templateblock cascade;
-- drop table buyerreview cascade;
-- drop table sellerreview cascade;
-- drop table itemreview cascade;


CREATE TABLE youser (
  id SERIAL PRIMARY KEY,
  email varchar(255),
  password varchar(255),
  alias varchar(255)
);

CREATE TABLE category (
  id SERIAL PRIMARY KEY,
  name varchar(255)
);

CREATE TABLE item (
  id SERIAL PRIMARY KEY,
  name varchar(255),
  description varchar(255),
  price varchar(255),
  image varchar(255),
  authorId INTEGER,
  sku varchar(255),
  quantity INTEGER,
  category INTEGER REFERENCES category
);

CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  quantity INTEGER,
  itemId INTEGER REFERENCES item
);

CREATE TABLE message (
  id SERIAL PRIMARY KEY,
  recipent INTEGER REFERENCES youser,
  author INTEGER REFERENCES youser,
  content TEXT,
  created_at TIMESTAMPTZ 
);

CREATE TABLE patient (
  id SERIAL PRIMARY KEY,
  firstname varchar(255),
  lastname varchar(255),
  dob varchar(255),
  created_at TIMESTAMPTZ,
  status varchar(255),
  next_code varchar(255) 
);

CREATE TABLE parent (
  id SERIAL PRIMARY KEY,
  youserid INTEGER REFERENCES youser,
  patientid INTEGER REFERENCES patient,
  created_at TIMESTAMPTZ 
);

CREATE TABLE code (
  id SERIAL PRIMARY KEY,
  name varchar(255),
  description varchar(255),
  duration INTEGER,
  active varchar,
  color varchar
);

CREATE TABLE appointment (
  id SERIAL PRIMARY KEY,
  author INTEGER REFERENCES youser,
  patientid INTEGER REFERENCES patient,
  date_time TIMESTAMPTZ,
  duration INTEGER,
  acode INTEGER REFERENCES code,
  result varchar(255),
  created_at TIMESTAMPTZ 
);

CREATE TABLE status (
  id SERIAL PRIMARY KEY,
  name varchar(255),
  description varchar(255)
);

CREATE TABLE chair (
  id SERIAL PRIMARY KEY,
  name varchar(255),
  alias varchar(255)
);

CREATE TABLE block (
  id SERIAL PRIMARY KEY,
  name varchar,
  description varchar,
  duration INTEGER,
  active varchar,
  color varchar
);

CREATE TABLE codeblock (
  id SERIAL PRIMARY KEY,
  blockid INTEGER REFERENCES block,
  codeid INTEGER REFERENCES code
);

CREATE TABLE template (
  id SERIAL PRIMARY KEY,
  name varchar(255),
  description varchar(255),
  active varchar(255),
  color varchar
);

CREATE TABLE templateblock (
  id SERIAL PRIMARY KEY,
  blockid INTEGER REFERENCES block,
  templateid INTEGER REFERENCES template,
  starttime INTEGER,
  chair INTEGER REFERENCES chair,
  color varchar
);


CREATE TABLE appliedtemplate (
  id SERIAL PRIMARY KEY,
  templateid INTEGER REFERENCES template,
  day TIMESTAMPTZ
);

CREATE TABLE sequence (
  id SERIAL PRIMARY KEY,
  name varchar,
  description varchar,
  blocks JSON
);

CREATE TABLE day (
  id SERIAL PRIMARY KEY,
  name varchar,
  description varchar,
  chairs JSON
);

CREATE TABLE schedule (
  id SERIAL PRIMARY KEY,
  name varchar,
  description varchar,
  duration INTEGER,
  proc_codes JSON,
  daytime TIMESTAMPTZ,
  chairid INTEGER,
  patientid INTEGER
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY
);

INSERT INTO youser(email,password) VALUES('Reising@Orthodontics','bcr0072');
INSERT INTO youser(email,password) VALUES('a@','a');
INSERT INTO youser(email,password) VALUES('b@','b');
INSERT INTO category(name) VALUES('Sourdough');
INSERT INTO item(name,description,price,authorId,sku,category,quantity) VALUES('Walnut Sourdough','Savory walnut sourdough bread','$10.50','1','6sd7f8s78','1','23');
INSERT INTO item(name,description,price,authorId,sku,category,quantity) VALUES('Cranberry raisin','Cranberries and walnut with rosemary bread','$12.50','1','6ddddddd78','1','36');
INSERT INTO patient(firstName,lastName,dob) VALUES('Jimmy','Jones','01-05-1970');
INSERT INTO patient(firstName,lastName,dob) VALUES('Jim','Morrison','02-06-1965');
INSERT INTO parent(youserId, patientId) VALUES(3,1);
INSERT INTO parent(youserId, patientId) VALUES(3,2);

INSERT INTO appointment(author,patientid, date_time, duration, result) VALUES(1,2,'Mon May 18 2017 08:52:43',3600000,'sjdlfkjds');
INSERT INTO appointment(author,patientid, date_time, duration, result) VALUES(2,1,'Mon May 18 2017 09:52:43',3600000,'sjdlfkjds');

INSERT INTO code(name, description,duration) VALUES('Consultation','New patient appointment.',45);
INSERT INTO code(name, description,duration) VALUES('Impress one arch','Impress one arch (not expander',30);
INSERT INTO code(name, description,duration) VALUES('Impress two arch','Impress two arch (not expander', 45);
INSERT INTO code(name, description, duration) VALUES('impress RPE','Fit bands and impress for expander',45);
INSERT INTO code(name, description, duration) VALUES('del RPE','Deliver expander',45);
INSERT INTO code(name, description,duration) VALUES('Bond Comp1','Initial comp bonding one arch',60);
INSERT INTO code(name, description,duration) VALUES('Bond Comp2','Initial comp bonding two arch',120);
INSERT INTO code(name, description,duration) VALUES('Bond Int1','Initial int bonding one arch',60);
INSERT INTO code(name, description,duration) VALUES('Bond Int2','Initial int bonding two arch',90);
INSERT INTO code(name, description,duration) VALUES('Bond Lim1','Initial Lim bonding one arch',60);
INSERT INTO code(name, description,duration) VALUES('Bond Lim2','Initial Lim bonding two arch',90);

INSERT INTO code(name, description,duration) VALUES('45 Adjust','45 minute adjustment',45);
INSERT INTO code(name, description,duration) VALUES('30 Adjust','45 minute adjustment',30);
INSERT INTO code(name, description,duration) VALUES('60 Adjust','45 minute adjustment',60);

INSERT INTO code(name, description,duration) VALUES('Ret check','Check retainer',15);
INSERT INTO code(name, description, duration) VALUES('Repair fixed ret','Repair ONE fixed retainer.',30);
INSERT INTO code(name, description,duration) VALUES('del one fixed ret','del ONE fixed retainer.',45);
INSERT INTO code(name, description,duration) VALUES('del two fixed ret','del two fixed retainers.',60);
INSERT INTO code(name, description,duration) VALUES('del one rem ret','del ONE rem retainer.',15);
INSERT INTO code(name, description,duration) VALUES('del two rem ret','del two rem retainer.',20);
INSERT INTO code(name, description,duration) VALUES('del one rem Aligner','del ONE rem Aligner',30);
INSERT INTO code(name, description, duration) VALUES('del two rem Aligner','del two rem Aligner',45);
INSERT INTO code(name, description,duration) VALUES('debond short','Debond: zero or one removable ret delivery',45);
INSERT INTO code(name, description,duration) VALUES('debond long','Debond: comp2 or two removable ret delivery',60);



INSERT INTO block(name, description, duration, color) VALUES('Adjustment','Regular adjustment',45,'#ffff00');
INSERT INTO block(name, description, duration, color) VALUES('Bonding','Full 2 arch bonding',90,'#00cc66');
INSERT INTO block(name, description, duration, color) VALUES('Consultation','New patient consult/exam',30,'#3399ff');

INSERT INTO template(name, description, active, color) VALUES('Mondays','Template for Mondays','true','3399ff');
INSERT INTO template(name, description, active, color) VALUES('Tues/Thurs','Template for Tuesdays and Thursdays','true','00cc66');
INSERT INTO template(name, description, active, color) VALUES('Fridays','Template for Fridays','true','ffff00');




INSERT INTO status(name, description) VALUES('New Patient','Consultation not completed');
INSERT INTO status(name, description) VALUES('Limbo','Consult completed but not completed appliance delivery appointment.');
INSERT INTO status(name, description) VALUES('Comp1','In treatment comprehensive one arch.');
INSERT INTO status(name, description) VALUES('Comp2','In treatment comprehensive two arch.');
INSERT INTO status(name, description) VALUES('Comp2exp','In treatment comprehensive two arch plus expander.');
INSERT INTO status(name, description) VALUES('Lim1','In treatment Limited one arch.');
INSERT INTO status(name, description) VALUES('Lim2','In treatment Limited two arch.');
INSERT INTO status(name, description) VALUES('Inter1','In treatment Interceptive one arch.');
INSERT INTO status(name, description) VALUES('Inter2','In treatment Interceptive two arch.');
INSERT INTO status(name, description) VALUES('Inter1exp','In treatment Interceptive one arch plus exapnder.');
INSERT INTO status(name, description) VALUES('Inter2exp','In treatment Interceptive two arch plus exapnder.');
INSERT INTO status(name, description) VALUES('Pending Comp','Completed interceptive treatment and now waiting for comprehensive.');
INSERT INTO status(name, description) VALUES('Finished','Completed definitive treatment, no further treatment planned.');
INSERT INTO status(name, description) VALUES('Financial pause','Temporarily paused active treatment due to non-payment.');

INSERT INTO chair(name) VALUES('1');
INSERT INTO chair(name) VALUES('2');
INSERT INTO chair(name) VALUES('3');
INSERT INTO chair(name) VALUES('4');
INSERT INTO chair(name) VALUES('5');
INSERT INTO chair(name) VALUES('7');
INSERT INTO chair(name) VALUES('8');
INSERT INTO chair(name) VALUES('9');
INSERT INTO chair(name) VALUES('10');
INSERT INTO chair(name) VALUES('11');
INSERT INTO chair(name) VALUES('12');
INSERT INTO chair(name) VALUES('13');
INSERT INTO chair(name) VALUES('14');
INSERT INTO chair(name) VALUES('15');
-- INSERT INTO chair(name) VALUES('16');
-- INSERT INTO chair(name) VALUES('17');
-- INSERT INTO chair(name) VALUES('18');
-- INSERT INTO chair(name) VALUES('19');
-- INSERT INTO chair(name) VALUES('20');
-- INSERT INTO chair(name) VALUES('21');
-- INSERT INTO chair(name) VALUES('22');
-- INSERT INTO chair(name) VALUES('23');
-- INSERT INTO chair(name) VALUES('24');
-- INSERT INTO chair(name) VALUES('25');
-- INSERT INTO chair(name) VALUES('26');
-- INSERT INTO chair(name) VALUES('27');
-- INSERT INTO chair(name) VALUES('28');
-- INSERT INTO chair(name) VALUES('29');
-- INSERT INTO chair(name) VALUES('30');
-- INSERT INTO chair(name) VALUES('31');
-- INSERT INTO chair(name) VALUES('32');
-- INSERT INTO chair(name) VALUES('33');
-- INSERT INTO chair(name) VALUES('34');
-- INSERT INTO chair(name) VALUES('35');
-- INSERT INTO chair(name) VALUES('36');
-- INSERT INTO chair(name) VALUES('37');
-- INSERT INTO chair(name) VALUES('38');
-- INSERT INTO chair(name) VALUES('39');
-- INSERT INTO chair(name) VALUES('40');




