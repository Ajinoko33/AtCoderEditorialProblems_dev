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
  problem_index VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  is_experimental BOOLEAN NOT NULL,
  difficulty INTEGER,
  contest_id VARCHAR(255) NOT NULL,
  writer_id INTEGER NOT NULL,
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
('abc001_a', 'A', 'hello world', 'A. hello world', TRUE, 100, 'abc001', 1),
('abc002_a', 'A', 'next world', 'A. next world', TRUE, 200, 'abc002', 2),
('abc002_b', 'B', 'last world', 'B. last world', FALSE, 300, 'abc002', 3);
