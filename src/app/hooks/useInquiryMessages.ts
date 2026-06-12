import { useState, useEffect } from 'react';
import messageService, { Message } from '../../services/message.service';

export const useInquiryMessages = (hostId: number | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // Charger les messages (API + localStorage)
  const loadMessages = async () => {
    if (!hostId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // 1. Récupérer les messages de l'API
      const apiResponse = await messageService.getInquiryMessages(hostId);
      const apiMessages = apiResponse.data.messages || [];
      
      // 2. Récupérer les messages locaux en attente
      const pendingMessages = messageService.getPendingInquiryMessages(hostId);
      
      // 3. Fusionner et trier par date
      const allMessages = [...apiMessages, ...pendingMessages].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      
      setMessages(allMessages);
    } catch (err: any) {
      console.error('Erreur chargement messages:', err);
      setError(err.message || 'Impossible de charger les messages');
      
      // En cas d'erreur, au moins afficher les messages locaux
      const pendingMessages = messageService.getPendingInquiryMessages(hostId);
      setMessages(pendingMessages);
    } finally {
      setLoading(false);
    }
  };

  // Envoyer un message
  const sendMessage = async (text: string) => {
    if (!hostId || !text.trim()) return;
    
    setSending(true);
    
    try {
      const response = await messageService.sendInquiryReply(hostId, { message: text });
      
      // Ajouter le nouveau message à la liste
      setMessages(prev => [...prev, response.data]);
      
      // Essayer de synchroniser les messages en attente
      await messageService.syncPendingMessages(hostId);
      
      return true;
    } catch (error) {
      console.error('Erreur envoi message:', error);
      return false;
    } finally {
      setSending(false);
    }
  };

  // Recharger périodiquement (optionnel)
  useEffect(() => {
    if (!hostId) return;
    
    loadMessages();
    
    // Recharger toutes les 30 secondes
    const interval = setInterval(loadMessages, 30000);
    
    return () => clearInterval(interval);
  }, [hostId]);

  return {
    messages,
    loading,
    error,
    sending,
    sendMessage,
    reloadMessages: loadMessages
  };
};