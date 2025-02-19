"use client"
import React, { useState } from 'react';
import { 
  Home, 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  Camera, 
  Mail, 
  Phone, 
  Lock, 
  Bell, 
  Moon, 
  Shield,
  User,
  Image
} from 'lucide-react';

const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState('settings');
  
  // Mock user profile data
  const userProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    image: '/api/placeholder/150/150',
    status: 'Available',
  };

  const settingsSections = [
    {
      title: 'Account Settings',
      icon: User,
      items: [
        { label: 'Edit Profile', icon: User },
        { label: 'Change Password', icon: Lock },
        { label: 'Privacy', icon: Shield },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Push Notifications', icon: Bell },
        { label: 'Email Notifications', icon: Mail },
      ]
    },
    {
      title: 'Appearance',
      icon: Moon,
      items: [
        { label: 'Theme', icon: Moon },
        { label: 'Chat Background', icon: Image },
      ]
    }
  ];

//   const renderSettingsContent = () => (
   
//   );

  const navItems = [
    { icon: Home, label: 'Home', id: 'home' },
    { icon: MessageSquare, label: 'Messages', id: 'messages' },
    { icon: Users, label: 'Contacts', id: 'contacts' },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ];

  return (
    // <div className="flex h-screen bg-gray-50">
    //   {/* Navigation Sidebar */}
    //   <div className={`fixed lg:relative lg:flex flex-col w-20 h-full bg-white dark:bg-[#0d0d0d] dark:text-white border-r border-gray-200 z-50 ${isSidebarOpen ? 'flex' : 'hidden'}`}>
    //     <div className="flex flex-col items-center p-4">
    //       <img src="/api/placeholder/48/48" alt="Your profile" className="w-12 h-12 rounded-full mb-4" />
    //       {navItems.map(item => (
    //         <button
    //           key={item.id}
    //           onClick={() => setActiveNav(item.id)}
    //           className={`p-3 rounded-lg mb-2 w-full flex justify-center ${
    //             activeNav === item.id ? 'bg-blue-500 text-white' : 'dark:text-white text-gray-500 hover:bg-gray-100'
    //           }`}
    //         >
    //           <item.icon className="h-6 w-6" />
    //         </button>
    //       ))}
    //     </div>
    //     <button 
    //       className="mt-auto p-3 dark:text-white text-gray-500 hover:bg-gray-100 w-full flex justify-center mb-4"
    //       onClick={() => {/* Add logout logic */}}
    //     >
    //       <LogOut className="h-6 w-6" />
    //     </button>
    //   </div>

    //   {/* Main Content Area */}
    //   {activeNav === 'settings' ? (
    //     renderSettingsContent()
    //   ) : (
    //     <div className="flex flex-1">
    //       {/* Previous chat interface content would go here */}
    //       <div className="flex-1 flex justify-center items-center dark:text-white text-gray-500">
    //         Select a navigation item to view content
    //       </div>
    //     </div>
    //   )}
    // </div>

    <div className="flex-1  bg-gray-50 dark:bg-black overflow-y-auto">
    <div className=" p-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-[#0d0d0d] dark:text-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="relative">
            <img 
              src={userProfile.image} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover"
            />
            <button className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600">
              <Camera className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold dark:text-white text-gray-900">{userProfile.name}</h1>
            <p className="dark:text-white text-gray-500 mb-4">{userProfile.status}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center">
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:text-white text-gray-700 rounded-lg  flex items-center justify-center">
                <Shield className="h-4 w-4 mr-2" />
                Privacy Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white dark:bg-[#0d0d0d] dark:text-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold dark:text-white text-gray-900 mb-4">Contact Information</h2>
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-gray-50 dark:bg-transparent dark:border rounded-lg">
            <Mail className="h-5 w-5 dark:text-white text-gray-400 mr-3" />
            <div>
              <p className="text-sm dark:text-white text-gray-500">Email</p>
              <p className="dark:text-white text-gray-900">{userProfile.email}</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 dark:bg-transparent dark:border rounded-lg">
            <Phone className="h-5 w-5 dark:text-white text-gray-400 mr-3" />
            <div>
              <p className="text-sm dark:text-white text-gray-500">Phone</p>
              <p className="dark:text-white text-gray-900">{userProfile.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      {settingsSections.map((section) => (
        <div key={section.title} className="bg-white dark:bg-[#0d0d0d] dark:text-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center mb-4">
            <section.icon className="h-5 w-5 dark:text-white text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold dark:text-white text-gray-900">{section.title}</h2>
          </div>
          <div className="space-y-2">
            {section.items.map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center justify-between p-3  rounded-lg group"
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 dark:text-white text-gray-400 mr-3 group-hover:text-blue-500" />
                  <span className="dark:text-white text-gray-700 group-hover:dark:text-white ">{item.label}</span>
                </div>
                <svg className="h-5 w-5 dark:text-white text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

export default ChatInterface;