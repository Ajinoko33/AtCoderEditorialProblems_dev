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
  index_sort_num INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  difficulty INTEGER,
  contest_id VARCHAR(255) NOT NULL,
  writer_id INTEGER NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS problem_index_sort;
CREATE TABLE problem_index_sort (
  sort_num INTEGER NOT NULL,
  problem_index VARCHAR(255) NOT NULL,
  PRIMARY KEY (sort_num)
);
INSERT INTO problem_index_sort VALUES
(1, 'A'),
(2, 'B'),
(3, 'C'),
(4, 'D'),
(5, 'E'),
(6, 'F'),
(7, 'F2'),
(8, 'G'),
(9, 'H'),
(10, 'Ex'),
(99999, 'OTHER');
