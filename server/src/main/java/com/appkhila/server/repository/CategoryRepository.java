package com.appkhila.server.repository;

import com.appkhila.server.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, String> {
    Optional<Category> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
