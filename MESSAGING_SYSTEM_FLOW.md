# User-Vendor Messaging System - Implementation Flow

## Overview

This document outlines the complete flow for implementing a real-time messaging system between users and vendors, similar to the existing vendor inbox system but from the user's perspective.

---

--- Quick Start Summary ---

- **Reuse `request_pricings`**: keep the existing table exactly as-is; it is the source of truth for who contacted which vendor.
- **Add `conversations`**: one row per user ↔ vendor thread, linked back to the relevant `request_pricings.id` (if it originated from a pricing request).
- **Add `messages`**: one row per message inside a conversation.
- **Booked vendor view**: when a pricing request transitions to `status = "booked"`, surface that vendor both in the booked list and in the messaging UI (the same `conversation` row is reused—no duplication).

The rest of this document expands on these three tables and the supporting APIs/socket flow.

## 1. Database Schema Design

### 1.1 Tables Required

#### **Conversations Table**

- Purpose: Links a user and vendor together for a conversation thread
- Fields:
  - `id` (Primary Key, Auto-increment)
  - `userId` (Foreign Key → Users table)
  - `vendorId` (Foreign Key → Vendors table)
  - `requestId` (Foreign Key → Requests table, nullable - links to original enquiry)
  - `lastMessageAt` (Timestamp - for sorting conversations)
  - `lastMessagePreview` (String - preview of last message)
  - `userUnreadCount` (Integer - unread messages for user)
  - `vendorUnreadCount` (Integer - unread messages for vendor)
  - `isArchivedByUser` (Boolean - user can archive)
  - `isArchivedByVendor` (Boolean - vendor can archive)
  - `createdAt` (Timestamp)
  - `updatedAt` (Timestamp)
- Indexes: `userId`, `vendorId`, `requestId`, `lastMessageAt`

#### **Messages Table**

- Purpose: Stores individual messages in conversations
- Fields:
  - `id` (Primary Key, Auto-increment)
  - `conversationId` (Foreign Key → Conversations table)
  - `senderId` (Integer - userId or vendorId)
  - `senderType` (Enum: 'user' | 'vendor')
  - `message` (Text - message content)
  - `isRead` (Boolean - read status)
  - `readAt` (Timestamp, nullable)
  - `createdAt` (Timestamp)
  - `updatedAt` (Timestamp)
- Indexes: `conversationId`, `senderId`, `createdAt`

#### **Connection to Existing Tables**

- **Requests Table**: Already exists (from enquiry system)
  - When user sends pricing request, create a conversation linked to `requestId`
  - This connects messaging to the original enquiry

---

## 2. Backend Implementation Flow

### 2.1 Sequelize Models Setup

#### **Conversation Model**

- Define model with all fields
- Set up associations:
  - `belongsTo(User)` - userId
  - `belongsTo(Vendor)` - vendorId
  - `belongsTo(Request)` - requestId (optional)
  - `hasMany(Message)` - messages in conversation
- Add scopes for filtering (active, archived, etc.)

#### **Message Model**

- Define model with all fields
- Set up associations:
  - `belongsTo(Conversation)` - conversationId
- Add hooks:
  - `afterCreate` - update conversation's `lastMessageAt` and `lastMessagePreview`
  - `afterCreate` - increment unread count for recipient

### 2.2 API Endpoints Structure

#### **User-Side Endpoints** (`/api/user/messages`)

1. **GET `/api/user/messages/conversations`**

   - Purpose: Get all conversations for logged-in user
   - Query params: `filter` (all, unread, archived)
   - Response: Array of conversations with vendor details and last message
   - Flow:
     - Extract userId from JWT token
     - Query conversations where `userId` matches and `isArchivedByUser = false` (if filter !== 'archived')
     - Include vendor details (name, businessName, image)
     - Include last message preview
     - Sort by `lastMessageAt` DESC
     - Return with counts (total, unread, archived)

2. **GET `/api/user/messages/conversations/:conversationId`**

   - Purpose: Get single conversation details
   - Response: Full conversation with vendor info
   - Flow:
     - Verify user owns this conversation
     - Return conversation with vendor details

3. **GET `/api/user/messages/conversations/:conversationId/messages`**

   - Purpose: Get all messages in a conversation
   - Query params: `page`, `limit` (for pagination)
   - Response: Array of messages with sender info
   - Flow:
     - Verify user owns this conversation
     - Fetch messages with pagination
     - Mark messages as read (update `isRead = true` for vendor-sent messages)
     - Update `userUnreadCount` to 0
     - Return messages sorted by `createdAt` ASC

4. **POST `/api/user/messages/conversations/:conversationId/messages`**

   - Purpose: Send a message in a conversation
   - Body: `{ message: string }`
   - Response: Created message object
   - Flow:
     - Verify user owns this conversation
     - Create message record with `senderType = 'user'`
     - Update conversation: `lastMessageAt`, `lastMessagePreview`, `vendorUnreadCount++`
     - Emit socket event to vendor (if online)
     - Return created message

5. **POST `/api/user/messages/conversations/create`**

   - Purpose: Create new conversation (when user initiates chat)
   - Body: `{ vendorId: number, requestId?: number }`
   - Response: Created conversation object
   - Flow:
     - Check if conversation already exists for this user+vendor+requestId
     - If exists, return existing conversation
     - If not, create new conversation
     - Link to requestId if provided (from pricing enquiry)
     - Return conversation

6. **PATCH `/api/user/messages/conversations/:conversationId/read`**

   - Purpose: Mark all messages in conversation as read
   - Response: Success status
   - Flow:
     - Update all unread messages in conversation to `isRead = true`
     - Reset `userUnreadCount` to 0

7. **PATCH `/api/user/messages/conversations/:conversationId/archive`**

   - Purpose: Archive/unarchive conversation
   - Body: `{ archived: boolean }`
   - Response: Success status
   - Flow:
     - Update `isArchivedByUser` flag
     - Return success

8. **GET `/api/user/messages/stats`**
   - Purpose: Get message statistics for user
   - Response: `{ total: number, unread: number, archived: number }`
   - Flow:
     - Count conversations by status
     - Return stats

#### **Vendor-Side Endpoints** (Similar structure at `/api/vendor/messages`)

- Same endpoints but from vendor perspective
- Filter by `vendorId` instead of `userId`
- Use `isArchivedByVendor` flag
- Update `vendorUnreadCount` instead of `userUnreadCount`

### 2.3 Socket.IO Implementation

#### **Server Setup**

- Install `socket.io` and `socket.io-client`
- Integrate with Express server
- Use JWT authentication for socket connections

#### **Socket Events**

**Connection Flow:**

1. Client connects with JWT token
2. Server verifies token and extracts userId/vendorId
3. Store socket connection in memory/Redis with user identifier
4. Join room: `user:${userId}` or `vendor:${vendorId}`

**Events to Handle:**

**User Side:**

- `join:conversation` - Join a specific conversation room
- `leave:conversation` - Leave conversation room
- `send:message` - Send message (also handled via REST API)
- `typing:start` - User is typing
- `typing:stop` - User stopped typing

**Vendor Side:**

- Same events as user side

**Server Emits:**

- `message:received` - New message received (to recipient)
- `message:sent` - Message sent confirmation (to sender)
- `typing:indicator` - Show typing indicator
- `conversation:updated` - Conversation metadata updated (unread count, etc.)
- `online:status` - User/vendor online status

**Socket Room Structure:**

- `conversation:${conversationId}` - Both user and vendor join this room
- `user:${userId}` - User's personal room
- `vendor:${vendorId}` - Vendor's personal room

**Message Flow via Socket:**

1. User sends message via REST API or socket
2. Server saves message to database
3. Server emits `message:received` to `conversation:${conversationId}` room
4. Both user and vendor receive the message in real-time
5. Server emits `conversation:updated` to update unread counts

### 2.4 Middleware & Authentication

- **Auth Middleware**: Verify JWT token for all endpoints
- **Ownership Middleware**: Verify user/vendor owns the conversation
- **Rate Limiting**: Prevent message spam
- **Validation**: Validate message content (length, sanitization)

### 2.5 Integration with Existing Enquiry System

**Connection Point:**

- When user submits pricing request via `PricingModal.jsx`
- After successful request creation:
  - Automatically create a conversation linked to `requestId`
  - This allows messaging to continue from the enquiry

**Flow:**

1. User fills pricing request form
2. POST to `/api/request-pricing` (existing endpoint)
3. On success, create conversation:
   - `userId` = logged-in user
   - `vendorId` = vendor from request
   - `requestId` = newly created request ID
4. User can now see this vendor in messages list
5. Both user and vendor can start messaging

---

## 3. Frontend Implementation Flow

### 3.1 Socket.IO Client Setup

**Installation:**

```bash
npm install socket.io-client
```

**Socket Context/Provider:**

- Create `SocketContext` to manage socket connection
- Connect on app load (if user is authenticated)
- Store socket instance in context
- Handle reconnection logic
- Clean up on logout

**Connection Flow:**

1. Check if user is logged in (from Redux store)
2. Get JWT token
3. Connect to socket server with token
4. Join user's personal room: `user:${userId}`
5. Listen for incoming events
6. Handle disconnection and reconnection

### 3.2 API Service Layer

**Create `src/services/api/messagesApi.js`:**

- Functions for all message-related API calls
- Use axios instance with auth token
- Handle errors appropriately

**Functions:**

- `getConversations(filter)` - Fetch user's conversations
- `getConversation(conversationId)` - Get single conversation
- `getMessages(conversationId, page, limit)` - Get messages
- `sendMessage(conversationId, message)` - Send message
- `markAsRead(conversationId)` - Mark conversation as read
- `archiveConversation(conversationId, archived)` - Archive/unarchive
- `createConversation(vendorId, requestId)` - Create new conversation
- `getStats()` - Get message statistics

### 3.3 Messages Component Updates

**Current State (`Messages.jsx`):**

- Uses hardcoded `vendors` and `sampleMessages`
- No backend integration

**Updates Required:**

1. **State Management:**

   - Replace hardcoded data with API calls
   - Add loading states
   - Add error handling
   - Manage conversations list
   - Manage active conversation messages

2. **Data Fetching:**

   - On component mount: Fetch conversations list
   - On vendor selection: Fetch messages for that conversation
   - Implement pagination for messages (infinite scroll)

3. **Socket Integration:**

   - Listen for `message:received` event
   - Update messages state when new message arrives
   - Show typing indicators
   - Update unread counts
   - Scroll to bottom on new message

4. **Send Message Flow:**

   - User types message
   - On send:
     - Optimistically add message to UI
     - Call API to send message
     - On success: Confirm message sent
     - On error: Show error, remove optimistic message
   - Emit socket event for real-time delivery

5. **Vendor List:**

   - Fetch from `/api/user/messages/conversations`
   - Show vendor name, last message preview, unread count
   - Show badge for unread messages
   - Sort by `lastMessageAt` (most recent first)

6. **Message Display:**

   - Show messages with sender info
   - Differentiate user vs vendor messages (styling)
   - Show timestamps
   - Show read receipts (optional)

7. **Real-time Updates:**

   - When new message arrives via socket:
     - Add to messages array
     - Update conversation list (last message preview)
     - Increment unread count if not active conversation
     - Scroll to bottom
     - Play notification sound (optional)

8. **Mark as Read:**
   - When user opens conversation, mark as read
   - Call API to update read status
   - Update unread counts

### 3.4 Redux/State Management (Optional)

**If using Redux:**

- Create `messagesSlice` for:
  - Conversations list
  - Active conversation
  - Messages for active conversation
  - Unread counts
  - Loading states
- Actions:
  - `fetchConversations`
  - `selectConversation`
  - `fetchMessages`
  - `sendMessage`
  - `receiveMessage` (from socket)
  - `markAsRead`
  - `updateUnreadCounts`

### 3.5 Component Structure

**Recommended Structure:**

```
Messages.jsx (Main Container)
├── ConversationsList.jsx (Left sidebar - vendor list)
├── ChatPanel.jsx (Right side - chat interface)
│   ├── ChatHeader.jsx (Vendor info, online status)
│   ├── MessagesList.jsx (Scrollable messages)
│   ├── QuickReplies.jsx (Quick action chips)
│   └── MessageInput.jsx (Input field, send button)
└── SocketProvider.jsx (Socket context wrapper)
```

### 3.6 Features to Implement

1. **Conversation List:**

   - Show all vendors user has messaged
   - Show last message preview
   - Show unread badge
   - Show timestamp of last message
   - Filter: All, Unread, Archived

2. **Chat Interface:**

   - Display messages chronologically
   - Show sender name and avatar
   - Show timestamps
   - Auto-scroll to bottom
   - Loading states
   - Empty states

3. **Real-time Features:**

   - Live message delivery
   - Typing indicators
   - Online/offline status
   - Read receipts (optional)

4. **User Experience:**
   - Smooth scrolling
   - Message animations
   - Notification sounds (optional)
   - Desktop notifications (optional)
   - Responsive design

---

## 4. Complete Message Flow Diagram

### 4.1 User Sends Message

```
User Types Message
    ↓
User Clicks Send
    ↓
Frontend: Optimistically Add Message to UI
    ↓
Frontend: Call POST /api/user/messages/conversations/:id/messages
    ↓
Backend: Validate & Save Message to Database
    ↓
Backend: Update Conversation (lastMessageAt, vendorUnreadCount++)
    ↓
Backend: Emit Socket Event to conversation:${id} room
    ↓
Socket: Broadcast message:received to all in room
    ↓
Frontend (User): Confirm message sent (already in UI)
Frontend (Vendor): Receive message in real-time
    ↓
Vendor's Unread Count Updates
```

### 4.2 User Receives Message

```
Vendor Sends Message (via API or Socket)
    ↓
Backend: Save Message to Database
    ↓
Backend: Update Conversation (lastMessageAt, userUnreadCount++)
    ↓
Backend: Emit Socket Event to conversation:${id} room
    ↓
Socket: Broadcast message:received
    ↓
Frontend (User): Listen for message:received event
    ↓
Frontend: Add Message to State
    ↓
If Active Conversation: Display immediately, mark as read
If Not Active: Update unread count, show notification
```

### 4.3 User Opens Conversation

```
User Clicks on Vendor in List
    ↓
Frontend: Set Active Conversation
    ↓
Frontend: Call GET /api/user/messages/conversations/:id/messages
    ↓
Backend: Return Messages (paginated)
    ↓
Backend: Mark Messages as Read (isRead = true)
    ↓
Backend: Reset userUnreadCount to 0
    ↓
Frontend: Display Messages
    ↓
Frontend: Scroll to Bottom
    ↓
Frontend: Join Socket Room for this conversation
```

---

## 5. Integration Points

### 5.1 Pricing Request → Conversation

**When:** User submits pricing request via `PricingModal.jsx`

**Flow:**

1. User fills form and submits
2. POST to `/api/request-pricing` (existing)
3. On success response:
   - Extract `requestId` and `vendorId` from response
   - Call `createConversation(vendorId, requestId)`
   - Navigate to messages page (optional)
   - Show success message

**Code Location:** `PricingModal.jsx` - `handleSubmit` function

### 5.2 Vendor Inbox → Messaging

**Connection:**

- Vendor can reply to enquiry via messaging
- When vendor clicks "Reply to Enquiry" in `EnquiryManagement.jsx`
- Open messaging interface (similar to user side)
- Conversation already exists (created when user sent pricing request)

---

## 6. Security Considerations

1. **Authentication:**

   - All endpoints require JWT token
   - Socket connections authenticated with JWT

2. **Authorization:**

   - Users can only access their own conversations
   - Vendors can only access conversations they're part of
   - Verify ownership before any operation

3. **Input Validation:**

   - Sanitize message content
   - Limit message length
   - Prevent XSS attacks

4. **Rate Limiting:**

   - Limit messages per minute per user
   - Prevent spam

5. **Data Privacy:**
   - Messages encrypted at rest (optional)
   - Secure socket connections (WSS)

---

## 7. Testing Strategy

### 7.1 Backend Testing

- Unit tests for models
- Integration tests for API endpoints
- Socket event testing
- Authentication/authorization tests

### 7.2 Frontend Testing

- Component rendering tests
- API integration tests
- Socket event handling tests
- User interaction tests

### 7.3 End-to-End Testing

- Complete message flow
- Real-time delivery
- Multiple users/vendors
- Concurrent conversations

---

## 8. Deployment Considerations

1. **Database Migrations:**

   - Create tables using Sequelize migrations
   - Add indexes for performance

2. **Socket.IO Scaling:**

   - Use Redis adapter for multiple server instances
   - Handle sticky sessions

3. **Performance:**

   - Paginate messages (don't load all at once)
   - Index database properly
   - Cache conversation lists (optional)

4. **Monitoring:**
   - Log message send/receive events
   - Monitor socket connections
   - Track API response times

---

## 9. Future Enhancements

1. **File Attachments:**

   - Support image/file uploads
   - Store in cloud storage
   - Display in messages

2. **Message Status:**

   - Sent, Delivered, Read indicators
   - Typing indicators
   - Online/offline status

3. **Search:**

   - Search messages within conversation
   - Search across all conversations

4. **Notifications:**

   - Push notifications for new messages
   - Email notifications (optional)
   - Desktop notifications

5. **Rich Messages:**
   - Emoji support
   - Link previews
   - Quote/reply to messages

---

## 10. Implementation Checklist

### Backend

- [ ] Create database migrations for Conversations and Messages tables
- [ ] Create Sequelize models with associations
- [ ] Implement user-side API endpoints
- [ ] Implement vendor-side API endpoints
- [ ] Set up Socket.IO server
- [ ] Implement socket authentication
- [ ] Create socket event handlers
- [ ] Add middleware for auth and validation
- [ ] Integrate with existing request-pricing endpoint
- [ ] Add error handling and logging
- [ ] Write tests

### Frontend

- [ ] Install socket.io-client
- [ ] Create Socket context/provider
- [ ] Create messages API service
- [ ] Update Messages.jsx component
- [ ] Implement conversation list
- [ ] Implement chat interface
- [ ] Add real-time message handling
- [ ] Add typing indicators
- [ ] Add unread count badges
- [ ] Integrate with PricingModal
- [ ] Add loading and error states
- [ ] Make responsive
- [ ] Test thoroughly

---

## Summary

This messaging system connects users and vendors through real-time communication, linked to the existing enquiry system. The flow involves:

1. **Database**: Conversations and Messages tables
2. **Backend**: REST APIs + Socket.IO for real-time
3. **Frontend**: React components with socket integration
4. **Integration**: Links to pricing requests/enquiries

The system supports bidirectional messaging, read receipts, unread counts, archiving, and real-time delivery through WebSockets.
