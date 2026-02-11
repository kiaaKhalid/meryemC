package com.meryem.maintenance.dto;

import lombok.Data;

@Data
public class UpdateAccountRequest {
    private String username;
    private String email;
    private String civility;
}
