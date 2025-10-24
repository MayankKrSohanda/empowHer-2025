//package com.example.demo.AOP;
//
//import org.aspectj.lang.JoinPoint;
//import org.aspectj.lang.annotation.Aspect;
//import org.aspectj.lang.annotation.Before;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.stereotype.Component;
//
//@Component
//@Aspect
//public class LoggingAspect {
//    private static final Logger LOGGER= LoggerFactory.getLogger(LoggingAspect.class);
//    @Before("execution(* com.example.com.service.ProductService.listProducts(..))")
//    public void logMethod(JoinPoint jp){
//        LOGGER.info("method called"+jp.getSignature().getName());
//    }
//}
