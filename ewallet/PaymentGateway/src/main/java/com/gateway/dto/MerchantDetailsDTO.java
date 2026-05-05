package com.gateway.dto;

import jakarta.persistence.Column;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MerchantDetailsDTO {
    private String merchantKey;

    private String name;

    private String email;

    private String statusWebhook;

    private String redirectionUrl;
}
