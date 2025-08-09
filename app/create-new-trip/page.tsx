import React from "react";
import ChatBox from "./_components/ChatBox";

function CreateNewTrip() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Can be added later */}
      <div className="hidden md:block w-1/3 max-w-md border-r border-gray-200 bg-white p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Trip Planner</h1>
        <div className="space-y-4">
          <p className="text-gray-600">
            Start a conversation with our AI assistant to plan your perfect trip!
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        <ChatBox />
      </div>
    </div>
  );
}

export default CreateNewTrip;
