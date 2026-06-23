// services/fedapay.service.ts - Version complète avec callback URL

import { v1Api } from './api';

interface FedapayCustomer {
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
}

interface FedapayPaymentData {
  amount: number;
  currency: 'XAF' | 'EUR' | 'USD';
  customer: FedapayCustomer;
  description: string;
  reference?: string;
  callback_url?: string;
  cancel_url?: string;
  booking_id?: string | number;
}

interface FedapayTransaction {
  id: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  customer: FedapayCustomer;
  created_at: string;
  payment_url: string;
  reference: string;
  booking_id?: string;
}

class FedapayService {
  private baseUrl: string;
  private frontendUrl: string;  // ✅ Nouvelle propriété

  constructor() {
    this.baseUrl = import.meta.env.VITE_FEDAPAY_API_URL || 'https://api.fedapay.com/v1';
    // ✅ URL du frontend depuis les variables d'environnement
    this.frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';
  }

  async initiatePayment(data: FedapayPaymentData): Promise<{ success: boolean; data: FedapayTransaction | null; message?: string }> {
    try {
      // ✅ Construire les URLs de callback avec l'URL du frontend
      const callbackUrl = data.callback_url || `${this.frontendUrl}/payment/fedapay/callback`;
      const cancelUrl = data.cancel_url || `${this.frontendUrl}/payment/fedapay/cancel`;

      // ✅ Préparer les données avec les URLs de callback
      const paymentData = {
        ...data,
        callback_url: callbackUrl,
        cancel_url: cancelUrl,
      };

      console.log('📤 Fedapay - Envoi des données:', {
        ...paymentData,
        customer: {
          ...paymentData.customer,
          phone: paymentData.customer.phone || 'Non renseigné'
        }
      });

      const response = await v1Api.post('/payments/fedapay/initiate', paymentData);
      
      console.log('📥 Fedapay - Réponse:', response.data);
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('❌ Erreur Fedapay:', error);
      console.error('❌ Détails:', error.response?.data);
      
      return {
        success: false,
        data: null,
        message: error?.response?.data?.message || error?.message || 'Erreur de paiement'
      };
    }
  }

  async getTransactionStatus(transactionId: string): Promise<FedapayTransaction> {
    try {
      const response = await v1Api.get(`/payments/fedapay/status/${transactionId}`);
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('❌ Erreur vérification transaction:', error);
      throw new Error(error?.response?.data?.message || 'Impossible de vérifier le statut du paiement');
    }
  }

  async confirmPayment(transactionId: string, bookingId: string): Promise<any> {
    try {
      const response = await v1Api.post('/payments/fedapay/confirm', {
        transaction_id: transactionId,
        booking_id: bookingId
      });
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur confirmation:', error);
      throw new Error(error?.response?.data?.message || 'Erreur lors de la confirmation du paiement');
    }
  }
}

export const fedapayService = new FedapayService();