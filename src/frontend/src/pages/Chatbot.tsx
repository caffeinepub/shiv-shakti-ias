import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
  time: string;
}

const MOCK_RESPONSES: Record<string, string> = {
  default:
    "That's a great question! For UPSC preparation, I recommend focusing on NCERT books first, then moving to standard references. Make sure to revise regularly and practice with previous year questions.",
  prelims:
    "For UPSC Prelims, cover all NCERT books (6-12), study Laxmikant for Polity, Bipin Chandra for History, and follow current affairs from The Hindu/Indian Express daily. Solve at least 50 mock questions every day.",
  mains:
    "UPSC Mains requires deep conceptual understanding and answer writing skills. Practice writing 150-250 word answers daily. Focus on multi-dimensional approach covering economic, social, political, and environmental aspects.",
  essay:
    "For Essay writing, choose a topic you understand well. Structure: Introduction (hook + thesis), Body (3-4 main arguments with examples), Conclusion (way forward). Practice 2 essays per week.",
  interview:
    "For the UPSC Interview (Personality Test), stay updated on current affairs, know your DAF thoroughly, practice mock interviews, and develop a calm, analytical approach to questions.",
};

function getBotResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("prelims")) return MOCK_RESPONSES.prelims;
  if (lower.includes("mains")) return MOCK_RESPONSES.mains;
  if (lower.includes("essay")) return MOCK_RESPONSES.essay;
  if (lower.includes("interview")) return MOCK_RESPONSES.interview;
  return MOCK_RESPONSES.default;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 0,
    role: "bot",
    text: "Hello! I'm your UPSC doubt-solving assistant. Ask me anything about UPSC preparation — prelims, mains, essay, interview, or any specific subject!",
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMsg]);
    const captured = input;
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        role: "bot",
        text: getBotResponse(captured),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div
      className="container mx-auto px-4 py-10 max-w-3xl"
      data-ocid="chatbot.page"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col"
        style={{ height: "70vh" }}
      >
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-navy">UPSC Doubt Solver</h1>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />{" "}
              Online
            </p>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4"
        >
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                data-ocid={`chatbot.item.${msg.id}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "bot" ? "bg-navy" : "bg-primary"}`}
                >
                  {msg.role === "bot" ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${msg.role === "bot" ? "bg-secondary text-foreground rounded-tl-sm" : "bg-primary text-white rounded-tr-sm"}`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <p
                    className={`text-xs mt-1 ${msg.role === "bot" ? "text-muted-foreground" : "text-white/70"}`}
                  >
                    {msg.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <div className="flex gap-3" data-ocid="chatbot.loading_state">
              <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-muted-foreground"
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Ask your UPSC doubt..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1"
            data-ocid="chatbot.input"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-4"
            data-ocid="chatbot.submit_button"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
