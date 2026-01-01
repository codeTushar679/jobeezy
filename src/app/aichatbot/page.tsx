"use client";
import { useState } from "react";
import axios from "axios";

type Message = {
  id: string;
  role: "user" | "system";
  content: string;
};

function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = crypto.randomUUID();
    const botId = crypto.randomUUID();
    const prompt = input.trim();
    if (!prompt || loading) return;

    setMessages((prev) => [...prev, { id: userId, role: "user", content: prompt }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/chat", { message: prompt})
      const reply:string = res.data.reply ?? "Sorry, I couldn't get a response.";

      setMessages((prev) => [ ...prev, { id: botId, role: "system", content: reply }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [ ...prev, { id: botId, role: "system", content: "Sorry, something went wrong while talking to the AI model." }]);
    } finally {
      setLoading(false);
    }
  }

    // Helper function to format AI response
  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map((line, idx) => {
        // Bold text (between **)
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Bullet points
        if (line.trim().startsWith('-')) {
          return <li key={idx} className="ml-4 text-sm">{line.replace(/^-\s*/, '')}</li>;
        }
        
        // Code blocks
        if (line.trim().startsWith('```')) {
          return null;
        }
        
        // Normal paragraphs
        if (line.trim()) {
          return <p key={idx} className="text-sm leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: line }} />;
        }
        
        return <div key={idx} className="h-2" />;
      })
      .filter(Boolean);
  };

  return (
    <div>
      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col h-[calc(100vh-4rem)]">
      <h1 className="text-3xl font-bold mb-1 text-gray-700 text-center">AI Chat Bot</h1>
      <p className="mb-5 text-gray-700 text-center">Your chat will not save after page refresh!</p>

      {/* Messages */}
      <div className="flex-1 border-2 border-gray-400 rounded-lg p-4 mb-4 overflow-y-auto bg-white">
        {messages.length === 0 ? (
          <p className="text-gray-400">
            Start the conversation by asking a question!
          </p>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-300 text-gray-900"
                  }`}
                >
                  {formatContent(m.content)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          className="outline-none flex-1 border border-gray-300 rounded-md px-3 py-2 resize-none h-20"
          placeholder="Type your question here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="self-end h-10 px-4 rounded-md bg-gray-700 text-white font-medium hover:cursor-pointer hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Thinking" : "Ask"}
        </button>
      </form>
    </div>
    </div>
  )
}

export default ChatbotPage