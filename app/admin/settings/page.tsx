'use client'

import { useState } from 'react'
import { FiSettings, FiGlobe } from 'react-icons/fi'
import { FaWhatsapp as FaWhatsappSolid } from 'react-icons/fa'

export default function SettingsPage() {
  const [goluEnabled, setGoluEnabled] = useState(true)
  const [goluLanguage, setGoluLanguage] = useState('Hindi')
  const [whatsappConnected, setWhatsappConnected] = useState(true)
  const [websiteChatEnabled, setWebsiteChatEnabled] = useState(true)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#0E0C1D] mb-2">Settings (Admin-Only)</h1>
        <p className="text-gray-600">Configure system settings</p>
      </div>

      {/* GOLU AI Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <FiSettings className="text-xl text-[#0E0C1D]" />
          <h2 className="text-lg font-semibold text-[#0E0C1D]">GOLU AI Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Creating task</label>
              <p className="text-xs text-gray-500">Enable/disable task creation</p>
            </div>
            <input
              type="checkbox"
              checked={goluEnabled}
              onChange={(e) => setGoluEnabled(e.target.checked)}
              className="cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Service flow enable/disable</label>
              <p className="text-xs text-gray-500">Control service flow</p>
            </div>
            <input
              type="checkbox"
              checked={goluEnabled}
              onChange={(e) => setGoluEnabled(e.target.checked)}
              className="cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={goluLanguage}
              onChange={(e) => setGoluLanguage(e.target.value)}
              className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
            </select>
          </div>
        </div>
      </div>

      {/* WhatsApp Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaWhatsappSolid className="text-xl text-green-600" />
          <h2 className="text-lg font-semibold text-[#0E0C1D]">WhatsApp</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">API Status</label>
              <p className="text-xs text-gray-500">WhatsApp API connection status</p>
            </div>
            <span className={`px-3 py-1 text-xs font-medium rounded ${
              whatsappConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {whatsappConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Connected Number</label>
            <input
              type="text"
              value="+91 9942000413"
              readOnly
              className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Website Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <FiGlobe className="text-xl text-[#0E0C1D]" />
          <h2 className="text-lg font-semibold text-[#0E0C1D]">Website</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Chat enable/disable</label>
              <p className="text-xs text-gray-500">Control website chat widget</p>
            </div>
            <input
              type="checkbox"
              checked={websiteChatEnabled}
              onChange={(e) => setWebsiteChatEnabled(e.target.checked)}
              className="cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business hours</label>
            <input
              type="text"
              placeholder="9:00 AM - 6:00 PM"
              className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
