package com.notification.config;

import com.util.kafka.UserCreatedPayload;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import tools.jackson.databind.ObjectMapper;

@Configuration
public class NotificationKafkaConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(NotificationKafkaConsumer.class);

    private static ObjectMapper mapper = new ObjectMapper();

    @Autowired
    private JavaMailSender mailSender;

    @KafkaListener(topics = "${user.created.topic}", groupId = "email")
    public void consumeUserCreatedTopic(ConsumerRecord<?,?> payload) {
        UserCreatedPayload  userCreatedPayload = mapper.readValue(payload.value().toString(), UserCreatedPayload.class);
        LOGGER.info("Received user created payload: {}", userCreatedPayload);
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom("rajsahoo7350@gmail.com");
        mailMessage.setTo(userCreatedPayload.getUserEmail());
        mailMessage.setSubject("Welcome " + userCreatedPayload.getUserName());
        mailMessage.setText("We are delighted to have you onboard");
        mailMessage.setCc("admin.nexaroPay@yopmail.com");
        mailSender.send(mailMessage);
        LOGGER.info("Mail Sent Successfully");

    }
}
