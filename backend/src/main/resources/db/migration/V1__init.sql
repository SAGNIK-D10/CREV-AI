CREATE TABLE users (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  username    VARCHAR(50)  NOT NULL UNIQUE,
  email       VARCHAR(100) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT       NOT NULL,
  language      VARCHAR(30)  NOT NULL,
  code_hash     VARCHAR(64)  NOT NULL,
  code_snippet  TEXT,
  score         INT          NOT NULL,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE review_issues (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  review_id    BIGINT       NOT NULL,
  line_number  INT,
  severity     ENUM('critical','warning','info') NOT NULL,
  title        VARCHAR(200) NOT NULL,
  description  TEXT,
  suggestion   TEXT,
  FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
);

CREATE TABLE rate_limit_log (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT   NOT NULL,
  hit_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_time (user_id, hit_at)
);
