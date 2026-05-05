import React, { useState, useEffect, useRef } from 'react';
import messageService from '../services/MessageService';
import '../styles/ChatWindow.css';

const ChatWindow = ({
  conversation,
  currentUserId,
  onClose,
  onMessageSent,
}) => {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (conversation) {
      loadMessages();
      markAsRead();
    }
  }, [conversation?._id]);

  // Load messages from conversation
  const loadMessages = async () => {
    if (!conversation) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await messageService.getMessages(
        conversation._id,
        100,
        0
      );
      setMessages(response.messages || []);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  // Mark all messages as read
  const markAsRead = async () => {
    if (!conversation) return;

    try {
      await messageService.markAsRead(conversation._id);
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  // Scroll to bottom of message list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle send message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageContent.trim()) return;

    if (messageContent.length > 500) {
      setError('Message must be 500 characters or less');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const response = await messageService.sendMessage(
        conversation._id,
        messageContent
      );

      // Add new message to list
      setMessages([...messages, response.message]);
      setMessageContent('');

      // Callback to parent
      if (onMessageSent) {
        onMessageSent(response.message);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      if (err.status === 403) {
        setError('Paid subscription required to send messages');
      } else {
        setError(err.message || 'Failed to send message');
      }
    } finally {
      setIsSending(false);
    }
  };

  // Get other user
  const getOtherUser = () => {
    if (!conversation) return null;
    return conversation.participants.find((p) => p._id !== currentUserId);
  };

  // Delete message
  const handleDeleteMessage = async (messageId) => {
    try {
      await messageService.deleteMessage(messageId);
      setMessages(messages.filter((m) => m._id !== messageId));
    } catch (err) {
      console.error('Error deleting message:', err);
      setError('Failed to delete message');
    }
  };

  // Format time
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const otherUser = getOtherUser();

  if (!conversation) {
    return (
      <div className="chat-window empty">
        <div className="chat-empty-state">
          <p>✦ Select a conversation to begin ✦</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {/* ============ HEADER ============ */}
      <div className="chat-header">
        <div className="chat-header-left">
          <h2 className="kinship-title">✦ Kinship Seeker ✦</h2>
          <p className="recipient-username">
            {otherUser?.username || 'User'}
          </p>
        </div>
        <div className="chat-header-right">
          <button
            className="chat-info-btn"
            title="Conversation info"
            onClick={() => {
              /* TODO: Show conversation details */
            }}
          >
            ℹ
          </button>
          <button
            className="chat-close-btn"
            onClick={onClose}
            title="Close conversation"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ============ MESSAGES ============ */}
      <div className="chat-messages">
        {isLoading ? (
          <div className="chat-loading">
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="chat-empty-messages">
            <p>✦ Begin your dark correspondence ✦</p>
            <p>No messages yet. Send the first letter to your kinship...</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message._id}
                className={`message ${
                  message.sender._id === currentUserId
                    ? 'sent'
                    : 'received'
                }`}
              >
                <div className="message-bubble">
                  <p className="message-content">{message.content}</p>
                  <div className="message-meta">
                    <span className="message-time">
                      {formatTime(message.createdAt)}
                    </span>
                    {message.isRead && (
                      <span className="message-read">✓✓</span>
                    )}
                  </div>
                </div>

                {message.sender._id === currentUserId && (
                  <button
                    className="message-delete-btn"
                    onClick={() => handleDeleteMessage(message._id)}
                    title="Delete message"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* ============ ERROR ============ */}
      {error && (
        <div className="chat-error">
          <p>{error}</p>
          <button
            className="chat-error-close"
            onClick={() => setError(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* ============ INPUT ============ */}
      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <div className="chat-input-wrapper">
          <input
            type="text"
            className="chat-input"
            placeholder="Write your dark message..."
            value={messageContent}
            onChange={(e) => {
              setMessageContent(e.target.value);
              setError(null);
            }}
            disabled={isSending}
            maxLength={500}
          />
          <span className="chat-char-count">
            {messageContent.length}/500
          </span>
        </div>

        <button
          type="submit"
          className="chat-send-btn"
          disabled={
            isSending || !messageContent.trim()
          }
          title="Send message"
        >
          {isSending ? '⏳' : '✦'}
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
