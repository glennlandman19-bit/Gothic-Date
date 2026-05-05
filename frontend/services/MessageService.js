/**
 * MessageService
 * API client for all messaging operations
 * Handles authentication via JWT tokens
 */

class MessageService {
  constructor(baseURL = '/api') {
    this.baseURL = baseURL;
  }

  /**
   * Get Authorization header with JWT token
   */
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Handle API errors with standardized format
   */
  async handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'API Error');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  /**
   * ============ CONVERSATIONS ============
   */

  /**
   * Get all conversations for the user
   * @param {number} limit - Max conversations to fetch
   * @param {number} offset - Pagination offset
   * @returns {Promise<{success: boolean, conversations: Array, total: number}>}
   */
  async getConversations(limit = 50, offset = 0) {
    try {
      const response = await fetch(
        `${this.baseURL}/conversations?limit=${limit}&offset=${offset}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get conversations error:', error);
      throw error;
    }
  }

  /**
   * Create a new conversation or retrieve existing
   * @param {string} participantId - ID of the other user
   * @returns {Promise<{success: boolean, conversation: Object}>}
   */
  async createConversation(participantId) {
    try {
      const response = await fetch(`${this.baseURL}/conversations`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ participantId }),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Create conversation error:', error);
      throw error;
    }
  }

  /**
   * ============ MESSAGES ============
   */

  /**
   * Send a message
   * @param {string} conversationId - ID of the conversation
   * @param {string} content - Message content
   * @returns {Promise<{success: boolean, message: Object}>}
   */
  async sendMessage(conversationId, content) {
    try {
      const response = await fetch(`${this.baseURL}/messages/send`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          conversationId,
          content,
        }),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  /**
   * Get messages from a conversation
   * @param {string} conversationId - ID of the conversation
   * @param {number} limit - Max messages to fetch
   * @param {number} offset - Pagination offset
   * @returns {Promise<{success: boolean, messages: Array, total: number}>}
   */
  async getMessages(conversationId, limit = 50, offset = 0) {
    try {
      const response = await fetch(
        `${this.baseURL}/messages/${conversationId}?limit=${limit}&offset=${offset}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  }

  /**
   * Mark messages as read in a conversation
   * @param {string} conversationId - ID of the conversation
   * @returns {Promise<{success: boolean, modifiedCount: number}>}
   */
  async markAsRead(conversationId) {
    try {
      const response = await fetch(
        `${this.baseURL}/messages/${conversationId}/read`,
        {
          method: 'PUT',
          headers: this.getAuthHeaders(),
        }
      );

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  }

  /**
   * Delete a message (soft delete)
   * @param {string} messageId - ID of the message to delete
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async deleteMessage(messageId) {
    try {
      const response = await fetch(`${this.baseURL}/messages/${messageId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Delete message error:', error);
      throw error;
    }
  }

  /**
   * Get count of unread messages
   * @returns {Promise<{success: boolean, unreadCount: number}>}
   */
  async getUnreadCount() {
    try {
      const response = await fetch(
        `${this.baseURL}/messages/unread/count`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get unread count error:', error);
      throw error;
    }
  }

  /**
   * ============ POLLING HELPERS ============
   */

  /**
   * Poll for new messages at intervals
   * @param {string} conversationId - ID of the conversation
   * @param {number} interval - Poll interval in ms (default: 5000)
   * @param {Function} onNewMessages - Callback when new messages arrive
   * @returns {Function} Unsubscribe function
   */
  pollMessages(conversationId, interval = 5000, onNewMessages) {
    let lastMessageCount = 0;

    const pollInterval = setInterval(async () => {
      try {
        const data = await this.getMessages(conversationId, 100, 0);

        if (data.messages.length > lastMessageCount) {
          lastMessageCount = data.messages.length;
          onNewMessages(data.messages);
        }
      } catch (error) {
        console.error('Poll error:', error);
      }
    }, interval);

    // Return unsubscribe function
    return () => clearInterval(pollInterval);
  }

  /**
   * Poll for unread count changes
   * @param {number} interval - Poll interval in ms (default: 5000)
   * @param {Function} onCountChange - Callback when unread count changes
   * @returns {Function} Unsubscribe function
   */
  pollUnreadCount(interval = 5000, onCountChange) {
    let lastCount = 0;

    const pollInterval = setInterval(async () => {
      try {
        const data = await this.getUnreadCount();

        if (data.unreadCount !== lastCount) {
          lastCount = data.unreadCount;
          onCountChange(data.unreadCount);
        }
      } catch (error) {
        console.error('Unread poll error:', error);
      }
    }, interval);

    // Return unsubscribe function
    return () => clearInterval(pollInterval);
  }
}

// Export singleton instance
export default new MessageService();
