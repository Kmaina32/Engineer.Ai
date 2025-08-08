

"use client";

import { useState, useRef, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bot, User, Loader2, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { generalChat } from '@/ai/flows/general-chat';
import { cn } from '@/lib/utils';
import { onAuthStateChanged, type User as AuthUser } from 'firebase/auth';
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
  writeBatch,
  getDocs,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

const chatSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});

type ChatFormValues = z.infer<typeof chatSchema>;

interface Message {
  text: string;
  isUser: boolean;
  timestamp?: any;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [engineerType, setEngineerType] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const chatHistoryCollectionRef = collection(db, "users", currentUser.uid, "chatHistory");
        const q = query(chatHistoryCollectionRef, orderBy("timestamp"));

        const unsubscribeFirestore = onSnapshot(q,
          (querySnapshot) => {
            setIsConnecting(false);
            const history = querySnapshot.docs.map(doc => doc.data() as Message);
            if (history.length === 0) {
              setMessages([{ text: "Hello! I'm your AI assistant. How can I help you today?", isUser: false }]);
            } else {
              setMessages(history);
            }
          },
          (error) => {
            console.error("Firestore chat history error:", error);
            setIsConnecting(true);
          }
        );
        
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            setEngineerType(userDocSnap.data().engineerType);
        }

        return () => unsubscribeFirestore();
      } else {
        setIsConnecting(false);
        setMessages([{ text: "Please log in to use the chatbot.", isUser: false }]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatSchema),
    defaultValues: { message: "" },
  });

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSubmit: SubmitHandler<ChatFormValues> = async (data) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to chat.' });
        return;
    }
    const userMessage: Message = { text: data.message, isUser: true, timestamp: serverTimestamp() };
    setMessages(prev => [...prev, {text: data.message, isUser: true}]);
    setIsLoading(true);
    form.reset();

    try {
      const chatHistoryCollectionRef = collection(db, "users", user.uid, "chatHistory");
      await addDoc(chatHistoryCollectionRef, userMessage);

      const result = await generalChat({
        userQuery: data.message,
        userDiscipline: engineerType || 'General',
      });
      const botMessage: Message = { text: result.response, isUser: false, timestamp: serverTimestamp() };
      await addDoc(chatHistoryCollectionRef, botMessage);
      // The onSnapshot listener will update the state, no need to call setMessages here.
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: Message = { text: "Sorry, I encountered an error. Please try again.", isUser: false };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClearHistory = async () => {
    if (!user) return;
    try {
        const chatHistoryRef = collection(db, 'users', user.uid, 'chatHistory');
        const querySnapshot = await getDocs(chatHistoryRef);
        const batch = writeBatch(db);
        querySnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        toast({ title: 'Success', description: 'Chat history cleared.' });
    } catch (error) {
        console.error("Error clearing history: ", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to clear chat history.' });
    }
  };

  if (isConnecting) {
     return (
        <Card className="w-full max-w-4xl h-[80vh] flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Connecting to the database...</p>
        </Card>
     )
  }

  return (
    <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>AI Assistant</CardTitle>
            <CardDescription>Ask me anything. I'm here to help you, {engineerType ? `the ${engineerType} engineer` : ''}!</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={handleClearHistory} disabled={!user}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Clear History</span>
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3",
                  message.isUser ? "justify-end" : "justify-start"
                )}
              >
                {!message.isUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot size={20}/></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-xs rounded-lg p-3 text-sm md:max-w-md",
                    message.isUser
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.text}
                </div>
                 {message.isUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><User size={20}/></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                 <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot size={20}/></AvatarFallback>
                  </Avatar>
                <div className="bg-muted rounded-lg p-3 flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin"/>
                    <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <div className="border-t p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input placeholder="Type your message..." {...field} disabled={isLoading || !user} autoComplete="off"/>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" disabled={isLoading || !user} variant="accent">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
}
