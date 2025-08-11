import React from "react";
import ChatBox from "./_components/ChatBox";

function CreateNewTrip() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left Sidebar */}
      <div className="hidden lg:flex w-1/3 max-w-md border-r border-border bg-card p-6 overflow-y-auto">
        <div className="w-full">
          <div className="flex items-center gap-3 mb-8 animate-in slide-in-from-left-2 duration-300">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Trip Planner</h1>
              <p className="text-sm text-muted-foreground">Your AI travel assistant</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md">
              <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary mr-2">1</span>
                How It Works
              </h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2 text-primary font-medium">•</span>
                  <span>Share your travel preferences and destination</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary font-medium">•</span>
                  <span>Get personalized recommendations instantly</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary font-medium">•</span>
                  <span>Receive a complete trip itinerary with bookings</span>
                </li>
              </ul>
            </div>
            
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md">
              <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary mr-2">2</span>
                Pro Tips
              </h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Be specific about your interests (e.g., hiking, museums, food)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Mention any special requirements or accessibility needs</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Specify your budget range for better recommendations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatBox />
      </div>
    </div>
  );
}

export default CreateNewTrip;
