DROP TABLE IF EXISTS writers;
CREATE TABLE writers (
  id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS contests;
CREATE TABLE contests (
  id VARCHAR(255) NOT NULL,
  start_epoch_second BIGINT NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS problems;
CREATE TABLE problems (
  id VARCHAR(255) NOT NULL,
  index_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  difficulty INTEGER,
  contest_id VARCHAR(255) NOT NULL,
  writer_id INTEGER NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS problem_index;
CREATE TABLE problem_index (
  id INTEGER NOT NULL,
  problem_index VARCHAR(255) NOT NULL,
  sort_order INTEGER NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO writers VALUES
(1, 'writer1'),
(2, 'writer2'),
(3, 'writer3');
INSERT INTO contests VALUES
('abc001', 123456),
('abc002', 234567),
('abc003', 345678);
INSERT INTO problems VALUES
('abc001_a', 1, 'hello world', 'A. hello world', 100, 'abc001', 1),
('abc002_a', 1, 'next world', 'A. next world', 200, 'abc002', 2),
('abc002_b', 2, 'last world', 'B. last world', 300, 'abc002', 3);
INSERT INTO problem_index VALUES
(1, 'A', 1),
(2, 'B', 2),
(3, 'C', 3),
(4, 'D', 4),
(5, 'E', 5),
(6, 'F', 6),
(7, 'F2', 7),
(8, 'G', 8),
(9, 'H', 9),
(10, 'Ex', 10),
(99999, 'OTHER', 99999);
