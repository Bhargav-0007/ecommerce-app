package com.appkhila.server.dto;

import lombok.Data;

@Data
public class CreateProductRequest {
    private String name;
    private String slug;
    private String description;
    private Double price;
    private Double originalPrice;
    private String brand;
    private Integer stock;
    private Boolean featured;
    private String images;
    private String categorySlug;
    private Double rating;
}
