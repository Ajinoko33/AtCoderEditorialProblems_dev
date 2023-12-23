DROP TABLE IF EXISTS contests;
CREATE TABLE contests (
  id VARCHAR(255) NOT NULL,
  start_epoch_second BIGINT NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS problems;
CREATE TABLE problems (
  id VARCHAR(255) NOT NULL,
  problem_index INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  difficulty INTEGER,
  contest_id VARCHAR(255) NOT NULL,
  writer VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO contests VALUES
('abc294', 123456),
('abc291', 234567),
('abc296', 345678);
INSERT INTO problems VALUES
('abc294_e', 5, '2xN Grid', 'E. 2xN Grid', 792, 'abc294', 'MMNMM'),
('abc294_f', 6, 'Sugar Water 2', 'F. Sugar Water 2', 1891, 'abc294', 'Nyaan'),
('abc291_f', 6, 'Teleporter and Closed off', 'F. Teleporter and Closed off', 1449, 'abc291', 'mechanicalpencil'),
('abc291_g', 8, 'OR Sum', 'F. OR Sum', 2176, 'abc291', 'mechanicalpencil'),
('abc296_f', 6, 'Simultaneous Swap', 'F. Simultaneous Swap', 1811, 'abc296', 'mechanicalpencil');
