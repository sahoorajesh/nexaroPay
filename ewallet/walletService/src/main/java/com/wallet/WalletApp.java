package com.wallet;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.wallet"}, scanBasePackageClasses = {com.util.kafka.KafkaProducerConfig.class})
public class WalletApp {
    public static void main(String[] args) {
        SpringApplication.run(WalletApp.class, args);

    }
}
