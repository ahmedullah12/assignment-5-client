import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/redux/features/auth/authApi";
import {
  useGetAllMessagesQuery,
  useSendMessageMutation,
} from "@/redux/features/rooms/roomsApi";
import { useAppSelector } from "@/redux/hook";
import { Bot, MessageCircle, Send, Trash2, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const user = useAppSelector(useCurrentUser);

  const { data: messages = [], isLoading } = useGetAllMessagesQuery({
    userId: user?.sub,
  });
  const [sendMessage, { isLoading: isPending }] = useSendMessageMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom();
    }
  }, [messages, shouldScrollToBottom]);

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [isOpen]);

  const isUserAtBottom = () => {
    if (!chatContainerRef.current) return true;

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const threshold = 100;
    return scrollHeight - scrollTop - clientHeight < threshold;
  };

  const handleScroll = () => {
    setShouldScrollToBottom(isUserAtBottom());
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    setShouldScrollToBottom(true);

    const userMessage = newMessage.trim();
    const payload = {
      user_id: user?.sub,
      message: userMessage,
    };
    console.log(payload);
    const res = await sendMessage(payload);

    if (res.data.success === true) {
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearMessages = () => {};

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative">
      {/* Chat Toggle Button */}
      <div
        className={`transition-all duration-300 fixed right-10 bottom-10 ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Chat Window - Now absolutely positioned */}
      {isOpen && (
        <div className="absolute bottom-[-100px] right-8 transition-all duration-300 transform animate-in slide-in-from-bottom-4 fade-in-0">
          <div className="bg-white rounded-2xl shadow-2xl w-96 h-[500px] flex flex-col border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Sarah</h3>
                  <p className="text-blue-100 text-xs">Always here to help</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {messages.length > 0 && (
                  <Button
                    onClick={clearMessages}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Container */}
            <div
              ref={chatContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Bot className="h-12 w-12 mb-2 text-gray-400" />
                  <p className="text-sm text-center">
                    Start a conversation with our room booking assistant!
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="space-y-2">
                    {/* User Message - Right Side */}
                    <div className="flex items-start space-x-2 justify-end">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg px-3 py-2 max-w-[220px]">
                        <p className="text-sm text-white">{msg.message}</p>
                        <p className="text-xs text-blue-100 mt-1">
                          {formatTimestamp(msg.timestamp)}
                        </p>
                      </div>
                      <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-3 w-3 text-white" />
                      </div>
                    </div>

                    {/* Bot Response - Left Side */}
                    <div className="flex items-start space-x-2">
                      <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-3 w-3 text-white" />
                      </div>
                      <div className="bg-white rounded-lg px-3 py-2 max-w-[220px] shadow-sm">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">
                          {msg.response}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTimestamp(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Loading indicator */}
              {isPending && (
                <div className="flex items-start space-x-2">
                  <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                  <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  rows={1}
                  disabled={isPending}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isPending}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-3"
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
