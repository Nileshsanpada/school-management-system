package com.schoolmanagement.service;

import com.schoolmanagement.dto.payment.PaymentRequest;
import com.schoolmanagement.dto.payment.PaymentResponse;
import com.schoolmanagement.entity.Fee;
import com.schoolmanagement.entity.Payment;
import com.schoolmanagement.entity.enums.FeeStatus;
import com.schoolmanagement.entity.enums.PaymentMethod;
import com.schoolmanagement.repository.FeeRepository;
import com.schoolmanagement.repository.PaymentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private FeeRepository feeRepository;

    @InjectMocks
    private PaymentService paymentService;

    @Test
    void createPayment_shouldSaveAndUpdateFee() {
        Long feeId = 1L;
        Fee fee = new Fee();
        fee.setId(feeId);
        fee.setTotalAmount(1000.0);
        fee.setAmountPaid(200.0);
        fee.setOutstandingAmount(800.0);
        fee.setStatus(FeeStatus.PARTIAL);

        PaymentRequest request = new PaymentRequest();
        request.setFeeId(feeId);
        request.setAmount(500.0);
        request.setPaymentMethod("UPI");
        request.setTransactionReference("TXN123");

        Payment payment = new Payment();
        payment.setId(1L);
        payment.setAmount(500.0);
        payment.setPaymentMethod(PaymentMethod.UPI);
        payment.setTransactionReference("TXN123");
        payment.setFee(fee);

        when(feeRepository.findById(feeId)).thenReturn(Optional.of(fee));
        when(paymentRepository.save(any(Payment.class))).thenReturn(payment);
        when(feeRepository.save(any(Fee.class))).thenAnswer(i -> i.getArguments()[0]);

        PaymentResponse response = paymentService.createPayment(request);

        assertNotNull(response);
        assertEquals(500.0, response.getAmount());
        assertEquals(700.0, fee.getAmountPaid());
        assertEquals(300.0, fee.getOutstandingAmount());
        assertEquals(FeeStatus.PARTIAL, fee.getStatus());
        
        verify(paymentRepository, times(1)).save(any(Payment.class));
        verify(feeRepository, times(1)).save(fee);
    }

    @Test
    void createPayment_shouldThrowException_whenAmountExceedsOutstanding() {
        Long feeId = 1L;
        Fee fee = new Fee();
        fee.setId(feeId);
        fee.setTotalAmount(1000.0);
        fee.setAmountPaid(200.0);
        fee.setOutstandingAmount(800.0);

        PaymentRequest request = new PaymentRequest();
        request.setFeeId(feeId);
        request.setAmount(1000.0);
        request.setPaymentMethod("CASH");

        when(feeRepository.findById(feeId)).thenReturn(Optional.of(fee));

        assertThrows(IllegalArgumentException.class, () -> 
            paymentService.createPayment(request)
        );
        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    void createPayment_shouldSetStatusToPaid_whenFullyPaid() {
        Long feeId = 1L;
        Fee fee = new Fee();
        fee.setId(feeId);
        fee.setTotalAmount(1000.0);
        fee.setAmountPaid(200.0);
        fee.setOutstandingAmount(800.0);

        PaymentRequest request = new PaymentRequest();
        request.setFeeId(feeId);
        request.setAmount(800.0);
        request.setPaymentMethod("UPI");
        request.setTransactionReference("TXN123");

        Payment payment = new Payment();
        payment.setId(1L);
        payment.setAmount(800.0);
        payment.setPaymentMethod(PaymentMethod.UPI);
        payment.setFee(fee);

        when(feeRepository.findById(feeId)).thenReturn(Optional.of(fee));
        when(paymentRepository.save(any(Payment.class))).thenReturn(payment);
        when(feeRepository.save(any(Fee.class))).thenAnswer(i -> i.getArguments()[0]);

        paymentService.createPayment(request);

        assertEquals(1000.0, fee.getAmountPaid());
        assertEquals(0.0, fee.getOutstandingAmount());
        assertEquals(FeeStatus.PAID, fee.getStatus());
    }

    @Test
    void createPayment_shouldSetStatusToPartial_whenPartiallyPaid() {
        Long feeId = 1L;
        Fee fee = new Fee();
        fee.setId(feeId);
        fee.setTotalAmount(1000.0);
        fee.setAmountPaid(0.0);
        fee.setOutstandingAmount(1000.0);
        fee.setStatus(FeeStatus.PENDING);

        PaymentRequest request = new PaymentRequest();
        request.setFeeId(feeId);
        request.setAmount(500.0);
        request.setPaymentMethod("UPI");
        request.setTransactionReference("TXN123");

        Payment payment = new Payment();
        payment.setId(1L);
        payment.setAmount(500.0);
        payment.setPaymentMethod(PaymentMethod.UPI);
        payment.setFee(fee);

        when(feeRepository.findById(feeId)).thenReturn(Optional.of(fee));
        when(paymentRepository.save(any(Payment.class))).thenReturn(payment);
        when(feeRepository.save(any(Fee.class))).thenAnswer(i -> i.getArguments()[0]);

        paymentService.createPayment(request);

        assertEquals(500.0, fee.getAmountPaid());
        assertEquals(500.0, fee.getOutstandingAmount());
        assertEquals(FeeStatus.PARTIAL, fee.getStatus());
    }
}
