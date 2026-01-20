'use client'

import { useState } from 'react'
import { FiPhone } from 'react-icons/fi'
import { FaWhatsapp as FaWhatsappSolid } from 'react-icons/fa'

const allLeads = [
  {
    id: 1,
    date: '2024-01-19',
    name: 'Rajesh Kumar',
    mobile: '9876543210',
    service: 'CCTV Installation',
    city: 'Patna',
    source: 'WhatsApp',
    status: 'New',
  },
  {
    id: 2,
    date: '2024-01-19',
    name: 'Priya Sharma',
    mobile: '9876543211',
    service: 'Software Development',
    city: 'Delhi',
    source: 'Website',
    status: 'Contacted',
  },
  {
    id: 3,
    date: '2024-01-18',
    name: 'Amit Singh',
    mobile: '9876543212',
    service: 'Civil Work',
    city: 'Mumbai',
    source: 'WhatsApp',
    status: 'Followup',
  },
  {
    id: 4,
    date: '2024-01-18',
    name: 'Sneha Patel',
    mobile: '9876543213',
    service: 'GPS Tracking',
    city: 'Ahmedabad',
    source: 'Website',
    status: 'Closed',
  },
]

const services = ['All', 'CCTV Installation', 'Software Development', 'Civil Work', 'GPS Tracking']
const cities = ['All', 'Patna', 'Delhi', 'Mumbai', 'Ahmedabad']
const sources = ['All', 'WhatsApp', 'Website']
const statuses = ['All', 'New', 'Contacted', 'Followup', 'Closed']

export default function LeadsPage() {
  const [filters, setFilters] = useState({
    service: 'All',
    city: 'All',
    source: 'All',
    status: 'All',
  })

  const filteredLeads = allLeads.filter(lead => {
    return (
      (filters.service === 'All' || lead.service === filters.service) &&
      (filters.city === 'All' || lead.city === filters.city) &&
      (filters.source === 'All' || lead.source === filters.source) &&
      (filters.status === 'All' || lead.status === filters.status)
    )
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#0E0C1D] mb-2">Leads Management</h1>
        <p className="text-gray-600">CRM-style lead management</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#0E0C1D] mb-3">Filters:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Service</label>
            <select
              value={filters.service}
              onChange={(e) => setFilters({ ...filters, service: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            >
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Source</label>
            <select
              value={filters.source}
              onChange={(e) => setFilters({ ...filters, source: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            >
              {sources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lead Status Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#0E0C1D] mb-2">Lead Status:</h3>
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          <span>• New</span>
          <span>• Contacted</span>
          <span>• Followup</span>
          <span>• Closed</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <input type="checkbox" checked readOnly className="cursor-pointer" />
          <span className="text-sm text-gray-700">Sortable table</span>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked readOnly className="cursor-pointer" />
          <span className="text-sm text-gray-700">No Kanban boards</span>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer">Mobile</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer">Service</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer">City</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer">Source</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{lead.date}</td>
                  <td className="px-4 py-3 text-sm font-medium text-[#0E0C1D]">{lead.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{lead.mobile}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{lead.service}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{lead.city}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{lead.source}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                      lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                      lead.status === 'Followup' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                      <a href={`tel:${lead.mobile}`} className="text-green-600 hover:text-green-800">
                        <FiPhone className="text-lg" />
                      </a>
                      <a href={`https://wa.me/${lead.mobile}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800">
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
  )
}
