package com.user.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Getter
@Setter
@ToString
public class UserDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String name;
    private String email;
    private String phone;
    private String kycNumber;
}
