// src/lib/xendit.ts
// Using direct HTTP calls to Xendit API for better compatibility

const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY || '';
const XENDIT_API_URL = 'https://api.xendit.co';

const xenditHeaders = {
  'Authorization': `Basic ${Buffer.from(XENDIT_SECRET_KEY + ':').toString('base64')}`,
  'Content-Type': 'application/json',
};

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
      const response = await fetch(`${XENDIT_API_URL}/v2/invoices`, {
        method: 'POST',
        headers: xenditHeaders,
        body: JSON.stringify({
          external_id: params.externalId,
          amount: params.amount,
          payer_email: params.payerEmail,
          description: params.description,
          invoice_duration: 86400,
          success_redirect_url: params.successRedirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
          failure_redirect_url: params.failureRedirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed`,
          currency: 'IDR',
          items: params.items,
          should_send_email: false,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create invoice');
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      console.error('Xendit create invoice error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create invoice',
      };
    }
  },

  // Create QRIS Payment
  async createQRIS(params: CreateQRISParams) {
    try {
      const response = await fetch(`${XENDIT_API_URL}/v2/qr_codes`, {
        method: 'POST',
        headers: xenditHeaders,
        body: JSON.stringify({
          external_id: params.externalId,
          type: 'DYNAMIC',
          callback_url: params.callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/xendit-callback`,
          amount: params.amount.toString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create QRIS');
      }

      const result = await response.json();

      return {
        success: true,
        data: {
          id: result.id,
          qr_string: result.qr_string,
          status: result.status,
        },
      };
    } catch (error: any) {
      console.error('Xendit create QRIS error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create QRIS',
      };
    }
  },

  // Create Virtual Account (Bank Transfer)
  async createVirtualAccount(params: CreateVAParams) {
    try {
      const response = await fetch(`${XENDIT_API_URL}/callback_virtual_accounts`, {
        method: 'POST',
        headers: xenditHeaders,
        body: JSON.stringify({
          external_id: params.externalId,
          bank_code: params.bankCode,
          name: params.name,
          expected_amount: params.amount,
          is_closed: true,
          expiration_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create virtual account');
      }

      const result = await response.json();

      return {
        success: true,
        data: {
          id: result.id,
          account_number: result.account_number,
          name: result.name,
          bank_code: result.bank_code,
          expiration_date: result.expiration_date,
        },
      };
    } catch (error: any) {
      console.error('Xendit create VA error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create virtual account',
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
      const channelCodeMap: Record<string, string> = {
        'OVO': 'ID_OVO',
        'DANA': 'ID_DANA',
        'LINKAJA': 'ID_LINKAJA',
        'SHOPEEPAY': 'ID_SHOPEEPAY',
      };

      const response = await fetch(`${XENDIT_API_URL}/ewallets/charges`, {
        method: 'POST',
        headers: xenditHeaders,
        body: JSON.stringify({
          reference_id: params.externalId,
          currency: 'IDR',
          amount: params.amount,
          checkout_method: 'ONE_TIME_PAYMENT',
          channel_code: channelCodeMap[params.ewalletType],
          channel_properties: {
            mobile_number: params.phone,
            success_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
            failure_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed`,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create e-wallet payment');
      }

      const result = await response.json();

      return {
        success: true,
        data: {
          id: result.id,
          status: result.status,
          actions: result.actions,
        },
      };
    } catch (error: any) {
      console.error('Xendit create e-wallet error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create e-wallet payment',
      };
    }
  },

  // Get Invoice Status
  async getInvoice(invoiceId: string) {
    try {
      const response = await fetch(`${XENDIT_API_URL}/v2/invoices/${invoiceId}`, {
        method: 'GET',
        headers: xenditHeaders,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get invoice');
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      console.error('Xendit get invoice error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get invoice',
      };
    }
  },
};

export default xenditService;