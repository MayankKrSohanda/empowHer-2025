//package com.example.demo.AOP;
//
//import org.aspectj.lang.ProceedingJoinPoint;
//import org.aspectj.lang.annotation.Around;
//import org.aspectj.lang.annotation.Aspect;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.stereotype.Component;
//
//@Component
//@Aspect
//public class ValidationAspect {
//    private static final Logger LOGGER= LoggerFactory.getLogger(ValidationAspect.class);
//    @Around("execution(* com.example.demo.service.ProductService.getProductById(..)) && args(id)")
//    public Object validate(ProceedingJoinPoint jp,int id) throws Throwable {
//        if(id<0){
//            id=-id;
//            LOGGER.info("new value "+id);
//        }
//
//        return jp.proceed(new Object[]{id});
//
//    }
//
//}
