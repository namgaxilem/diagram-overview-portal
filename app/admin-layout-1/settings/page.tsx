'use client';

import React, { useState, useEffect } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';

export default function SettingsPage() {
  const [telemetryEnabled, setTelemetryEnabled] = useState(false);
  const [cyberVerificationEnrolled, setCyberVerificationEnrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      console.log('Dark mode enabled, html classes:', document.documentElement.className);
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      console.log('Dark mode disabled, html classes:', document.documentElement.className);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Appearance</h2>

          <div className="flex items-start justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1 pr-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-gray-900 dark:text-white">Dark Mode</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enable dark mode for a more comfortable viewing experience in low-light environments.
              </p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Privacy</h2>

          <div className="flex items-start justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1 pr-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-gray-900 dark:text-white">Disable Telemetry</span>
                <InfoCircleOutlined className="text-gray-400 text-sm" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Opt out of non-essential data collection that helps us improve the product.
              </p>
            </div>
            <button
              onClick={() => setTelemetryEnabled(!telemetryEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                telemetryEnabled ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  telemetryEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Anthropic Cyber Verification Program
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Enroll in Anthropic's cyber verification program to relax certain content restrictions for cybersecurity
            use cases. Enabling this will route your Anthropic model traffic through a non-zero data retention
            organization.{' '}
            <a href="#" className="text-green-600 dark:text-green-400 hover:underline">
              Learn more
            </a>
          </p>

          {!cyberVerificationEnrolled ? (
            <button
              onClick={() => setCyberVerificationEnrolled(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              Enroll
            </button>
          ) : (
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <span className="text-green-700 dark:text-green-400 font-medium">
                ✓ Enrolled in Cyber Verification Program
              </span>
              <button
                onClick={() => setCyberVerificationEnrolled(false)}
                className="text-sm text-green-600 dark:text-green-400 hover:underline"
              >
                Unenroll
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
