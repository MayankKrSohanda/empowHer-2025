package com.example.demo.controller;

import com.example.demo.model.DTO.ProductResponse;
import com.example.demo.service.CartService;
import com.example.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(
        origins = "http://localhost:4200",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductService productService;

    @Autowired
    public ChatController(ProductService productService,CartService cartService){
        this.productService=productService;
        this.cartService=cartService;
    }
    @PostMapping
    public Map<String,String> chat(@RequestBody Map<String,String> body){
        String query=body.get("query").toLowerCase();
        String reply=getBotReply(query);

        Map<String, String> response=new HashMap<>();
        response.put("reply",reply);
        return response;
    }
    private String getBotReply(String query){
        if(query.contains("hello")||query.contains("hi") ){
            return "Hello! How can I help you today?";
        }
        else if(query.contains("shipping")){
            return "We offer free shipping for orders above 500rs";
        }
        else if(query.contains("walk through")){
            return "Home page -> click on product image to view details of that product -> add to cart -> proceed with order";
        }
        else if(query.contains("what are the options for payment how to proceed with payment")||query.contains("payment methods")){
            return "We accept credit card, UPI, and Cash on Delivery.";
        }
        if (query.contains("show products") || query.contains("list products")) {
            List<ProductResponse> products = productService.findAll().stream().map(p -> {
                ProductResponse dto = new ProductResponse();
                dto.setId(p.getId());
                dto.setTitle(p.getTitle());
                dto.setPrice(p.getPrice());
                return dto;
            }).toList();

            if (products.isEmpty()) {
                return "Sorry, no products are available right now.";
            }


            StringBuilder sb = new StringBuilder("Here are some products:\n\n");
            for (ProductResponse pr : products) {
                sb.append("• ").append(pr.getTitle())
                        .append(" (₹").append(pr.getPrice()).append(")\n");
            }

            return sb.toString();
        }



        return "Sorry, I didn't understand. Can you please rephrase?";
    }
}
