package com.Ai_Agent_Backend.tools;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class OrderTools {

    private final Map<String, String> orders = Map.of(
            "101" , "shipped - arriving Tomorrow",
            "102" , "Processing- not shipped yet",
            "103", "Cancelled- out of Stock",
            "104", "Shipped- arriving next week"

    );

    @Tool(description = "Gets the status of a customer order by its order ID")
    public String getOrderStatus(String orderId) {
        System.out.println("Calling getOrderStatus Tool");
        System.out.println("Fetching order status for orderId:.........✅✅✅✅✅✅✅ " + orderId);
        return orders.getOrDefault(orderId, "Order not found");
    }

    @Tool(description = "Cancels a customer order by its order ID")
    public String cancelOrder(String orderId) {
        System.out.println("Calling cancelOrder Tool");
        System.out.println("Attempting to cancel order with orderId:............❌❌❌❌❌❌❌❌ " + orderId);
        if (orders.containsKey(orderId)) {
           return "Order" +  orderId + " has been cancelled";
        }
        else {
            return "Order not found";
        }
    }

    @Tool(description = "Get the total count of customer orders")
    public Integer getOrderCount() {
        System.out.println("Calling getOrderCount Tool");
        return orders.size();
    }

}
