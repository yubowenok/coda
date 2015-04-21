

SOURCE ../../db/init_db.sql

INSERT INTO `languages` (name)
  VALUES ('C++');
  
INSERT INTO `checkers` (id, code, language_id)
  VALUES(1000, 'DEFAULT', 0);

INSERT INTO `problems` (id, name, version, code, test_num, time_limit, memory_limit, checker_id)
  VALUES
    (1000, 'Test Problem', 1, 'TEST', 3, 1000, 65536, 1000);

INSERT INTO `submissions` (user_id, problem_id, language_id)
  VALUES
    ('yubowenok', 1000, 0),  # ac
    ('yubowenok', 1000, 0),  # wa
    ('yubowenok', 1000, 0),  # tle
    ('yubowenok', 1000, 0),  # re
    ('yubowenok', 1000, 0);  # ce


INSERT INTO `judge_queue` (submission_id)
SELECT id FROM submissions
