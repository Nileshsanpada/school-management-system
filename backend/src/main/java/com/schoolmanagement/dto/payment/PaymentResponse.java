package com.schoolmanagement.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    private Long id;
    private Long feeId;
    private Double amount;
    private LocalDate paymentDate;
    private String paymentMethod;
    private String transactionReference;
}
