import React, { useState, useMemo } from 'react';
import messageService from '../services/MessageService';
import '../styles/ConversationsList.css';

const ConversationsList = ({
  conversations,
  currentUserId,
  onSelectConversation,
  onCreateNew,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Filter conversations by search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;

    const query = searchQuery.toLowerCase();
    return conversations.filter((conv) => {
      const otherUser = conv.participants.find((p) => p._id !== currentUserId);
      return otherUser?.username?.toLowerCase().includes(query);
    });
  }, [conversations, searchQuery, currentUserId]);

  // Handle create new conversation
  const handleCreateNew = async () => {
    setIsCreating(true);
    try {
      setError(null);
      await onCreateNew();
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError(err.message || 'Failed to create conversation');
    } finally {
      setIsCreating(false);
    }
  };

  // Get other user from conversation
  const getOtherUser = (conv) => {
    return conv.participants.find((p) => p._id !== currentUserId);
  };

  // Format time for last message
  const formatMessageTime = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  // Get avatar initials
  const getInitials = (username) => {
    return username?.substring(0, 2).toUpperCase() || '??';
  };

  return (
    <div className="conversations-list">
      {/* ============ HEADER ============ */}
      <div className="conversations-header">
        <h3 className="conversations-title">✦ Connections ✦</h3>
        <button
          className="new-chat-btn"
          onClick={handleCreateNew}
          disabled={isCreating}
          title="Start new conversation"
        >
          +
        </button>
      </div>

      {/* ============ SEARCH ============ */}
      <div className="conversations-search">
        <input
          type="text"
          className="search-input"
          placeholder="Search kinships..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className="search-clear-btn"
            onClick={() => setSearchQuery('')}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* ============ ERROR ============ */}
      {error && (
        <div className="conversations-error">
          <p>{error}</p>
        </div>
      )}

      {/* ============ CONVERSATIONS ============ */}
      <div className="conversations-scroll">
        {filteredConversations.length === 0 ? (
          <div className="conversations-empty">
            <p>✦ No connections yet ✦</p>
            {searchQuery ? (
              <p>No kinship found matching "{searchQuery}"</p>
            ) : (
              <>
                <p>Start a new conversation to find your dark match</p>
                <button
                  className="start-chat-link"
                  onClick={handleCreateNew}
                  disabled={isCreating}
                >
                  Find Kinship
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="conversations-items">
            {filteredConversations.map((conversation) => {
              const otherUser = getOtherUser(conversation);
              const lastMessage = conversation.lastMessage;

              return (
                <div
                  key={conversation._id}
                  className="conversation-item"
                  onClick={() => onSelectConversation(conversation)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      onSelectConversation(conversation);
                    }
                  }}
                >
                  {/* ============ AVATAR ============ */}
                  <div className="conversation-avatar">
                    {otherUser?.avatar ? (
                      <img
                        src={otherUser.avatar}
                        alt={otherUser.username}
                      />
                    ) : (
                      <span className="avatar-initials">
                        {getInitials(otherUser?.username)}
                      </span>
                    )}
                  </div>

                  {/* ============ CONTENT ============ */}
                  <div className="conversation-content">
                    <div className="conversation-header-row">
                      <h4 className="conversation-username">
                        {otherUser?.username || 'User'}
                      </h4>
                      {lastMessage && (
                        <span className="conversation-time">
                          {formatMessageTime(
                            lastMessage.createdAt
                          )}
                        </span>
                      )}
                    </div>

                    {lastMessage ? (
                      <p className="conversation-preview">
                        {lastMessage.content}
                      </p>
                    ) : (
                      <p className="conversation-preview">
                        No messages yet...
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsList;
