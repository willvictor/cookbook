CREATE TABLE public.users
(
    user_id SERIAL PRIMARY KEY,
    google_sub_id VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    image_url VARCHAR(1000) NOT NULL,
    date_created TIMESTAMP NOT NULL
);

CREATE TABLE public.recipes
(
    recipe_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    ingredients VARCHAR(255) NOT NULL,
    directions VARCHAR(255) NOT NULL,
    date_created TIMESTAMP NOT NULL,
    date_updated TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);