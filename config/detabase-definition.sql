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
