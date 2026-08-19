package com.schoolmanagement.controller;

import com.schoolmanagement.dto.payment.PaymentRequest;
import com.schoolmanagement.dto.payment.PaymentResponse;
import com.schoolmanagement.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<PaymentResponse> create(@Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(paymentService.createPayment(request));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<PaymentResponse>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(paymentService.getPaymentsByStudent(studentId));
    }

    @GetMapping("/fee/{feeId}")
    public ResponseEntity<List<PaymentResponse>> getByFee(@PathVariable Long feeId) {
        return ResponseEntity.ok(paymentService.getPaymentsByFee(feeId));
    }
}
