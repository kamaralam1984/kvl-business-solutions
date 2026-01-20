'use client'

const whatsappChats = [
  {
    name: 'Rajesh Kumar',
    mobile: '9876543210',
    lastMessage: 'CCTV installation chahiye',
    time: '10:30 AM',
    status: 'Active',
  },
  {
    name: 'Priya Sharma',
    mobile: '9876543211',
    lastMessage: 'Software development ke liye',
    time: '09:15 AM',
    status: 'Active',
  },
]

export default function WhatsAppUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#0E0C1D] mb-2">WhatsApp Chats</h1>
        <p className="text-gray-600">Manage WhatsApp conversations</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Read only chat view</li>
          <li>• Re-triggering from dashboard</li>
          <li>• Admin will Take Over kar sakta hai</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {whatsappChats.map((chat, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-[#0E0C1D]">{chat.name}</h3>
                <p className="text-sm text-gray-600">{chat.mobile}</p>
              </div>
              <span className="text-xs text-gray-500">{chat.time}</span>
            </div>
            <p className="text-sm text-gray-700 mb-3">{chat.lastMessage}</p>
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded ${
                chat.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {chat.status}
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
