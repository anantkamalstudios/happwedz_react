import { useState, useEffect, useRef } from "react";
import axios from "../../services/api/axiosInstance";

// The greeting is message[0] of every conversation. It is never sent to the
// backend as history and never rendered as a bubble — both surfaces skip
// index 0 — it exists so `messages.length === 1` can mean "nothing said yet".
export const INITIAL_MSG = {
    role: "ai",
    content: "Namaste! 🙏 I'm Shaadi AI, your personal wedding planning assistant.\n\nTell me what you're looking for — a venue, photographer, mehendi artist, decorator, DJ, or a full wedding plan?\n\n✨ Try these AI features:\n• /personality-quiz - Discover your wedding style\n• /culture-blender - Blend two cultures\n• /conflict-resolver - Resolve wedding decisions\n• /timeline-generator - Create your wedding timeline\n\n💡 Tip: You can also just say \"I want to take personality quiz\" or \"help me blend cultures\" and I'll understand!"
};

// The full-page assistant and the corner widget share one history, so a chat
// started in the corner can be picked up on /shaadi-ai and vice versa.
export const CHAT_STORAGE_KEY = "shaadi_ai_chats";

// The openers offered on an empty conversation. Shared, so the corner widget
// suggests exactly what the full page suggests — the first two go to the model,
// the last four open a guided feature.
export const STARTER_PROMPTS = [
    { icon: "💍", title: "Plan Wedding", subtitle: "Plan a full wedding in Mumbai for 15 lakhs", send: "Plan a full wedding in Mumbai for 15 lakhs" },
    { icon: "🏰", title: "Bohemian Venue", subtitle: "Find me a bohemian venue in Delhi", send: "Find me a bohemian venue in Delhi" },
    { icon: "💕", title: "Personality Quiz", subtitle: "Discover your unique wedding style", send: "/personality-quiz" },
    { icon: "✨", title: "Culture Blender", subtitle: "Blend two cultures beautifully", send: "/culture-blender" },
    { icon: "⚖️", title: "Conflict Resolver", subtitle: "Resolve wedding decisions together", send: "/conflict-resolver" },
    { icon: "📅", title: "Timeline Generator", subtitle: "Create your wedding timeline", send: "/timeline-generator" }
];

// The four guided features. Each is a form rendered inline in the transcript
// rather than a call to /ai/chat — it collects structured answers and posts to
// its own endpoint. See ChatFeatures.jsx.
const SLASH_COMMANDS = {
    "/personality-quiz": "personality-quiz",
    "/culture-blender": "culture-blender",
    "/conflict-resolver": "conflict-resolver",
    "/timeline-generator": "timeline-generator"
};

// Typing "/culture-blender" is not how most people ask for it, so the same four
// features are also reachable in plain language.
const FEATURE_KEYWORDS = [
    {
        feature: "personality-quiz",
        name: "Personality Quiz",
        keywords: [
            "personality quiz", "personality test", "wedding style", "wedding quiz",
            "discover my style", "find my style", "what style", "wedding personality",
            "take quiz", "take the quiz", "style quiz", "vibe quiz"
        ]
    },
    {
        feature: "culture-blender",
        name: "Culture Blender",
        keywords: [
            "culture blend", "blend culture", "culture blender", "mix culture",
            "fusion wedding", "multi cultural", "multicultural", "two culture",
            "combine culture", "merge culture", "cultural fusion", "blend my culture"
        ]
    },
    {
        feature: "conflict-resolver",
        name: "Conflict Resolver",
        keywords: [
            "conflict", "disagree", "disagreement", "resolve conflict", "conflict resolver",
            "husband wife conflict", "partner conflict", "couple conflict",
            "we disagree", "can't agree", "cannot agree", "help us decide",
            "mediate", "resolve decision", "solve conflict", "fix conflict"
        ]
    },
    {
        feature: "timeline-generator",
        name: "Timeline Generator",
        keywords: [
            "timeline", "schedule", "wedding timeline", "day timeline", "event timeline",
            "generate timeline", "create timeline", "make timeline", "plan timeline",
            "wedding schedule", "event schedule", "day schedule", "timing",
            "time management", "wedding day plan"
        ]
    }
];

// Everything the assistant does that is not layout: conversation state, the
// three ways a message is routed (slash command / keyword / the model), and
// localStorage-backed history. The full page and the corner widget differ only
// in how they draw this, so they both run this hook.
//
// `onSubmit` fires after the input has been consumed — the page uses it to
// collapse its auto-sizing textarea back to one row.
export default function useShaadiAI({ storageKey = CHAT_STORAGE_KEY, onSubmit } = {}) {
    const [messages, setMessages] = useState([INITIAL_MSG]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [chatList, setChatList] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [activeFeature, setActiveFeature] = useState(null);

    // handleSend appends to the transcript it can see, and the widget calls it
    // from handlers captured before the first reply arrives. Reading the live
    // value through a ref keeps those appends from dropping messages.
    const messagesRef = useRef(messages);
    messagesRef.current = messages;

    const isInitialState = messages.length === 1 && !activeChatId;

    const fetchChatList = () => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                parsed.sort((a, b) => b.updatedAt - a.updatedAt);
                setChatList(parsed);
            }
        } catch (err) {
            console.error("Failed to load chats:", err);
        }
    };

    useEffect(() => {
        fetchChatList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const saveChat = (updatedMessages, chatId) => {
        try {
            const firstUserMsg = updatedMessages.find(m => m.role === "user");
            const title = firstUserMsg
                ? firstUserMsg.content.substring(0, 60) + (firstUserMsg.content.length > 60 ? "..." : "")
                : "New Chat";

            const messagesToSave = updatedMessages.map(m => ({
                role: m.role,
                content: m.content,
                ...(m.vendors && { vendors: m.vendors }),
                ...(m.products && m.products.length > 0 && { products: m.products }),
                ...(m.orders && m.orders.length > 0 && { orders: m.orders }),
                ...(m.comparisons && m.comparisons.length > 0 && { comparisons: m.comparisons }),
                ...(m.budget_breakdown && Object.keys(m.budget_breakdown).length > 0 && { budget_breakdown: m.budget_breakdown }),
                ...(m.suggestions && m.suggestions.length > 0 && { suggestions: m.suggestions }),
                ...(m.featureType && { featureType: m.featureType }),
                ...(m.featureResult && { featureResult: m.featureResult })
            }));

            let savedChats = [];
            const saved = localStorage.getItem(storageKey);
            if (saved) savedChats = JSON.parse(saved);

            let newChatId = chatId;

            if (chatId) {
                const index = savedChats.findIndex(c => c.id === chatId);
                if (index !== -1) {
                    savedChats[index].title = title;
                    savedChats[index].messages = messagesToSave;
                    savedChats[index].updatedAt = Date.now();
                } else {
                    savedChats.push({ id: chatId, title, messages: messagesToSave, updatedAt: Date.now() });
                }
            } else {
                newChatId = Date.now().toString() + Math.random().toString(36).substring(7);
                savedChats.push({ id: newChatId, title, messages: messagesToSave, updatedAt: Date.now() });
                setActiveChatId(newChatId);
            }

            localStorage.setItem(storageKey, JSON.stringify(savedChats));
            fetchChatList();
            return newChatId;
        } catch (err) {
            console.error("Failed to save chat:", err);
            return chatId;
        }
    };

    // A guided feature was asked for: record the request, drop in the message
    // that carries the inline form, and open it.
    const openFeature = (userMsg, feature, aiText, customMessage) => {
        const updatedMessages = [...messagesRef.current,
            { role: "user", content: userMsg },
            { role: "ai", content: aiText, featureType: feature }
        ];
        setMessages(updatedMessages);
        setActiveFeature(feature);
        if (!customMessage) setInput("");
        if (onSubmit) onSubmit();

        const newId = saveChat(updatedMessages, activeChatId);
        if (!activeChatId) setActiveChatId(newId);
    };

    const handleFeatureComplete = (featureType, result) => {
        if (result.error) {
            setMessages([...messagesRef.current, { role: "ai", content: result.error }]);
            setActiveFeature(null);
            return;
        }

        const newMessages = [...messagesRef.current, {
            role: "ai",
            content: `Here are your ${featureType.replace('-', ' ')} results! Feel free to ask me any questions about them.`,
            featureResult: result,
            featureType: featureType
        }];

        setMessages(newMessages);
        setActiveFeature(null);

        const newId = saveChat(newMessages, activeChatId);
        if (!activeChatId) setActiveChatId(newId);
    };

    const handleSend = async (customMessage = null) => {
        const userMsg = customMessage || input.trim();
        if (!userMsg) return;

        // 1. An explicit slash command.
        const command = Object.keys(SLASH_COMMANDS).find(cmd => userMsg.toLowerCase().startsWith(cmd));
        if (command) {
            const feature = SLASH_COMMANDS[command];
            openFeature(userMsg, feature, `Opening ${feature.replace('-', ' ')}...`, customMessage);
            return;
        }

        // 2. The same features, asked for in plain language.
        const lowerMsg = userMsg.toLowerCase();
        const detected = FEATURE_KEYWORDS.find(f => f.keywords.some(k => lowerMsg.includes(k)));
        if (detected) {
            openFeature(
                userMsg,
                detected.feature,
                `I detected you want to use the ${detected.name}! Opening it for you...`,
                customMessage
            );
            return;
        }

        // 3. Anything else goes to the model.
        const updatedMessages = [...messagesRef.current, { role: "user", content: userMsg }];
        setMessages(updatedMessages);
        if (!customMessage) setInput("");
        if (onSubmit) onSubmit();
        setLoading(true);

        try {
            const historyForBackend = updatedMessages
                .filter((_, i) => i > 0)
                .filter(m => !m.featureType)
                .map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.content }));

            const response = await axios.post("/ai/chat", {
                message: userMsg,
                conversationHistory: historyForBackend
            });
            const data = response.data;

            const newMessages = [...updatedMessages, {
                role: "ai",
                content: data.summary,
                vendors: data.vendors,
                products: data.products,
                orders: data.orders,
                comparisons: data.comparisons,
                suggestions: data.suggestions,
                budget_breakdown: data.budget_breakdown
            }];

            setMessages(newMessages);

            const newId = saveChat(newMessages, activeChatId);
            if (!activeChatId) setActiveChatId(newId);
        } catch (error) {
            console.error("AI Error:", error);
            setMessages([...updatedMessages, {
                role: "ai",
                content: "Oops! Something went wrong. Please try again in a moment. 🙏"
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleNewChat = () => {
        setMessages([INITIAL_MSG]);
        setActiveChatId(null);
        setActiveFeature(null);
        setInput("");
    };

    const handleLoadChat = (chatId) => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                const chat = parsed.find(c => c.id === chatId);
                if (chat) {
                    setMessages(chat.messages || [INITIAL_MSG]);
                    setActiveChatId(chatId);
                    setActiveFeature(null);
                    return true;
                }
            }
        } catch (err) {
            console.error("Failed to load chat:", err);
        }
        return false;
    };

    const handleDeleteChat = (e, chatId) => {
        e.stopPropagation();
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                let parsed = JSON.parse(saved);
                parsed = parsed.filter(c => c.id !== chatId);
                localStorage.setItem(storageKey, JSON.stringify(parsed));

                if (activeChatId === chatId) handleNewChat();
                fetchChatList();
            }
        } catch (err) {
            console.error("Failed to delete chat:", err);
        }
    };

    return {
        messages,
        input,
        setInput,
        loading,
        chatList,
        activeChatId,
        activeFeature,
        isInitialState,
        handleSend,
        handleFeatureComplete,
        handleNewChat,
        handleLoadChat,
        handleDeleteChat,
        fetchChatList
    };
}
