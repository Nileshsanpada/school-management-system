package com.schoolmanagement.service;

import com.schoolmanagement.dto.payment.PaymentRequest;
import com.schoolmanagement.dto.payment.PaymentResponse;
import com.schoolmanagement.entity.Fee;
import com.schoolmanagement.entity.Payment;
import com.schoolmanagement.entity.enums.FeeStatus;
import com.schoolmanagement.entity.enums.PaymentMethod;
import com.schoolmanagement.repository.FeeRepository;
import com.schoolmanagement.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final FeeRepository feeRepository;

    public PaymentService(PaymentRepository paymentRepository, FeeRepository feeRepository) {
        this.paymentRepository = paymentRepository;
        this.feeRepository = feeRepository;
    }

    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {
        Fee fee = feeRepository.findById(request.getFeeId())
                .orElseThrow(() -> new RuntimeException("Fee not found"));

        if (request.getAmount() <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        if (request.getAmount() > fee.getOutstandingAmount()) {
            throw new IllegalArgumentException("Payment amount cannot be greater than outstanding amount: " + fee.getOutstandingAmount());
        }

        Payment payment = new Payment();
        payment.setAmount(request.getAmount());
        payment.setPaymentDate(LocalDate.now());
        payment.setPaymentMethod(PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase()));
        payment.setTransactionReference(request.getTransactionReference());
        payment.setFee(fee);

        payment = paymentRepository.save(payment);

        fee.setAmountPaid(fee.getAmountPaid() + request.getAmount());
        fee.setOutstandingAmount(fee.getTotalAmount() - fee.getAmountPaid());

        if (fee.getOutstandingAmount() <= 0) {
            fee.setStatus(FeeStatus.PAID);
        } else if (fee.getAmountPaid() > 0) {
            fee.setStatus(FeeStatus.PARTIAL);
        } else {
            fee.setStatus(FeeStatus.PENDING);
        }

        feeRepository.save(fee);

        logger.info("Payment of {} recorded for fee {}", request.getAmount(), request.getFeeId());

        return mapToResponse(payment);
    }

    public List<PaymentResponse> getPaymentsByStudent(Long studentId) {
        return paymentRepository.findByFeeStudentId(studentId).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<PaymentResponse> getPaymentsByFee(Long feeId) {
        return paymentRepository.findByFeeId(feeId).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .feeId(payment.getFee().getId())
                .amount(payment.getAmount())
                .paymentDate(payment.getPaymentDate())
                .paymentMethod(payment.getPaymentMethod().name())
                .transactionReference(payment.getTransactionReference())
                .build();
    }
}
