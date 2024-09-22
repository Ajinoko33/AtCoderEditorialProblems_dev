DROP TABLE IF EXISTS contests;
CREATE TABLE contests (
  id VARCHAR(255) NOT NULL,
  start_epoch_second BIGINT NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS problems;
CREATE TABLE problems (
  id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  difficulty INTEGER,
  is_experimental BOOLEAN NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS editorials;
CREATE TABLE editorials (
  problem_id VARCHAR(255) NOT NULL,
  writer VARCHAR(255) NOT NULL,
  is_official BOOLEAN NOT NULL,
  PRIMARY KEY (problem_id, writer, is_official)
);

DROP TABLE IF EXISTS contests_problems;
CREATE TABLE contests_problems (
  contest_id VARCHAR(255) NOT NULL,
  problem_id VARCHAR(255) NOT NULL,
  problem_index VARCHAR(255) NOT NULL,
  PRIMARY KEY (contest_id, problem_index)
);

INSERT INTO contests VALUES
('abc294', 123456),
('abc291', 234567),
('abc296', 345678);
INSERT INTO problems VALUES
('abc294_e', '2xN Grid', 'E. 2xN Grid', 792, false),
('abc294_f', 'Sugar Water 2', 'F. Sugar Water 2', 1891, true),
('abc291_f', 'Teleporter and Closed off', 'F. Teleporter and Closed off', 1449, false),
('abc291_g', 'OR Sum', 'G. OR Sum', 2176, false),
('abc296_f', 'Simultaneous Swap', 'F. Simultaneous Swap', 1811, false);
INSERT INTO editorials VALUES
('abc294_e', 'MMNMM', true),
('abc294_f', 'Nyaan', false),
('abc291_f', 'mechanicalpencil', true),
('abc291_g', 'mechanicalpencil', false),
('abc296_f', 'mechanicalpencil', true);
INSERT INTO contests_problems VALUES
('abc294', 'abc294_e', 'E'),
('abc294', 'abc294_f', 'F'),
('abc291', 'abc291_f', 'F'),
('abc291', 'abc291_g', 'G'),
('abc296', 'abc296_f', 'F');
