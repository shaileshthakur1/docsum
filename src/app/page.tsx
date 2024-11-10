'use client'

import { useState } from 'react'
import { UserButton } from "@clerk/nextjs";
import { FileUpload } from '@/components/FileUpload'
import { Chat } from '@/components/Chat'
import { Button } from "@/components/ui/button"
import { useClerk, useUser } from '@clerk/nextjs'
import { ArrowRight, FileText, Zap, Users } from 'lucide-react'


export default function EnhancedLandingPage() {
  const { redirectToSignUp } = useClerk() 
  const { user } = useUser()
  const [showEmbeddedContent, setShowEmbeddedContent] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)

  const handleSummaryReceived = (newSummary: string) => {
    setSummary(newSummary)
  }

  return (
    <div className="min-h-screen flex flex-col">
    <div 
      className="flex-grow bg-cover bg-center"
      style={{ 
        backgroundImage: "rgb(0,0,0)",
      }}
    >
      {!showEmbeddedContent ? (
        <div className="container mx-auto px-4 py-12">
          <nav className="flex justify-between items-center mb-16">
            <div className="text-black text-2xl font-bold">DocSumAI</div>
            <div className="absolute top-auto right-3 md:right-12 lg:right-40">
                {user ? (
                  // Displaying UserButton when signed in
                  <UserButton afterSignOutUrl="/" />
                ) : (
                  // Displaying Sign Up button when not signed in
                  <Button 
                    variant="outline" 
                    className="text-black border-black hover:bg-gray-300 hover:text-black"
                    onClick={() => redirectToSignUp()}
                  >
                    Sign Up
                  </Button>
                )}
              </div>
            </nav>
            
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold mb-6 text-black">Revolutionize Your Document Analysis</h1>
              <p className="text-xl text-gray-400 mb-8">Harness the power of AI to summarize and chat with your documents in seconds.</p>
              <Button 
                onClick={() => setShowEmbeddedContent(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-6 py-3"
              >
                Get Started <ArrowRight className="ml-2" />
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                { icon: <FileText className="w-12 h-12 mb-4 text-primary" />, title: "Smart Summaries", description: "Get concise summaries of your documents instantly." },
                { icon: <Zap className="w-12 h-12 mb-4 text-primary" />, title: "Lightning Fast", description: "Process documents in seconds, not hours." },
                { icon: <Users className="w-12 h-12 mb-4 text-primary" />, title: "Collaborative", description: "Share insights with your team effortlessly." },
              ].map((feature, index) => (
                <div key={index} className="bg-gray-400/10 p-6 rounded-lg text-center">
                  {feature.icon}
                  <h3 className="text-xl font-semibold mb-2 text-black">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-50/10 p-8 rounded-lg text-center">
              <blockquote className="text-xl italic text-gray-400 mb-4">
                &quot;DocSumAI has transformed how we handle documentation. It&apos;s a game-changer for our team&apos;s productivity!&quot;
              </blockquote>
              <cite className="text-gray-400 font-semibold">- Sarah Johnson, Product Manager at TechCorp</cite>
            </div>
          </div>
        ) : (
          <div className="bg-background/95 p-8 rounded-lg w-full max-w-4xl mx-auto my-12 transition-all duration-500 ease-in-out">
            <h1 className="text-3xl font-bold mb-8">Chat Document Summarizer</h1>
            <div className="mb-8">
              <FileUpload onSummaryReceived={handleSummaryReceived} />
            </div>
            {summary && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Document Summary</h2>
                <p className="bg-muted p-4 rounded-lg">{summary}</p>
              </div>
            )}
            <Chat initialMessage={summary ? `Here's a summary of the uploaded document: ${summary}` : undefined} />
          </div>
        )}
      </div>
    </div>
  )
}