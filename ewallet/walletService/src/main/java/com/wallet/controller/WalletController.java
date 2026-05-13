package com.wallet.controller;

import com.wallet.dto.AddMoneyReq;
import com.wallet.dto.AddMoneyResponse;
import com.wallet.dto.WalletInfoDTO;
import com.wallet.service.WalletService;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
//import jakarta.servlet.http.HttpServletResponse;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/wallet-service")
public class WalletController {

    private static final Logger logger = LoggerFactory.getLogger(WalletController.class);

    @Autowired
    private WalletService walletService;

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/wallet-details/{userId}")
    public WalletInfoDTO getWalletDetails(@PathVariable Long userId) throws ExecutionException, InterruptedException {
        logger.info("getWallet Details for userId = {}" , userId);
        return walletService.getWalletDetails(userId);
    }

    @PostMapping("/add-money")
    public ResponseEntity<AddMoneyResponse> addMoney(@RequestBody AddMoneyReq addMoneyReq) throws ExecutionException, InterruptedException {

        addMoneyReq.setMerchantId(1L);
        AddMoneyResponse addMoneyResponse = restTemplate.postForObject("http://localhost:9090/pg-service/init-payment", addMoneyReq, AddMoneyResponse.class);
        return ResponseEntity.ok(addMoneyResponse);
    }

    @GetMapping("process-payment/{pgTxnId}")
    public void processTransferViaPaymentGateway( @PathVariable String pgTxnId, HttpServletResponse response) throws java.io.IOException {

        // Process payment first
        walletService.processPgTxnId(pgTxnId);

        // Redirect browser back to frontend
        String frontendUrl =
                "http://localhost:3000/add-money?pgTxnId=" + pgTxnId;

        response.sendRedirect(frontendUrl);
    }

    @GetMapping("/check-balance/{userId}")
    public ResponseEntity<WalletInfoDTO> checkWalletBalance(@PathVariable Long userId) {
        WalletInfoDTO walletInfoDTO = walletService.getWalletDetails(userId);
        return ResponseEntity.ok(walletInfoDTO);
    }

}
