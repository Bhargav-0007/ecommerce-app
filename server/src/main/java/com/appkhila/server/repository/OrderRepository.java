package com.appkhila.server.repository;

import com.appkhila.server.model.Order;
import com.appkhila.server.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findAllByOrderByCreatedAtDesc();
    long countByStatus(OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o WHERE o.status <> 'CANCELLED'")
    Double sumRevenue();
}
