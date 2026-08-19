package com.schoolmanagement.dto.payment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    @NotNull
    private Long feeId;
    @NotNull
    @Positive
    private Double amount;
    @NotBlank
    private String paymentMethod;
    private String transactionReference;
}
