package com.wallet.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddMoneyReq {

    private Double amount;
    private Long userId;
    private long merchantId;
}
