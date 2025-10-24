package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="image_model")
public class ImageModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imgId;
    private String imgName;
    private String fileName;
    private String imgType;
    private String imgPath;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id") // foreign key in image_model table
    private Product product;

}
