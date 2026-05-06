package com.appkhila.server;

import com.appkhila.server.model.*;
import com.appkhila.server.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedProducts();
    }

    private void seedAdmin() {
        if (userRepository.existsByEmail("admin@appkhila.com")) return;
        userRepository.save(User.builder()
            .name("Admin")
            .email("admin@appkhila.com")
            .password(passwordEncoder.encode("admin123"))
            .role(Role.ADMIN)
            .build());
        System.out.println("✅ Admin seeded: admin@appkhila.com / admin123");
    }

    private void seedProducts() {
        if (categoryRepository.count() > 0) return;

        // ── Categories ─────────────────────────────────────────────
        Category electronics = save(Category.builder()
            .name("Electronics").slug("electronics")
            .description("Gadgets, devices, and accessories")
            .imageUrl("https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80")
            .productCount(5).build());

        Category fashion = save(Category.builder()
            .name("Fashion").slug("fashion")
            .description("Clothing, shoes, and accessories")
            .imageUrl("https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80")
            .productCount(5).build());

        Category home = save(Category.builder()
            .name("Home & Living").slug("home-living")
            .description("Furniture, decor, and kitchen")
            .imageUrl("https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80")
            .productCount(5).build());

        Category sports = save(Category.builder()
            .name("Sports").slug("sports")
            .description("Gear, apparel, and equipment")
            .imageUrl("https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80")
            .productCount(5).build());

        Category books = save(Category.builder()
            .name("Books").slug("books")
            .description("Fiction, non-fiction, and more")
            .imageUrl("https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80")
            .productCount(5).build());

        Category beauty = save(Category.builder()
            .name("Beauty").slug("beauty")
            .description("Skincare, makeup, and wellness")
            .imageUrl("https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80")
            .productCount(5).build());

        // ── Electronics ────────────────────────────────────────────
        saveProduct("Wireless Noise-Cancelling Headphones", "wireless-headphones", electronics,
            89.99, 129.99, "Sony", 4.7, 2340, 45, true,
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80");
        saveProduct("4K Smart TV 55\"", "4k-smart-tv-55", electronics,
            549.99, 699.99, "Samsung", 4.5, 1820, 12, true,
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80");
        saveProduct("Mechanical Gaming Keyboard", "mechanical-gaming-keyboard", electronics,
            74.99, null, "Logitech", 4.6, 987, 60, false,
            "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80");
        saveProduct("USB-C Hub 7-in-1", "usbc-hub-7in1", electronics,
            34.99, 49.99, "Anker", 4.4, 3120, 100, false,
            "https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=600&q=80");
        saveProduct("Portable Bluetooth Speaker", "portable-bluetooth-speaker", electronics,
            49.99, 69.99, "JBL", 4.8, 4560, 75, true,
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80");

        // ── Fashion ────────────────────────────────────────────────
        saveProduct("Classic White Sneakers", "classic-white-sneakers", fashion,
            59.99, 79.99, "Adidas", 4.5, 6780, 200, true,
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80");
        saveProduct("Slim Fit Denim Jeans", "slim-fit-denim-jeans", fashion,
            44.99, null, "Levi's", 4.3, 3400, 150, false,
            "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80");
        saveProduct("Lightweight Puffer Jacket", "lightweight-puffer-jacket", fashion,
            89.99, 119.99, "Nike", 4.6, 1230, 80, true,
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80");
        saveProduct("Leather Crossbody Bag", "leather-crossbody-bag", fashion,
            69.99, 99.99, "Coach", 4.4, 890, 40, false,
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80");
        saveProduct("Polarised Aviator Sunglasses", "polarised-aviator-sunglasses", fashion,
            29.99, 49.99, "Ray-Ban", 4.2, 2100, 120, false,
            "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&q=80");

        // ── Home & Living ──────────────────────────────────────────
        saveProduct("Pour-Over Coffee Maker", "pour-over-coffee-maker", home,
            39.99, null, "Hario", 4.7, 5600, 90, true,
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80");
        saveProduct("Scented Soy Candle Set", "scented-soy-candle-set", home,
            24.99, 34.99, "Yankee", 4.6, 3200, 200, false,
            "https://images.unsplash.com/photo-1603905901309-6f58a2a56c3a?w=600&q=80");
        saveProduct("Bamboo Cutting Board", "bamboo-cutting-board", home,
            19.99, 29.99, "OXO", 4.5, 7800, 300, false,
            "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&q=80");
        saveProduct("Smart LED Desk Lamp", "smart-led-desk-lamp", home,
            44.99, 59.99, "BenQ", 4.8, 1450, 55, true,
            "https://images.unsplash.com/photo-1513506003901-1e6a35087e26?w=600&q=80");
        saveProduct("Ceramic Plant Pot Set", "ceramic-plant-pot-set", home,
            32.99, null, "IKEA", 4.3, 2300, 180, false,
            "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80");

        // ── Sports ─────────────────────────────────────────────────
        saveProduct("Adjustable Dumbbell Set", "adjustable-dumbbell-set", sports,
            149.99, 199.99, "Bowflex", 4.8, 2100, 20, true,
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80");
        saveProduct("Yoga Mat Non-Slip", "yoga-mat-non-slip", sports,
            29.99, 39.99, "Lululemon", 4.6, 8900, 250, false,
            "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80");
        saveProduct("Insulated Water Bottle 1L", "insulated-water-bottle-1l", sports,
            24.99, 34.99, "Hydro Flask", 4.9, 12000, 400, true,
            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80");
        saveProduct("Running Shoes Pro", "running-shoes-pro", sports,
            119.99, 149.99, "Brooks", 4.7, 3400, 60, true,
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80");
        saveProduct("Resistance Bands Set", "resistance-bands-set", sports,
            19.99, null, "TheraBand", 4.5, 6700, 500, false,
            "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&q=80");

        // ── Books ──────────────────────────────────────────────────
        saveProduct("Atomic Habits", "atomic-habits", books,
            14.99, 18.99, "Penguin", 4.9, 45000, 500, true,
            "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&q=80");
        saveProduct("The Pragmatic Programmer", "the-pragmatic-programmer", books,
            29.99, 39.99, "Addison-Wesley", 4.8, 12000, 300, true,
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80");
        saveProduct("Sapiens: A Brief History", "sapiens-brief-history", books,
            12.99, 16.99, "Harper", 4.7, 78000, 400, false,
            "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80");
        saveProduct("Clean Code", "clean-code", books,
            34.99, 44.99, "Prentice Hall", 4.6, 9800, 200, false,
            "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80");
        saveProduct("The Great Gatsby", "the-great-gatsby", books,
            9.99, null, "Scribner", 4.4, 23000, 800, false,
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80");

        // ── Beauty ─────────────────────────────────────────────────
        saveProduct("Vitamin C Serum 30ml", "vitamin-c-serum-30ml", beauty,
            24.99, 34.99, "TruSkin", 4.5, 34000, 300, true,
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80");
        saveProduct("Hydrating Face Moisturiser", "hydrating-face-moisturiser", beauty,
            19.99, 27.99, "CeraVe", 4.7, 56000, 500, true,
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80");
        saveProduct("Matte Lipstick Collection", "matte-lipstick-collection", beauty,
            14.99, null, "MAC", 4.3, 8900, 200, false,
            "https://images.unsplash.com/photo-1586495777744-4e6232bf2ebb?w=600&q=80");
        saveProduct("Jade Facial Roller", "jade-facial-roller", beauty,
            12.99, 19.99, "Mount Lai", 4.4, 12000, 400, false,
            "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&q=80");
        saveProduct("SPF 50 Sunscreen", "spf-50-sunscreen", beauty,
            17.99, 24.99, "EltaMD", 4.8, 67000, 600, true,
            "https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=600&q=80");

        System.out.println("✅ Seeded 6 categories and 30 products.");
    }

    private Category save(Category c) { return categoryRepository.save(c); }

    private void saveProduct(String name, String slug, Category category,
                              double price, Double originalPrice, String brand,
                              double rating, int reviews, int stock, boolean featured,
                              String imageUrl) {
        productRepository.save(Product.builder()
            .name(name).slug(slug).category(category)
            .description("Premium quality " + name.toLowerCase() + " crafted for everyday use.")
            .price(price).originalPrice(originalPrice).brand(brand)
            .rating(rating).reviewCount(reviews).stock(stock).featured(featured)
            .images(imageUrl)
            .build());
    }
}
