'use client'

import { FiPhone } from 'react-icons/fi'
import { FaWhatsapp as FaWhatsappSolid } from 'react-icons/fa'

const quickStats = [
  { label: 'Total Leads', value: '123', color: 'text-[#0E0C1D]' },
  { label: 'New Today', value: '12', color: 'text-blue-600' },
  { label: 'Working', value: '45', color: 'text-yellow-600' },
  { label: 'Closed', value: '66', color: 'text-green-600' },
  { label: 'Total', value: '123', color: 'text-gray-600' },
]

const recentLeads = [
  {
    date: '2024-01-19',
    name: 'Rajesh Kumar',
    mobile: '9876543210',
    service: 'CCTV Installation',
    city: 'Patna',
    source: 'WhatsApp',
    status: 'New',
  },
  {
    date: '2024-01-19',
    name: 'Priya Sharma',
    mobile: '9876543211',
    service: 'Software Development',
    city: 'Delhi',
    source: 'Website',
    status: 'Contacted',
  },
  {
    date: '2024-01-18',
    name: 'Amit Singh',
    mobile: '9876543212',
    service: 'Civil Work',
    city: 'Mumbai',
    source: 'WhatsApp',
    status: 'Working',
  },
  {
    date: '2024-01-18',
    name: 'Sneha Patel',
    mobile: '9876543213',
    service: 'GPS Tracking',
    city: 'Ahmedabad',
    source: 'Website',
    status: 'Followup',
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0E0C1D] mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview of your business performance</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <h2 className="text-lg font-semibold text-[#0E0C1D] mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-lg hover:border-[#0E0C1D] transition-all duration-200 group"
            >
              <p className="text-sm text-gray-600 mb-2 font-medium">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color} group-hover:scale-105 transition-transform`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Leads */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#0E0C1D]">Recent Leads (Most Important)</h2>
          <button className="text-sm text-[#0E0C1D] hover:underline font-medium">View All</button>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Mobile</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">City</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentLeads.map((lead, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{lead.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#0E0C1D]">{lead.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{lead.mobile}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{lead.service}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{lead.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        lead.source === 'WhatsApp' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                        lead.status === 'Working' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
                        <a href={`tel:${lead.mobile}`} className="text-green-600 hover:text-green-800 transition-colors">
                          <FiPhone className="text-lg" />
                        </a>
                        <a href={`https://wa.me/${lead.mobile}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 transition-colors">
                          <FaWhatsappSolid className="text-lg" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
