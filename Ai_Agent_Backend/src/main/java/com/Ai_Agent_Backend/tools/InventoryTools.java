package com.Ai_Agent_Backend.tools;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class InventoryTools {

    // Dummy data
    private final Map<String, Integer> Stock = Map.of(
            "BlueTooth Speaker", 10,
            "Wireless Mouse", 15,
            "USB-C Hub", 8,
            "External Hard Drive", 5,
            "Laptop" , 5,
            "mobile cases" , 2,
            "Earphone "  ,1,
            "iPhone" , 5
    );


    @Tool(description = "check the stock availability of a product by its name ")
    public String checkStock(String itemName){
        System.out.println("calling checkStock Tool");
        System.out.println("Checking stock for product: " + itemName);

        Integer quantity = Stock.get(itemName);
        if (quantity == null){
            return "Stock Not Found";
        } else if (quantity > 0) {
            return "Stock Available: " + quantity +  "units available";
        } else {
            return "Out of Stock";

        }
    }

    @Tool(description = "Get the total count of products in stock")
    public Integer getProductInStock(){
        System.out.println("calling getTotalProductInStock Tool");
        return Stock.size();
    }

    @Tool(description = "Get a list of all products in stock")
    public java.util.List<String> getAllProductsInStock(){
        System.out.println("calling getAllProductsInStock Tool");
        return Stock.keySet().stream().filter(name -> Stock.get(name) > 0).toList();
    }

}
