// services/messageService.ts
import { v1Api } from './api';

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  booking_id: number | null;
  message: string;
  is_read: boolean;
  read_at: string | null;
  message_type: string;
  attachment_url: string | null;
  attachment_name: string | null;
  attachment_size: number | null;
  created_at: string;
  updated_at: string;
  sender?: {
    id: number;
    full_name: string;
    profile_photo_url: string | null;
  };
  receiver?: {
    id: number;
    full_name: string;
    profile_photo_url: string | null;
  };
}

export interface Conversation {
  booking: {
    id: number;
    reference: string;
    property: {
      id: number;
      title: string;
      photo: string | null;
    };
    host: {
      id: number;
      name: string;
      photo: string | null;
    };
    dates: {
      check_in: string;
      check_out: string;
    };
  };
  last_message: {
    message: string;
    sent_at: string;
    is_from_host: boolean;
  } | null;
  unread_count: number;
}

const messageService = {
  // Récupérer toutes les conversations du voyageur
  getConversations: async (): Promise<{ data: Conversation[] }> => {
    // ✅ CORRECTION : Utiliser v1Api
    const response = await v1Api.get('/traveler/messages/conversations');
    return response.data;
  },

  // Récupérer les messages d'une réservation spécifique
  getMessages: async (bookingId: number): Promise<{ data: { booking: any; messages: Message[] } }> => {
    // ✅ CORRECTION : Utiliser v1Api
    const response = await v1Api.get(`/traveler/messages/booking/${bookingId}`);
    return response.data;
  },

  // Envoyer un message pour une réservation
  sendMessage: async (bookingId: number, data: { message: string }): Promise<{ data: Message }> => {
    // ✅ CORRECTION : Utiliser v1Api
    const response = await v1Api.post(`/traveler/messages/booking/${bookingId}`, data);
    return response.data;
  },

  // Envoyer une demande d'information (sans réservation)
  sendInquiry: async (data: { 
    property_id: number; 
    message: string; 
    check_in?: string; 
    check_out?: string; 
    guests?: number 
  }): Promise<{ data: Message }> => {
    // ✅ CORRECTION : Utiliser v1Api
    const response = await v1Api.post('/traveler/messages/inquiry', data);
    return response.data;
  },

  // Marquer un message comme lu
  markAsRead: async (messageId: number): Promise<void> => {
    // ✅ CORRECTION : Utiliser v1Api
    const response = await v1Api.post(`/traveler/messages/${messageId}/read`);
    return response.data;
  },

  // Marquer toute une conversation comme lue
  markConversationAsRead: async (bookingId: number): Promise<void> => {
    // ✅ CORRECTION : Utiliser v1Api
    const response = await v1Api.post(`/traveler/messages/conversation/${bookingId}/read`);
    return response.data;
  },

  // Récupérer le nombre de messages non lus
  getUnreadCount: async (): Promise<{ data: { count: number } }> => {
    // ✅ CORRECTION : Utiliser v1Api
    const response = await v1Api.get('/traveler/messages/unread/count');
    return response.data;
  },
};

export default messageService;