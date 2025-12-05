-- Создание таблиц для системы образования

-- Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher')),
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица классов (1-4 класс)
CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    grade_number INTEGER NOT NULL CHECK (grade_number >= 1 AND grade_number <= 4),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    UNIQUE(grade_number)
);

-- Таблица предметов
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(50)
);

-- Таблица учебных групп/классов учителя
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES users(id),
    grade_id INTEGER REFERENCES grades(id),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица учеников в классах
CREATE TABLE class_students (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id),
    student_id INTEGER REFERENCES users(id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, student_id)
);

-- Таблица задач/заданий
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    grade_id INTEGER REFERENCES grades(id),
    subject_id INTEGER REFERENCES subjects(id),
    page_number INTEGER,
    task_number VARCHAR(50),
    difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    explanation TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица видеоуроков
CREATE TABLE videos (
    id SERIAL PRIMARY KEY,
    grade_id INTEGER REFERENCES grades(id),
    subject_id INTEGER REFERENCES subjects(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    duration INTEGER,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица решений учеников
CREATE TABLE solutions (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id),
    user_id INTEGER REFERENCES users(id),
    user_answer TEXT,
    is_correct BOOLEAN,
    solved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица отзывов
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX idx_tasks_grade_subject ON tasks(grade_id, subject_id);
CREATE INDEX idx_tasks_page_number ON tasks(page_number);
CREATE INDEX idx_videos_grade_subject ON videos(grade_id, subject_id);
CREATE INDEX idx_solutions_user ON solutions(user_id);
CREATE INDEX idx_class_students_student ON class_students(student_id);

-- Вставка данных для классов
INSERT INTO grades (grade_number, name, description) VALUES
(1, '1 класс', 'Первый класс начальной школы'),
(2, '2 класс', 'Второй класс начальной школы'),
(3, '3 класс', 'Третий класс начальной школы'),
(4, '4 класс', 'Четвёртый класс начальной школы');

-- Вставка предметов
INSERT INTO subjects (name, icon, color) VALUES
('Математика', 'Calculator', 'blue'),
('Русский язык', 'BookOpen', 'green'),
('Литература', 'Library', 'purple'),
('История', 'Scroll', 'orange');