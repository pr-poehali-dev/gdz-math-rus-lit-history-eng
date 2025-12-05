-- Таблица для учебников и библиотеки
CREATE TABLE textbooks (
    id SERIAL PRIMARY KEY,
    grade_id INTEGER REFERENCES grades(id),
    subject_id INTEGER REFERENCES subjects(id),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    publisher VARCHAR(255),
    year INTEGER,
    cover_url VARCHAR(500),
    file_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_textbooks_grade_subject ON textbooks(grade_id, subject_id);
CREATE INDEX idx_textbooks_year ON textbooks(year);