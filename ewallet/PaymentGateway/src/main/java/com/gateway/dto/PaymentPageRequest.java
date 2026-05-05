package com.gateway.dto;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentPageRequest {

    private Long merchantId;

    private String merchantKey;

    private Double amount;

    private String orderId;

    private Long userId;

}
