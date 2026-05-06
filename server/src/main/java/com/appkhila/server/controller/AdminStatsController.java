package com.appkhila.server.controller;

import com.appkhila.server.model.OrderStatus;
import com.appkhila.server.repository.OrderRepository;
import com.appkhila.server.repository.ProductRepository;
import com.appkhila.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class AdminStatsController {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @GetMapping
    public Map<String, Object> getStats() {
        Double revenue = orderRepository.sumRevenue();
        return Map.of(
            "totalProducts", productRepository.count(),
            "totalOrders",   orderRepository.count(),
            "totalUsers",    userRepository.count(),
            "totalRevenue",  revenue != null ? revenue : 0.0,
            "pendingOrders", orderRepository.countByStatus(OrderStatus.PENDING)
        );
    }
}
