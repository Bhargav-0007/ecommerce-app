package com.appkhila.server.controller;

import com.appkhila.server.dto.OrderResponse;
import com.appkhila.server.model.OrderStatus;
import com.appkhila.server.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderRepository orderRepository;

    @GetMapping
    public List<OrderResponse> getAll() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
            .stream().map(OrderResponse::from).toList();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id,
                                           @RequestBody Map<String, String> body) {
        var order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        try {
            order.setStatus(OrderStatus.valueOf(body.get("status")));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status"));
        }
        return ResponseEntity.ok(OrderResponse.from(orderRepository.save(order)));
    }
}
