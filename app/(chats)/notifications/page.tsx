"use client"
import React, { useState } from 'react';
import { 
  Search, Send, Home, MessageSquare, Users, Settings, LogOut, Menu, Camera, 
  Mail, Phone, Lock, Bell, Moon, Shield, User, Image, Volume2, Radio, 
  MessageCircle, UserPlus, Monitor, Smartphone
} from 'lucide-react';

const ChatInterface = () => {
  // ... previous states ...
  const [activeSection, setActiveSection] = useState('notifications');
  const [notificationSettings, setNotificationSettings] = useState({
    pushEnabled: true,
    emailEnabled: true,
    soundEnabled: true,
    desktopEnabled: true,
    mobileEnabled: true,
    messagePreview: true,
    doNotDisturb: false
  });

  // Sample notifications
  const recentNotifications = [
    {
      id: 1,
      type: 'message',
      title: 'New Message',
      description: 'Sarah sent you a message',
      time: '2 minutes ago',
      icon: MessageCircle,
      read: false
    },
    {
      id: 2,
      type: 'friend',
      title: 'Friend Request',
      description: 'John wants to connect with you',
      time: '1 hour ago',
      icon: UserPlus,
      read: true
    },
  ];
  return (
    <div className="flex-1  bg-gray-50 overflow-y-auto">
    <div className=" p-6">
      {/* Notification Preferences */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Bell className="h-6 w-6 mr-2 text-blue-500" />
          Notification Preferences
        </h2>

        <div className="space-y-6">
          {/* General Settings */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Smartphone className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-700">Push Notifications</p>
                    <p className="text-sm text-gray-500">Receive notifications on your device</p>
                  </div>
                </div>
                <button 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    notificationSettings.pushEnabled ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                  onClick={() => setNotificationSettings(prev => ({
                    ...prev,
                    pushEnabled: !prev.pushEnabled
                  }))}
                >
                  <span 
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      notificationSettings.pushEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`} 
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-700">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive email updates</p>
                  </div>
                </div>
                <button 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    notificationSettings.emailEnabled ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                  onClick={() => setNotificationSettings(prev => ({
                    ...prev,
                    emailEnabled: !prev.emailEnabled
                  }))}
                >
                  <span 
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      notificationSettings.emailEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`} 
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Volume2 className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-700">Sound Notifications</p>
                    <p className="text-sm text-gray-500">Play sound for new messages</p>
                  </div>
                </div>
                <button 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    notificationSettings.soundEnabled ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                  onClick={() => setNotificationSettings(prev => ({
                    ...prev,
                    soundEnabled: !prev.soundEnabled
                  }))}
                >
                  <span 
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      notificationSettings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`} 
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Notifications */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Notifications</h3>
            <div className="space-y-4">
              {recentNotifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`flex items-start p-4 rounded-lg ${
                    notification.read ? 'bg-gray-50' : 'bg-blue-50'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    notification.read ? 'bg-gray-200' : 'bg-blue-200'
                  } mr-4`}>
                    <notification.icon className={`h-5 w-5 ${
                      notification.read ? 'text-gray-500' : 'text-blue-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      <span className="text-sm text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-gray-600 mt-1">{notification.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Do Not Disturb */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Moon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-700">Do Not Disturb</p>
                  <p className="text-sm text-gray-500">Disable all notifications</p>
                </div>
              </div>
              <button 
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  notificationSettings.doNotDisturb ? 'bg-blue-500' : 'bg-gray-200'
                }`}
                onClick={() => setNotificationSettings(prev => ({
                  ...prev,
                  doNotDisturb: !prev.doNotDisturb
                }))}
              >
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    notificationSettings.doNotDisturb ? 'translate-x-6' : 'translate-x-1'
                  }`} 
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ChatInterface;