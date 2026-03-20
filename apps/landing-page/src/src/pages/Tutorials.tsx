import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faBook,
  faVideo,
  faFileAlt,
  faCalendarPlus,
  faBell,
  faPaw,
  faChartLine,
  faUsers,
  faRobot,
} from '@fortawesome/free-solid-svg-icons';

function Tutorials() {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Tutorials', icon: faBook },
    { id: 'getting-started', name: 'Getting Started', icon: faPaw },
    { id: 'events', name: 'Events', icon: faCalendarPlus },
    { id: 'notifications', name: 'Notifications', icon: faBell },
    { id: 'health', name: 'Health Tracking', icon: faChartLine },
    { id: 'collaboration', name: 'Collaboration', icon: faUsers },
    { id: 'ai-features', name: 'AI Features', icon: faRobot },
  ];

  const tutorials = [
    {
      id: 1,
      category: 'getting-started',
      type: 'video',
      title: 'Getting Started with GastonApp',
      description: 'Learn the basics of setting up your account and creating your first pet profile.',
      duration: '5 min',
      level: 'Beginner',
      thumbnail: '/tutorials/getting-started.jpg',
    },
    {
      id: 2,
      category: 'getting-started',
      type: 'article',
      title: 'Creating Your First Pet Profile',
      description: 'Step-by-step guide to adding your pet\'s information and uploading photos.',
      duration: '3 min read',
      level: 'Beginner',
      thumbnail: '/tutorials/pet-profile.jpg',
    },
    {
      id: 3,
      category: 'events',
      type: 'video',
      title: 'Creating and Managing Events',
      description: 'Master the event creation process and learn how to set up recurring events.',
      duration: '8 min',
      level: 'Beginner',
      thumbnail: '/tutorials/events-basic.jpg',
    },
    {
      id: 4,
      category: 'events',
      type: 'video',
      title: 'Advanced Event Features',
      description: 'Explore recurring patterns, event categories, and calendar customization.',
      duration: '12 min',
      level: 'Intermediate',
      thumbnail: '/tutorials/events-advanced.jpg',
    },
    {
      id: 5,
      category: 'events',
      type: 'article',
      title: 'Drag and Drop Calendar Management',
      description: 'Learn how to use drag-and-drop to reschedule events quickly.',
      duration: '4 min read',
      level: 'Beginner',
      thumbnail: '/tutorials/drag-drop.jpg',
    },
    {
      id: 6,
      category: 'notifications',
      type: 'video',
      title: 'Setting Up Smart Reminders',
      description: 'Configure notifications to never miss important events for your pets.',
      duration: '6 min',
      level: 'Beginner',
      thumbnail: '/tutorials/notifications.jpg',
    },
    {
      id: 7,
      category: 'notifications',
      type: 'article',
      title: 'Customizing Notification Preferences',
      description: 'Fine-tune when and how you receive notifications across all your devices.',
      duration: '5 min read',
      level: 'Intermediate',
      thumbnail: '/tutorials/notification-settings.jpg',
    },
    {
      id: 8,
      category: 'health',
      type: 'video',
      title: 'Health Tracking Basics',
      description: 'Record weight, medications, and veterinary visits for your pets.',
      duration: '10 min',
      level: 'Beginner',
      thumbnail: '/tutorials/health-tracking.jpg',
    },
    {
      id: 9,
      category: 'health',
      type: 'article',
      title: 'Creating Health Reports',
      description: 'Generate comprehensive health reports to share with your veterinarian.',
      duration: '6 min read',
      level: 'Intermediate',
      thumbnail: '/tutorials/health-reports.jpg',
    },
    {
      id: 10,
      category: 'collaboration',
      type: 'video',
      title: 'Sharing with Family Members',
      description: 'Invite family members and set appropriate permissions for pet care collaboration.',
      duration: '7 min',
      level: 'Intermediate',
      thumbnail: '/tutorials/sharing.jpg',
    },
    {
      id: 11,
      category: 'collaboration',
      type: 'article',
      title: 'Working with Veterinarians',
      description: 'Best practices for sharing information with your pet\'s healthcare providers.',
      duration: '5 min read',
      level: 'Advanced',
      thumbnail: '/tutorials/vet-collaboration.jpg',
    },
    {
      id: 12,
      category: 'ai-features',
      type: 'video',
      title: 'AI-Powered Scheduling',
      description: 'Let AI suggest optimal times for events based on your pet\'s routine.',
      duration: '9 min',
      level: 'Intermediate',
      thumbnail: '/tutorials/ai-scheduling.jpg',
    },
    {
      id: 13,
      category: 'ai-features',
      type: 'article',
      title: 'Using Natural Language Commands',
      description: 'Create events and set reminders using simple, conversational language.',
      duration: '4 min read',
      level: 'Beginner',
      thumbnail: '/tutorials/ai-commands.jpg',
    },
  ];

  const filteredTutorials = activeCategory === 'all'
    ? tutorials
    : tutorials.filter((tutorial) => tutorial.category === activeCategory);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Learn How to Use GastonApp
            </h1>
            <p className="text-xl text-primary-100">
              Comprehensive tutorials and guides to help you master all features
            </p>
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Create Account</h3>
                <p className="text-sm text-gray-600">Sign up and set up your profile</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Add Your Pets</h3>
                <p className="text-sm text-gray-600">Create profiles for your pets</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Start Scheduling</h3>
                <p className="text-sm text-gray-600">Create events and set reminders</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FontAwesomeIcon icon={category.icon} />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tutorials Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTutorials.map((tutorial) => (
              <div
                key={tutorial.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="relative h-48 bg-gray-200 flex items-center justify-center">
                  {tutorial.type === 'video' ? (
                    <FontAwesomeIcon icon={faVideo} className="text-6xl text-gray-400" />
                  ) : (
                    <FontAwesomeIcon icon={faFileAlt} className="text-6xl text-gray-400" />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faPlay} className="text-2xl text-primary-600" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(tutorial.level)}`}>
                      {tutorial.level}
                    </span>
                    <span className="text-sm text-gray-500">{tutorial.duration}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{tutorial.title}</h3>
                  <p className="text-gray-600 text-sm">{tutorial.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Need More Help?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@gastonapp.com"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Contact Support
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Visit Help Center
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Join thousands of pet owners using GastonApp to manage their pets' lives
          </p>
          <a
            href="https://app.gastonapp.com"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-white text-primary-600 hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
          >
            Try GastonApp Free
          </a>
        </div>
      </section>
    </div>
  );
}

export default Tutorials;
