package com.appkhila.server.dto;

import com.appkhila.server.model.Order;
import com.appkhila.server.model.OrderItem;
import lombok.Data;

import java.util.List;

@Data
public class OrderResponse {
    private String id;
    private String userId;
    private String userName;
    private String userEmail;
    private List<OrderItemInfo> items;
    private String status;
    private Double total;
    private String shippingAddress;
    private String createdAt;

    @Data
    public static class OrderItemInfo {
        private String productId;
        private String productName;
        private Integer quantity;
        private Double price;
    }

    public static OrderResponse from(Order o) {
        OrderResponse r = new OrderResponse();
        r.setId(o.getId());
        r.setStatus(o.getStatus().name());
        r.setTotal(o.getTotal());
        r.setShippingAddress(o.getShippingAddress());
        r.setCreatedAt(o.getCreatedAt() != null ? o.getCreatedAt().toString() : null);
        if (o.getUser() != null) {
            r.setUserId(o.getUser().getId());
            r.setUserName(o.getUser().getName());
            r.setUserEmail(o.getUser().getEmail());
        }
        r.setItems(o.getItems().stream().map(item -> {
            OrderItemInfo info = new OrderItemInfo();
            info.setProductId(item.getProduct() != null ? item.getProduct().getId() : null);
            info.setProductName(item.getProduct() != null ? item.getProduct().getName() : "Unknown");
            info.setQuantity(item.getQuantity());
            info.setPrice(item.getPrice());
            return info;
        }).toList());
        return r;
    }
}
