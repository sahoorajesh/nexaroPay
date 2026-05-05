package com.gateway.controller;

import com.gateway.dto.MerchantDetailsDTO;
import com.gateway.service.MerchantService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/merchant-service")
public class MerchantController {


    private static final Logger logger = LoggerFactory.getLogger(MerchantController.class);

    @Autowired
    private MerchantService merchantService;

    @PostMapping("/register-merchant")
    public long registerMerchant(@RequestBody MerchantDetailsDTO merchantDetailsDTO) throws ExecutionException, InterruptedException {
        logger.info("registerMerchant");
        return merchantService.registerMerchant(merchantDetailsDTO);
    }
}
