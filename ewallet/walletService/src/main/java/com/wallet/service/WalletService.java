package com.wallet.service;

import com.util.kafka.UserCreatedPayload;
import com.util.kafka.WalletUpdatedPayload;
import com.wallet.entity.Wallet;
import com.wallet.repository.WalletRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

@Service
public class WalletService {

    private static final Logger LOGGER = LoggerFactory.getLogger(WalletService.class);

    @Autowired
    private WalletRepository walletRepository;

    @Value("${wallet.updated.topic}")
    private String walletUpdatedTopic;

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Transactional
    public void createWallet(UserCreatedPayload userCreatedPayload) throws ExecutionException, InterruptedException {
        Wallet wallet = Wallet.builder()
                .userId(userCreatedPayload.getUserId())
                .userEmail(userCreatedPayload.getUserEmail())
                .balance(100.0)
                .build();
        wallet = walletRepository.save(wallet);

        WalletUpdatedPayload  walletUpdatedPayload = WalletUpdatedPayload.builder()
                .userId(wallet.getUserId())
                .walletId(wallet.getWalletId())
                .userEmail(wallet.getUserEmail())
                .newBalance(wallet.getBalance())
                .build();
        
        Future<SendResult<String,Object>> future = kafkaTemplate
                .send(walletUpdatedTopic, walletUpdatedPayload.getUserEmail(),walletUpdatedPayload);

        LOGGER.info("Sent message to Kafka topic: {}", future.get());

    }
}
