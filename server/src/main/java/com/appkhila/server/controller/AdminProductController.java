package com.appkhila.server.controller;

import com.appkhila.server.dto.CreateProductRequest;
import com.appkhila.server.dto.ProductResponse;
import com.appkhila.server.model.Product;
import com.appkhila.server.repository.CategoryRepository;
import com.appkhila.server.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @GetMapping
    public List<ProductResponse> getAll() {
        return productRepository.findAll(Sort.by("name").ascending())
            .stream().map(ProductResponse::from).toList();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateProductRequest req) {
        var category = categoryRepository.findBySlug(req.getCategorySlug())
            .orElseThrow(() -> new RuntimeException("Category not found: " + req.getCategorySlug()));

        String slug = buildSlug(req.getName(), req.getSlug(), null);

        Product p = Product.builder()
            .name(req.getName())
            .slug(slug)
            .description(req.getDescription() != null ? req.getDescription() : "")
            .price(req.getPrice())
            .originalPrice(req.getOriginalPrice())
            .brand(req.getBrand() != null ? req.getBrand() : "")
            .rating(req.getRating() != null ? req.getRating() : 0.0)
            .reviewCount(0)
            .stock(req.getStock() != null ? req.getStock() : 0)
            .featured(req.getFeatured() != null && req.getFeatured())
            .images(req.getImages() != null ? req.getImages() : "")
            .category(category)
            .build();

        return ResponseEntity.ok(ProductResponse.from(productRepository.save(p)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody CreateProductRequest req) {
        Product p = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        var category = categoryRepository.findBySlug(req.getCategorySlug())
            .orElseThrow(() -> new RuntimeException("Category not found"));

        p.setName(req.getName());
        p.setSlug(buildSlug(req.getName(), req.getSlug(), p.getSlug()));
        if (req.getDescription() != null) p.setDescription(req.getDescription());
        p.setPrice(req.getPrice());
        p.setOriginalPrice(req.getOriginalPrice());
        if (req.getBrand() != null) p.setBrand(req.getBrand());
        if (req.getStock() != null) p.setStock(req.getStock());
        if (req.getFeatured() != null) p.setFeatured(req.getFeatured());
        if (req.getRating() != null) p.setRating(req.getRating());
        if (req.getImages() != null) p.setImages(req.getImages());
        p.setCategory(category);

        return ResponseEntity.ok(ProductResponse.from(productRepository.save(p)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private String buildSlug(String name, String requested, String existing) {
        String base = (requested != null && !requested.isBlank())
            ? requested.trim().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "")
            : name.trim().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");

        if (base.equals(existing)) return base;

        String slug = base;
        int i = 1;
        while (productRepository.existsBySlug(slug)) slug = base + "-" + i++;
        return slug;
    }
}
