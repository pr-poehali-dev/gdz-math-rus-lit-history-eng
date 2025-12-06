-- Создаём таблицу пользователей для хранения информации о покупках
CREATE TABLE IF NOT EXISTS t_p36022107_gdz_math_rus_lit_his.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаём таблицу покупок (подписок)
CREATE TABLE IF NOT EXISTS t_p36022107_gdz_math_rus_lit_his.purchases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p36022107_gdz_math_rus_lit_his.users(id),
    email VARCHAR(255) NOT NULL,
    product_type VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Индекс для быстрого поиска покупок пользователя
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON t_p36022107_gdz_math_rus_lit_his.purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_email ON t_p36022107_gdz_math_rus_lit_his.purchases(email);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON t_p36022107_gdz_math_rus_lit_his.purchases(status);