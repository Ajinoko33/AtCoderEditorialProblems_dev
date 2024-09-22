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
