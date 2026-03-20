import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faBell,
  faChartLine,
  faMobileAlt,
  faRobot,
  faShieldAlt,
  faUsers,
  faCamera,
  faCloudUploadAlt,
  faSyncAlt,
  faFileAlt,
  faClock,
} from '@fortawesome/free-solid-svg-icons';

function Features() {
  const featureCategories = [
    {
      title: 'Core Features',
      features: [
        {
          icon: faCalendarAlt,
          title: 'Advanced Event Management',
          description: 'Create, edit, and manage events with recurring patterns. Support for daily, weekly, monthly, and custom recurrence rules.',
          benefits: [
            'Drag-and-drop calendar interface',
            'Multiple calendar views (day, week, month)',
            'Event categories and color coding',
            'Quick event creation',
          ],
        },
        {
          icon: faBell,
          title: 'Smart Notifications',
          description: 'Never miss important events with our intelligent notification system that adapts to your schedule.',
          benefits: [
            'Customizable reminder times',
            'Push notifications on all devices',
            'Email and SMS reminders',
            'Smart scheduling suggestions',
          ],
        },
        {
          icon: faChartLine,
          title: 'Health & Activity Tracking',
          description: 'Monitor your pet\'s health metrics, medications, and activities with comprehensive tracking tools.',
          benefits: [
            'Weight and growth tracking',
            'Medication schedules',
            'Vaccination records',
            'Activity logs and reports',
          ],
        },
      ],
    },
    {
      title: 'Advanced Capabilities',
      features: [
        {
          icon: faRobot,
          title: 'AI-Powered Assistant',
          description: 'Leverage artificial intelligence to get personalized recommendations and automated scheduling.',
          benefits: [
            'Smart event suggestions',
            'Natural language processing',
            'Automated routine creation',
            'Intelligent insights',
          ],
        },
        {
          icon: faCamera,
          title: 'Photo & Media Management',
          description: 'Store and organize photos and videos of your pets with unlimited cloud storage.',
          benefits: [
            'Unlimited photo storage',
            'Photo albums and galleries',
            'Share with family and vets',
            'Automatic backup',
          ],
        },
        {
          icon: faUsers,
          title: 'Multi-User Collaboration',
          description: 'Share pet care responsibilities with family members, trainers, and veterinarians.',
          benefits: [
            'Role-based access control',
            'Shared calendars',
            'Activity feed',
            'Real-time synchronization',
          ],
        },
      ],
    },
    {
      title: 'Technical Features',
      features: [
        {
          icon: faMobileAlt,
          title: 'Cross-Platform Support',
          description: 'Access your data seamlessly across web and mobile devices with automatic synchronization.',
          benefits: [
            'Web application',
            'iOS mobile app (coming soon)',
            'Android mobile app (coming soon)',
            'Offline mode support',
          ],
        },
        {
          icon: faShieldAlt,
          title: 'Security & Privacy',
          description: 'Your pet data is protected with enterprise-grade security and encryption.',
          benefits: [
            'End-to-end encryption',
            'GDPR compliant',
            'Regular security audits',
            'Data export anytime',
          ],
        },
        {
          icon: faSyncAlt,
          title: 'Real-Time Sync',
          description: 'All your changes are instantly synchronized across all your devices.',
          benefits: [
            'Instant updates',
            'Conflict resolution',
            'Offline changes sync',
            'Version history',
          ],
        },
      ],
    },
    {
      title: 'Productivity Tools',
      features: [
        {
          icon: faFileAlt,
          title: 'Reports & Export',
          description: 'Generate comprehensive reports and export your data in various formats.',
          benefits: [
            'Health reports for vets',
            'Activity summaries',
            'Export to PDF/Excel',
            'Print-friendly formats',
          ],
        },
        {
          icon: faClock,
          title: 'Time Management',
          description: 'Optimize your pet care routine with intelligent time management tools.',
          benefits: [
            'Time blocking',
            'Task prioritization',
            'Routine templates',
            'Time analytics',
          ],
        },
        {
          icon: faCloudUploadAlt,
          title: 'Cloud Storage',
          description: 'All your pet data is safely stored in the cloud with automatic backups.',
          benefits: [
            'Automatic backups',
            'Version control',
            'Data recovery',
            'Scalable storage',
          ],
        },
      ],
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features for Modern Pet Care
            </h1>
            <p className="text-xl text-primary-100">
              Everything you need to manage your pet's life, all in one comprehensive platform
            </p>
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      {featureCategories.map((category, categoryIndex) => (
        <section
          key={categoryIndex}
          className={`py-20 ${categoryIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              {category.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.features.map((feature, featureIndex) => (
                <div
                  key={featureIndex}
                  className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all"
                >
                  <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                    <FontAwesomeIcon icon={feature.icon} className="text-3xl text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience All These Features?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Start using GastonApp today and discover how easy pet care can be
          </p>
          <a
            href="https://app.gastonapp.com"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-white text-primary-600 hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
          >
            Get Started Now
          </a>
        </div>
      </section>
    </div>
  );
}

export default Features;
