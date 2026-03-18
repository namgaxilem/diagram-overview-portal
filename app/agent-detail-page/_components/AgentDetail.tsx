'use client';

import React, { useState } from 'react';
import { Tabs, Button } from 'antd';
import type { TabsProps } from 'antd';

export default function AgentDetail() {
  const [activeTab, setActiveTab] = useState<string>('overview');

  return (
    <main className="flex-1 flex flex-col overflow-hidden relative">
      {/* Breadcrumbs */}
      <nav className="px-6 py-4 flex items-center gap-2 text-xs text-gray-500">
        <a className="hover:text-brand-green" href="#">Home</a>
        <span>/</span>
        <a className="hover:text-brand-green" href="#">Agents</a>
        <span>/</span>
        <span className="text-brand-green font-medium">qvo01</span>
      </nav>

      {/* Agent Header Banner */}
      <section className="px-6 pb-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            {/* Agent Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-center p-4">
                <svg className="w-full h-full text-gray-800" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 100 100">
                  <path d="M30 80 L50 20 L70 80 M40 60 L60 60" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 flex flex-col gap-1">
                <button className="bg-brand-accent text-white p-1.5 rounded-md shadow-md hover:bg-brand-green transition-colors">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button className="bg-red-500 text-white p-1.5 rounded-md shadow-md hover:bg-red-600 transition-colors">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path clipRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" fillRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Agent Name & Status */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">qvo01</h2>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand-lightGreen text-brand-green border border-brand-green/20">
                    <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path clipRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" fillRule="evenodd" />
                    </svg>
                    Private
                  </span>
                  <span className="flex items-center text-xs text-orange-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2"></span>
                    Active
                  </span>
                </div>
                <div className="h-4 w-px bg-gray-200"></div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-xs">
                    <span className="text-gray-400 mr-2 uppercase tracking-wide font-semibold text-[10px]">Status:</span>
                    <span className="flex items-center text-orange-500 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse mr-1.5"></span>
                      Active
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="text-gray-400 mr-2 uppercase tracking-wide font-semibold text-[10px]">Voice:</span>
                    <span className="flex items-center text-red-500 font-medium">
                      <svg className="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                      Disabled
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              View Code
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg text-sm font-medium hover:bg-brand-green/90 shadow-sm">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              Start Agent
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              Download
            </button>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex-1 px-6">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                { key: 'overview', label: 'Overview' },
                { key: 'tools', label: 'Tools' },
                { key: 'config', label: 'Agent Config' },
                { key: 'voice', label: 'Voice Settings' },
                { key: 'remote', label: 'Remote A2A' },
                { key: 'output', label: 'Output Schema' },
                { key: 'policy', label: 'Policy Config' },
                { key: 'security', label: 'Security' },
              ]}
              tabBarStyle={{ marginBottom: 0 }}
            />
          </div>
          <div className="px-6 flex items-center gap-3 border-l border-gray-100 shrink-0">
            <Button type="text" className="text-gray-600 hover:text-gray-900">
              Discard
            </Button>
            <Button 
              type="primary" 
              icon={
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                </svg>
              }
              className="bg-brand-green hover:bg-brand-green/90"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="max-w-4xl space-y-6">
              {/* Description Card */}
              <article className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Description</h3>
                </div>
                <div className="p-6 text-sm text-gray-600 leading-relaxed">
                  Coding agent
                </div>
              </article>

              {/* Instruction Card */}
              <article className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Instruction</h3>
                </div>
                <div className="p-6 text-sm text-gray-600 leading-relaxed">
                  Rewrite the following prompt to be more explicit, logically structured, and optimized for LLM execution:
                  <br /><br />
                  <strong className="text-gray-800">**Prompt:**</strong> Act as a &quot;Code Agent.&quot; When given a coding task, provide clear, step-by-step solutions, including code examples, concise explanations, and best practices. Ensure your responses are accurate, well-structured, and easy to follow. If additional information is needed, ask clarifying questions before proceeding.
                </div>
              </article>
            </div>
          </div>
        )}

        {activeTab === 'output' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {/* Schema Header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Output Schema</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-lightGreen text-brand-green border border-brand-green/20">
                        ACTIVE
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600">Enabled</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
                  </label>
                </div>
              </div>

              <div className="p-6">
                {/* Builder Toggle */}
                <div className="flex rounded-md shadow-sm mb-6 max-w-md">
                  <button className="flex-1 px-4 py-2 text-sm font-medium text-brand-green bg-white border border-brand-green rounded-l-lg hover:bg-brand-lightGreen focus:z-10 focus:ring-1 focus:ring-brand-green">
                    Visual Builder
                  </button>
                  <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-50 hover:text-gray-700 focus:z-10">
                    Raw JSON Schema
                  </button>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                  Define the properties that the agent must include in its structured response. Each property has a name, type, optional description, and can be marked as required.
                </p>

                {/* Property Row */}
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-6">
                      <input className="w-full border-gray-300 rounded-lg text-sm focus:ring-brand-green focus:border-brand-green" placeholder="Property Name" type="text" defaultValue="jhkljkl" />
                    </div>
                    <div className="col-span-3">
                      <select className="w-full border-gray-300 rounded-lg text-sm focus:ring-brand-green focus:border-brand-green">
                        <option>String</option>
                        <option>Number</option>
                        <option>Boolean</option>
                        <option>Object</option>
                        <option>Array</option>
                      </select>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <input type="checkbox" className="rounded border-gray-300 text-brand-green focus:ring-brand-green" defaultChecked />
                      <label className="text-sm text-gray-500">Required</label>
                    </div>
                    <div className="col-span-1 flex justify-end gap-2 text-gray-400">
                      <button className="hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M5 10l7-7m0 0l7 7m-7-7v18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                      </button>
                      <button className="hover:text-red-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                      </button>
                    </div>
                    <div className="col-span-12 pl-8 space-y-3">
                      <input className="w-full border-gray-300 rounded-lg text-sm bg-gray-50/50" placeholder="Description" type="text" defaultValue="jkljk" />
                      <input className="w-full border-gray-300 rounded-lg text-sm bg-gray-50/50" placeholder="Default value (optional)" type="text" defaultValue="jkljkl" />
                    </div>
                  </div>

                  {/* Add Button */}
                  <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 font-medium hover:border-brand-green hover:text-brand-green hover:bg-brand-lightGreen/20 transition-all flex items-center justify-center gap-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                    Add Property
                  </button>
                </div>

                {/* Preview */}
                <div className="mt-10">
                  <h4 className="text-sm font-bold text-gray-900 mb-4">Generated JSON Schema Preview:</h4>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <pre className="text-xs text-gray-600 font-mono leading-relaxed overflow-x-auto">{`{
  "type": "object",
  "properties": {
    "jhkljkl": {
      "type": "string",
      "description": "jkljk",
      "enum": [
        "jkljkl"
      ]
    }
  },
  "required": [
    "jhkljkl"
  ]
}`}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'overview' && activeTab !== 'output' && (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
            <svg className="h-16 w-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 00-1 1v1a2 2 0 11-4 0v-1a1 1 0 00-1-1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <p className="text-lg font-medium">This section is under construction.</p>
            <p className="text-sm">Please select &apos;Overview&apos; or &apos;Output Schema&apos; for full preview.</p>
          </div>
        )}
      </div>
    </main>
  );
}
