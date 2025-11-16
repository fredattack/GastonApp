import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faBell,
  faChartLine,
  faMobileAlt,
  faRobot,
  faShieldAlt,
  faArrowRight,
  faStar,
} from '@fortawesome/free-solid-svg-icons';

function Home() {
  const features = [
    {
      icon: faCalendarAlt,
      title: 'Event Management',
      description: 'Schedule and manage all your pet events, appointments, and activities in one place.',
    },
    {
      icon: faBell,
      title: 'Smart Reminders',
      description: 'Never miss an important event with intelligent notification and reminder system.',
    },
    {
      icon: faChartLine,
      title: 'Health Tracking',
      description: 'Track your pet\'s health metrics, medications, and veterinary visits over time.',
    },
    {
      icon: faMobileAlt,
      title: 'Multi-Platform',
      description: 'Access your pet data from web and mobile apps, anywhere, anytime.',
    },
    {
      icon: faRobot,
      title: 'AI-Powered',
      description: 'Leverage AI features for enhanced scheduling and pet care recommendations.',
    },
    {
      icon: faShieldAlt,
      title: 'Secure & Private',
      description: 'Your pet data is encrypted and securely stored with industry-standard security.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Dog Owner',
      content: 'GastonApp has transformed how I manage my three dogs\' schedules. Everything is so organized now!',
      rating: 5,
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Veterinarian',
      content: 'As a vet, I recommend GastonApp to all my clients. It helps them stay on top of their pets\' health needs.',
      rating: 5,
    },
    {
      name: 'Emma Wilson',
      role: 'Cat Owner',
      content: 'The reminder system is a lifesaver. I never forget my cat\'s medication schedule anymore.',
      rating: 5,
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Manage Your Pet's Life with
              <span className="block text-primary-200">One Simple App</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Schedule events, track health records, set reminders, and never miss an important moment
              in your pet's life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://app.gastonapp.com"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-white text-primary-600 hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
              >
                Get Started Free
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </a>
              <Link
                to="/features"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Pet Care
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive features designed to make pet ownership easier and more enjoyable
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={feature.icon} className="text-2xl text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Pet Owners Everywhere
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our users have to say about GastonApp
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">&quot;{testimonial.content}&quot;</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
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
            Join thousands of pet owners who trust GastonApp to manage their pets' lives
          </p>
          <a
            href="https://app.gastonapp.com"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-white text-primary-600 hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
          >
            Start Your Free Trial
            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </a>
        </div>
      </section>
    </div>
  );
}

export default Home;
