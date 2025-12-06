-- Add ratings table for solutions
CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    solution_id INTEGER NOT NULL,
    user_email VARCHAR(255),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ratings_solution_id ON ratings(solution_id);
CREATE INDEX idx_ratings_user_email ON ratings(user_email);

-- Add puzzles table for rebus
CREATE TABLE IF NOT EXISTS puzzles (
    id SERIAL PRIMARY KEY,
    grade_id INTEGER REFERENCES grades(id),
    subject_id INTEGER REFERENCES subjects(id),
    puzzle_type VARCHAR(50) DEFAULT 'rebus',
    puzzle_image_url TEXT,
    puzzle_text TEXT,
    answer TEXT NOT NULL,
    hint TEXT,
    difficulty VARCHAR(20) DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_puzzles_grade_id ON puzzles(grade_id);
CREATE INDEX idx_puzzles_subject_id ON puzzles(subject_id);
CREATE INDEX idx_puzzles_type ON puzzles(puzzle_type);

-- Add sample rebus puzzles
INSERT INTO puzzles (grade_id, subject_id, puzzle_type, puzzle_text, answer, hint, difficulty) VALUES
(1, 33, 'rebus', 'Ч + картинка домика - Д', 'ОМ', 'Убираем первую букву', 'easy'),
(1, 33, 'rebus', '100 + Л', 'СТОЛ', 'Читаем цифру как слово', 'easy'),
(2, 33, 'rebus', 'ВО + 7', 'ВОСЕМЬ', 'Цифра 7 читается как СЕМЬ', 'easy'),
(2, 33, 'rebus', 'ПО + 2 + Л', 'ПОДВАЛ', 'Цифра 2 = ДВА', 'medium'),
(3, 33, 'rebus', 'С + 3 + Ж', 'СТРИЖ', 'Цифра 3 = ТРИ', 'medium'),
(3, 33, 'rebus', '40 + А', 'СОРОКА', '40 читается как СОРОК', 'medium'),
(4, 33, 'rebus', 'ПО + картинка льва - ЛЕВ + ДА', 'ПОБЕДА', 'Заменяем слово на картинку', 'hard'),
(4, 33, 'rebus', '100 + РОНА - НА', 'СТОРО', 'Убираем буквы НА из конца', 'hard');