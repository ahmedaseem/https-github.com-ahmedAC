-- =========================
-- Languages
-- =========================

CREATE TABLE languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    code VARCHAR(20) UNIQUE NOT NULL,

    name VARCHAR(100) NOT NULL,

    native_name VARCHAR(100),

    direction VARCHAR(5) DEFAULT 'ltr',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================
-- Translations
-- =========================

CREATE TABLE translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    language_id UUID NOT NULL,

    entity_type VARCHAR(100) NOT NULL,

    entity_id UUID NOT NULL,

    field_name VARCHAR(100) NOT NULL,

    content TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_translation_language
    FOREIGN KEY(language_id)
    REFERENCES languages(id)
);


-- =========================
-- Users
-- =========================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name VARCHAR(200),

    email VARCHAR(255) UNIQUE,

    password_hash TEXT,

    country_id UUID,

    preferred_language UUID,

    role VARCHAR(50) DEFAULT 'user',

    verified BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_country
    FOREIGN KEY(country_id)
    REFERENCES countries(id),

    CONSTRAINT fk_user_language
    FOREIGN KEY(preferred_language)
    REFERENCES languages(id)
);


-- =========================
-- Reviews
-- =========================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID NOT NULL,

    entity_type VARCHAR(100) NOT NULL,

    entity_id UUID NOT NULL,

    rating INTEGER CHECK (
        rating >= 1 AND rating <= 5
    ),

    comment JSONB,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_user
    FOREIGN KEY(user_id)
    REFERENCES users(id)
);


-- =========================
-- Media
-- =========================

CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    entity_type VARCHAR(100) NOT NULL,

    entity_id UUID NOT NULL,

    media_type VARCHAR(50),

    url TEXT NOT NULL,

    description JSONB,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
