-- Изменяем ограничение на классы
ALTER TABLE grades DROP CONSTRAINT grades_grade_number_check;
ALTER TABLE grades ADD CONSTRAINT grades_grade_number_check CHECK (grade_number >= 1 AND grade_number <= 11);

-- Добавление новых предметов
INSERT INTO subjects (name, icon, color) VALUES
('Геометрия', 'Triangle', 'indigo'),
('Алгебра', 'Sigma', 'blue'),
('Физика', 'Zap', 'yellow'),
('Химия', 'Flask', 'green'),
('Биология', 'Leaf', 'emerald'),
('География', 'Globe', 'teal'),
('Английский язык', 'Languages', 'pink'),
('Финский язык', 'MessageSquare', 'cyan'),
('ИЗО', 'Palette', 'orange'),
('Труд', 'Wrench', 'amber'),
('ОБЖ', 'Shield', 'red'),
('Физкультура', 'Dumbbell', 'lime'),
('Черчение', 'Ruler', 'slate'),
('Экология', 'TreePine', 'green'),
('Окружающий мир', 'Earth', 'sky'),
('МХК', 'Landmark', 'violet');

-- Добавление новых классов (5-11)
INSERT INTO grades (grade_number, name, description) VALUES
(5, '5 класс', 'Пятый класс средней школы'),
(6, '6 класс', 'Шестой класс средней школы'),
(7, '7 класс', 'Седьмой класс средней школы'),
(8, '8 класс', 'Восьмой класс средней школы'),
(9, '9 класс', 'Девятый класс средней школы'),
(10, '10 класс', 'Десятый класс старшей школы'),
(11, '11 класс', 'Одиннадцатый класс старшей школы');

-- Таблица для групп классов (сообщества)
CREATE TABLE class_groups (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для постов в группах
CREATE TABLE group_posts (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES class_groups(id),
    author_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для подготовки к ЕГЭ/ОГЭ
CREATE TABLE exam_prep (
    id SERIAL PRIMARY KEY,
    exam_type VARCHAR(20) CHECK (exam_type IN ('ege', 'oge')),
    subject_id INTEGER REFERENCES subjects(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    difficulty VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы
CREATE INDEX idx_exam_prep_type ON exam_prep(exam_type);
CREATE INDEX idx_group_posts_group ON group_posts(group_id);
CREATE INDEX idx_class_groups_class ON class_groups(class_id);