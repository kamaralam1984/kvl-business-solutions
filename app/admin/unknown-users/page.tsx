'use client'

const unknownUsers = [
  {
    mobile: '9876543210',
    source: 'WhatsApp',
    lastActivity: '2024-01-19 10:30',
    messages: 3,
  },
  {
    mobile: '9876543211',
    source: 'Website',
    lastActivity: '2024-01-19 09:15',
    messages: 5,
  },
]

export default function UnknownUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#0E0C1D] mb-2">Unknown Users</h1>
        <p className="text-gray-600">Users who haven't provided complete information</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Mobile</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Source</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Last Activity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Messages</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {unknownUsers.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-[#0E0C1D]">{user.mobile}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{user.source}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{user.lastActivity}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{user.messages}</td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">View Chat</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
