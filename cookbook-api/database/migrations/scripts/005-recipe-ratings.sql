
CREATE TABLE public.recipe_ratings
(
    recipe_id INT NOT NULL,
    user_id INT NOT NULL,
	rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
	comment VARCHAR(1000) NULL,
    date_created TIMESTAMP NOT NULL,
    date_updated TIMESTAMP NULL,
	PRIMARY KEY (recipe_id, user_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes (recipe_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);