// import { MessageSquare, X } from "lucide-react";
// import { useCallback, useEffect, useRef, useState } from "react";
// import moment from "moment";
// // import MessageInput from "./MessageInput";
// import styles from "../Styles/Chat.module.css";
// import MessageInput from "./MessageInput";

// import { useAuth, useUser } from "@clerk/clerk-react";
// import { useChatStore } from "../store/useChatStore";

// // const currentUser = {
// //   id: "clerk_999",
// //   imageUrl: "https://i.pravatar.cc/150?img=6",
// // };

// // const onlineUsers = ["clerk_101"];

// // const dummyMessages = [
// //   {
// //     _id: "1",
// //     text: "Hi there!",
// //     fromClerkId: "clerk_101",
// //     createdAt: moment().subtract(2, "minutes").toISOString(),
// //   },
// //   {
// //     _id: "2",
// //     text: "Hey! How are you?",
// //     fromClerkId: "clerk_999",
// //     createdAt: moment().subtract(1, "minutes").toISOString(),
// //   },
// //   {
// //     _id: "3",
// //     text: "I'm good, thanks for asking.",
// //     fromClerkId: "clerk_101",
// //     createdAt: moment().subtract(30, "seconds").toISOString(),
// //   },
// // ];

// const Chat = () => {
//   // const [selectedUser, setSelectedUser] = useState(dummyUser);

//   // const fileInputRef = useRef(null);
//   const messageEndRef = useRef(null);
//   const { getToken } = useAuth();
//   const { user } = useUser();
//   const {
//     messages,
//     selectedUser,
//     setSelectedUser,
//     getMessages,
//     initializeSocket,
//     disconnectSocket,
//     subscribeToMessages,
//     unsubscribeFromMessages,
//     onlineUsers,
//   } = useChatStore();

//   const setupSocket = useCallback(async () => {
//     const token = await getToken({ template: "1_token_vinag" });
//     if (token) {
//       initializeSocket(token);
//     }
//   }, [getToken, user?.id, initializeSocket]);

//   // socket Initialization Effect
//   useEffect(() => {
//     setupSocket();
//     return () => disconnectSocket();
//   }, [setupSocket, disconnectSocket]);

//   const fetchMessages = useCallback(async () => {
//     const token = await getToken({ template: "1_token_vinag" });
//     if (token && selectedUser) {
//       getMessages(selectedUser.clerkUserId, token);
//       subscribeToMessages();
//     }
//   }, [selectedUser, getMessages, getToken, subscribeToMessages]);

//   useEffect(() => {
//     if (selectedUser) fetchMessages();
//     return () => unsubscribeFromMessages();
//   }, [selectedUser, fetchMessages, unsubscribeFromMessages]);

//   // Auto-scroll to bottom when new messages arrive
//   useEffect(() => {
//     if (messageEndRef.current && messages.length > 0) {
//       messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);
//   // In your Chat component

//   if (!selectedUser) return <div>Select a user to start chatting</div>;

//   return (
//     <div className={styles.chatContainer}>
//       <div className={styles.chatHeader}>
//         <div className="flex items-center justify-between w-full">
//           <div className="flex items-center gap-3">
//             <div className={styles.avatarContainer}>
//               <img
//                 src={selectedUser.profileImage || "/avatar.png"}
//                 alt={selectedUser.firstName}
//                 className="w-full h-full object-cover rounded-full"
//               />
//               {onlineUsers.includes(selectedUser.clerkUserId) && (
//                 <span className={styles.onlineIndicator} />
//               )}
//             </div>
//             <div>
//               <h3 className="font-medium text-sm md:text-base">
//                 {selectedUser.firstName}
//               </h3>
//               <p className="text-xs text-base-content/70">
//                 {onlineUsers.includes(selectedUser.clerkUserId)
//                   ? "Online"
//                   : "Offline"}
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={() => setSelectedUser(null)}
//             className="btn btn-sm btn-ghost"
//             aria-label="Close chat"
//           >
//             <X size={20} />
//           </button>
//         </div>
//       </div>

//       <div className={styles.messagesArea}>
//         {messages.length > 0 ? (
//           messages.map((message, index) => (
//             <div
//               key={message._id}
//               className={`chat ${
//                 message.fromClerkId === user.id ? "chat-end" : "chat-start"
//               }`}
//               ref={index === messages.length - 1 ? messageEndRef : null}
//             >
//               <div className="chat-image avatar">
//                 <div className={styles.chatImage}>
//                   <img
//                     src={
//                       message.fromClerkId === user.id
//                         ? user.imageUrl || "/avatar.png"
//                         : selectedUser.profileImage || "/avatar.png"
//                     }
//                     alt="profile pic"
//                     className="w-full h-full object-cover rounded-full"
//                   />
//                 </div>
//               </div>
//               <div className={styles.chatHeaderText}>
//                 <time className={styles.chatTimestamp}>
//                   {moment(message.createdAt).fromNow()}
//                 </time>
//               </div>
//               <div className={styles.chatBubble}>
//                 {message.image && (
//                   <img
//                     src={message.image}
//                     alt="Attachment"
//                     className="max-w-full sm:max-w-xs md:max-w-sm rounded-md mb-2"
//                     loading="lazy"
//                   />
//                 )}
//                 {message.text && <p className="break-words">{message.text}</p>}
//               </div>
//               {index === messages.length - 1 && <div id="message-end" />}
//             </div>
//           ))
//         ) : (
//           <div className={styles.emptyState}>
//             <div className="flex gap-4 mb-4">
//               <div className="relative">
//                 <div className={styles.emptyIcon}>
//                   <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-primary" />
//                 </div>
//               </div>
//             </div>
//             <h2 className={styles.emptyTitle}>Start your Conversation</h2>
//           </div>
//         )}
//       </div>

//       <div className={styles.messageInputContainer}>
//         <MessageInput />
//       </div>
//     </div>
//   );
// };

// export default Chat;

// =========================================
import { MessageSquare, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import moment from "moment";
// import MessageInput from "./MessageInput";
import styles from "../Styles/Chat.module.css";
import MessageInput from "./MessageInput";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useChatStore } from "../store/useChatStore";

// const dummyUser = {
//   firstName: "Alice",
//   lastName: "Johnson",
//   profileImage: "https://i.pravatar.cc/150?img=1",
//   clerkUserId: "clerk_101",
// };

// const currentUser = {
//   id: "clerk_999",
//   imageUrl: "https://i.pravatar.cc/150?img=6",
// };

const onlineUsers = ["clerk_101"];

// const dummyMessages = [
//   {
//     _id: "1",
//     text: "Hi there!",
//     fromClerkId: "clerk_101",
//     createdAt: moment().subtract(2, "minutes").toISOString(),
//   },
//   {
//     _id: "2",
//     text: "Hey! How are you?",
//     fromClerkId: "clerk_999",
//     createdAt: moment().subtract(1, "minutes").toISOString(),
//   },
//   {
//     _id: "3",
//     text: "I'm good, thanks for asking.",
//     fromClerkId: "clerk_101",
//     createdAt: moment().subtract(30, "seconds").toISOString(),
//   },
// ];

const Chat = () => {
  // const [selectedUser, setSelectedUser] = useState(dummyUser);

  // const fileInputRef = useRef(null);
  const messageEndRef = useRef(null);
  const { getToken } = useAuth();
  const { user } = useUser();
  const {
    messages,
    selectedUser,
    setSelectedUser,
    getMessages,
    initalizeSocket,
    disconnectSocket,
    subscribeToMessages,
    unsubscribeFromMessages,
    onlineUsers,
  } = useChatStore();

  console.log(messages);

  const setupSocket = useCallback(async () => {
    const token = await getToken({ template: "1_token_vinag" });
    if (token) {
      initalizeSocket(token);
    }
  }, [getToken, user?.id, initalizeSocket]);

  //Socket Initalization Effect
  useEffect(() => {
    setupSocket();

    return () => disconnectSocket();
  }, [setupSocket, disconnectSocket]);

  const fetchMessages = useCallback(async () => {
    const token = await getToken({ template: "1_token_vinag" });
    if (token && selectedUser) {
      getMessages(selectedUser.clerkUserId, token);
      subscribeToMessages();
    }
  }, [selectedUser, getMessages, getToken, subscribeToMessages]);

  useEffect(() => {
    if (selectedUser) fetchMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser, fetchMessages, unsubscribeFromMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // In your Chat component

  // if (!selectedUser) return <div>Select a user to start chatting</div>;

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className={styles.avatarContainer}>
              <img
                src={selectedUser.profileImage || "/avatar.png"}
                alt={selectedUser.firstName}
                className="w-full h-full object-cover rounded-full"
              />
              {onlineUsers.includes(selectedUser.clerkUserId) && (
                <span className={styles.onlineIndicator} />
              )}
            </div>
            <div>
              <h3 className="font-medium text-sm md:text-base">
                {selectedUser.firstName}
              </h3>
              <p className="text-xs text-base-content/70">
                {onlineUsers.includes(selectedUser.clerkUserId)
                  ? "Online"
                  : "Offline"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedUser(null)}
            className="btn btn-sm btn-ghost"
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      {/* Message Area */}
      <div className={styles.messagesArea}>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={message._id}
              className={`chat ${
                message.fromClerkId === user.id ? "chat-end" : "chat-start"
              }`}
              ref={index === messages.length - 1 ? messageEndRef : null}
            >
              <div className="chat-image avatar">
                <div className={styles.chatImage}>
                  <img
                    src={
                      message.fromClerkId === user.id
                        ? user.imageUrl || "/avatar.png"
                        : selectedUser.profileImage || "/avatar.png"
                    }
                    alt="profile pic"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <div className={styles.chatHeaderText}>
                <time className={styles.chatTimestamp}>
                  {moment(message.createdAt).fromNow()}
                </time>
              </div>
              <div className={styles.chatBubble}>
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="max-w-full sm:max-w-xs md:max-w-sm rounded-md mb-2"
                    loading="lazy"
                  />
                )}
                {message.text && <p className="break-words">{message.text}</p>}
              </div>
              {index === messages.length - 1 && <div id="message-end" />}
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <div className="flex gap-4 mb-4">
              <div className="relative">
                <div className={styles.emptyIcon}>
                  <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                </div>
              </div>
            </div>
            <h2 className={styles.emptyTitle}>Start your Conversation</h2>
          </div>
        )}
      </div>

      <div className={styles.messageInputContainer}>
        <MessageInput />
      </div>
    </div>
  );
};

export default Chat;
