'use client'

const goluLogs = [
  {
    time: '10:33',
    source: 'Mobile',
    userMsg: 'CCTV',
    goluReply: 'ठीक है! CCTV Installation के लिए कृपया अपना शहर बताएं।',
    step: 'Step 2',
  },
  {
    time: '10:34',
    source: 'Website',
    userMsg: 'Patna',
    goluReply: 'ठीक है! Patna में CCTV के लिए आप किस जगह के लिए देख रहे हैं?',
    step: 'Step 3',
  },
  {
    time: '10:35',
    source: 'Mobile',
    userMsg: 'Office',
    goluReply: 'आपकी क्या रिक्वायरमेंट है?',
    step: 'Step 4',
  },
  {
    time: '10:36',
    source: 'Website',
    userMsg: 'Need 4 cameras',
    goluReply: 'कब तक ये काम करवाना है?',
    step: 'Step 5',
  },
]

export default function GoluLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#0E0C1D] mb-2">GOLU AI Logs</h1>
        <p className="text-gray-600">Track all GOLU AI conversations and interactions</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <h3 className="text-sm font-semibold text-[#0E0C1D] mb-2">Purpose:</h3>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>• Admin dekhe hai</li>
          <li>• GOLU kya puchh raha hai</li>
          <li>• User ne kya reply diya</li>
          <li>• Kahan / lead drop hua</li>
        </ul>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Source</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">User Msg</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">GOLU Reply</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Step</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {goluLogs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{log.time}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{log.source}</td>
                  <td className="px-4 py-3 text-sm font-medium text-[#0E0C1D]">{log.userMsg}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{log.goluReply}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{log.step}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <input type="checkbox" checked readOnly className="cursor-pointer" />
          <span className="text-sm font-medium text-[#0E0C1D]">Transparency</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <input type="checkbox" checked readOnly className="cursor-pointer" />
          <span className="text-sm font-medium text-[#0E0C1D]">Debugging</span>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked readOnly className="cursor-pointer" />
          <span className="text-sm font-medium text-[#0E0C1D]">Trust</span>
        </div>
      </div>
    </div>
  )
}
