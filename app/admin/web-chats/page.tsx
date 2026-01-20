'use client'

const webChats = [
  {
    name: 'Amit Singh',
    email: 'amit@example.com',
    lastMessage: 'Civil work ke liye quote chahiye',
    time: '11:00 AM',
    source: 'Website',
  },
  {
    name: 'Sneha Patel',
    email: 'sneha@example.com',
    lastMessage: 'GPS tracking system',
    time: '10:45 AM',
    source: 'Website',
  },
]

export default function WebChatsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#0E0C1D] mb-2">Website Chats</h1>
        <p className="text-gray-600">Manage website chat conversations</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-700 mb-2">Same WhatsApp jaisa structure</p>
        <p className="text-sm text-gray-700 mb-2">Source: directly website se</p>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>• Website</li>
          <li>• WhatsApp</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {webChats.map((chat, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-[#0E0C1D]">{chat.name}</h3>
                <p className="text-sm text-gray-600">{chat.email}</p>
              </div>
              <span className="text-xs text-gray-500">{chat.time}</span>
            </div>
            <p className="text-sm text-gray-700 mb-3">{chat.lastMessage}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                {chat.source}
              </span>
              <button className="px-4 py-2 bg-[#0E0C1D] text-white text-sm font-medium rounded hover:bg-[#0E0C1D]/90">
                Take Control
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
