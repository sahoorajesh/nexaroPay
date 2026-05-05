package com.wallet.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PaymentStatusFromGatewayDTO {
    private String status;
    private Long userId;
    private Double amount;
}
