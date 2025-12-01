// src/lib/xendit.ts
import Xendit from 'xendit-node';

const xendit = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY || '',
});

export interface CreateInvoiceParams {
  externalId: string;
  amount: number;
  payerEmail: string;
  description: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  successRedirectUrl?: string;
  failureRedirectUrl?: string;
}

export interface CreateQRISParams {
  externalId: string;
  amount: number;
  callbackUrl?: string;
}

export interface CreateVAParams {
  externalId: string;
  bankCode: string;
  name: string;
  amount: number;
}

export const xenditService = {
  // Create Invoice (supports multiple payment methods)
  async createInvoice(params: CreateInvoiceParams) {
    try {
      const result = await xendit.Invoice.createInvoice({
        externalID: params.externalId,
        amount: params.amount,
        payerEmail: params.payerEmail,
        description: params.description,
        invoiceDuration: 86400, // 24 hours
        successRedirectURL: params.successRedirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        failureRedirectURL: params.failureRedirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed`,
        currency: 'IDR',
        items: params.items,
        shouldSendEmail: false,
      });

      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      console.error('Xendit create invoice error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Create QRIS Payment
  async createQRIS(params: CreateQRISParams) {
    try {
      const result = await xendit.QRCode.createCode({
        externalID: params.externalId,
        type: 'DYNAMIC',
        callbackURL: params.callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/xendit-callback`,
        amount: params.amount,
      });

      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      console.error('Xendit create QRIS error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Create Virtual Account (Bank Transfer)
  async createVirtualAccount(params: CreateVAParams) {
    try {
      const result = await xendit.VirtualAcc.createFixedVA({
        externalID: params.externalId,
        bankCode: params.bankCode,
        name: params.name,
        expectedAmt: params.amount,
        isClosed: true,
        expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });

      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      console.error('Xendit create VA error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Create E-Wallet Payment
  async createEWallet(params: {
    externalId: string;
    amount: number;
    phone: string;
    ewalletType: 'OVO' | 'DANA' | 'LINKAJA' | 'SHOPEEPAY';
  }) {
    try {
      const result = await xendit.EWallet.createEWalletCharge({
        referenceID: params.externalId,
        currency: 'IDR',
        amount: params.amount,
        checkoutMethod: 'ONE_TIME_PAYMENT',
        channelCode: params.ewalletType,
        channelProperties: {
          mobileNumber: params.phone,
          successRedirectURL: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
          failureRedirectURL: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed`,
        },
      });

      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      console.error('Xendit create e-wallet error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Get Invoice Status
  async getInvoice(invoiceId: string) {
    try {
      const result = await xendit.Invoice.getInvoice({
        invoiceID: invoiceId,
      });

      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      console.error('Xendit get invoice error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default xenditService;