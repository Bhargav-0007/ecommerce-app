package com.appkhila.server.dto;

import com.appkhila.server.model.Product;
import lombok.Data;

import java.util.Arrays;
import java.util.List;

@Data
public class ProductResponse {
    private String id;
    private String name;
    private String slug;
    private String description;
    private Double price;
    private Double originalPrice;
    private List<String> images;
    private CategoryInfo category;
    private String brand;
    private Double rating;
    private Integer reviewCount;
    private Integer stock;
    private Boolean featured;

    @Data
    public static class CategoryInfo {
        private String id;
        private String name;
        private String slug;
    }

    public static ProductResponse from(Product p) {
        ProductResponse dto = new ProductResponse();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setSlug(p.getSlug());
        dto.setDescription(p.getDescription());
        dto.setPrice(p.getPrice());
        dto.setOriginalPrice(p.getOriginalPrice());
        dto.setImages(p.getImages() != null
            ? Arrays.asList(p.getImages().split(","))
            : List.of());
        dto.setBrand(p.getBrand());
        dto.setRating(p.getRating());
        dto.setReviewCount(p.getReviewCount());
        dto.setStock(p.getStock());
        dto.setFeatured(p.getFeatured());

        if (p.getCategory() != null) {
            CategoryInfo cat = new CategoryInfo();
            cat.setId(p.getCategory().getId());
            cat.setName(p.getCategory().getName());
            cat.setSlug(p.getCategory().getSlug());
            dto.setCategory(cat);
        }
        return dto;
    }
}
