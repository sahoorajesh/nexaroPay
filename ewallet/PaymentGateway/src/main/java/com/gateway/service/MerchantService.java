package com.gateway.service;

import com.gateway.dto.MerchantDetailsDTO;
import com.gateway.entity.Merchant;
import com.gateway.repository.MerchantRepo;
import com.util.kafka.UserCreatedPayload;
import jakarta.transaction.Transactional;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

@Service
public class MerchantService {

    @Autowired
    private MerchantRepo merchantRepo;

    @Transactional
    public long registerMerchant(MerchantDetailsDTO merchantDetailsDTO) throws ExecutionException, InterruptedException {

        Merchant merchant = Merchant.builder()
                .merchantKey(merchantDetailsDTO.getMerchantKey())
                .name(merchantDetailsDTO.getName())
                .email(merchantDetailsDTO.getEmail())
                .statusWebhook(merchantDetailsDTO.getStatusWebhook())
                .redirectionUrl(merchantDetailsDTO.getRedirectionUrl())
                .build();
        merchant = merchantRepo.save(merchant);
        return merchant.getId();
    }

    public MerchantDetailsDTO getMerchantDetails(Long merchantId){

        Merchant merchant = merchantRepo.findById(merchantId).get();
        MerchantDetailsDTO  merchantDetailsDTO = new MerchantDetailsDTO();
        merchantDetailsDTO.setName(merchant.getName());
        merchantDetailsDTO.setEmail(merchant.getEmail());
        merchantDetailsDTO.setStatusWebhook(merchant.getStatusWebhook());
        merchantDetailsDTO.setRedirectionUrl(merchant.getRedirectionUrl());
        merchantDetailsDTO.setMerchantKey(merchant.getMerchantKey());

        return merchantDetailsDTO;
    }
}
