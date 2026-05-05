package com.gateway.service;

import com.gateway.dto.PaymentInitResponse;
import com.gateway.dto.PaymentPageRequest;
import com.gateway.dto.TransactionDetailDto;
import com.gateway.entity.Merchant;
import com.gateway.entity.Transaction;
import com.gateway.repository.MerchantRepo;
import com.gateway.repository.TransactionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepo transactionRepo;

    @Autowired
    private MerchantRepo merchantRepo;

    public TransactionDetailDto getStatus(String txnId){
        Transaction transaction = transactionRepo.findByTxnId(txnId);
        return TransactionDetailDto.builder()
                .userId(transaction.getUserId())
                .status(transaction.getStatus())
                .amount(transaction.getAmount())
                .build();

    }

    public Transaction getTransaction(String txnId){
        return transactionRepo.findByTxnId(txnId);
    }

    public String doPaymentAndRedirect(String txnId){
        Transaction transaction = transactionRepo.findByTxnId(txnId);
        transaction.setStatus("SUCCESS");
        transactionRepo.save(transaction);
        Merchant merchant = merchantRepo.findById(transaction.getMerchantId()).get();
        // CAll API of WebHook to update status in merchant system
        //
        return merchant.getRedirectionUrl()+txnId;
    }

    public PaymentInitResponse generatePaymentPage(PaymentPageRequest request){
        String txnId = UUID.randomUUID().toString();
        Transaction transaction = Transaction.builder()
                .merchantId(request.getMerchantId())
                .amount(request.getAmount())
                .status("PENDING")
                .txnId(txnId)
                .userId(request.getUserId())
                .build();
        transactionRepo.save(transaction);
        String url = "http://localhost:9090/payment-page/"+txnId;
        return PaymentInitResponse.builder()
                .txnId(txnId)
                .url(url)
                .build();
    }


}
