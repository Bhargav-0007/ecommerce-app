package com.appkhila.server.repository;

import com.appkhila.server.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, String> {

    Optional<Product> findBySlug(String slug);

    Page<Product> findByCategory_Slug(String categorySlug, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCase(String query, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
           "(:category IS NULL OR p.category.slug = :category) AND " +
           "(:q IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<Product> search(
        @Param("category") String category,
        @Param("q") String q,
        Pageable pageable
    );

    List<Product> findByFeaturedTrue();

    boolean existsBySlug(String slug);
}
