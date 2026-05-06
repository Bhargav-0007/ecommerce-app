package com.appkhila.server.controller;

import com.appkhila.server.dto.ProductResponse;
import com.appkhila.server.model.Product;
import com.appkhila.server.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;

    @GetMapping
    public Map<String, Object> getAll(
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String q,
        @RequestParam(defaultValue = "0")  int page,
        @RequestParam(defaultValue = "12") int size,
        @RequestParam(defaultValue = "name") String sortBy,
        @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Product> result = productRepository.search(
            (category != null && !category.isBlank()) ? category : null,
            (q != null && !q.isBlank()) ? q : null,
            pageable
        );

        List<ProductResponse> content = result.getContent()
            .stream().map(ProductResponse::from).toList();

        return Map.of(
            "content",       content,
            "totalElements", result.getTotalElements(),
            "totalPages",    result.getTotalPages(),
            "page",          result.getNumber(),
            "size",          result.getSize()
        );
    }

    @GetMapping("/featured")
    public List<ProductResponse> getFeatured() {
        return productRepository.findByFeaturedTrue()
            .stream().map(ProductResponse::from).toList();
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ProductResponse> getBySlug(@PathVariable String slug) {
        return productRepository.findBySlug(slug)
            .map(ProductResponse::from)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
