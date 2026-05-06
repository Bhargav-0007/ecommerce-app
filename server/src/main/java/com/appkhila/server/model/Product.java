package com.appkhila.server.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double price;

    private Double originalPrice;

    // Stored as comma-separated URLs
    @Column(columnDefinition = "TEXT")
    private String images;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    private String brand;

    @Column(nullable = false)
    private Double rating;

    @Column(nullable = false)
    private Integer reviewCount;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false)
    private Boolean featured;
}
