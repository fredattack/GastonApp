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
  faPaw,
} from '@fortawesome/free-solid-svg-icons';

function Home() {
  const features = [
    {
      icon: faCalendarAlt,
      title: 'Event Management',
      description: 'Schedule and manage all your pet events, appointments, and activities in one place.',
      gradient: 'from-primary-50 to-primary-100',
      iconColor: 'text-primary-400',
    },
    {
      icon: faBell,
      title: 'Smart Reminders',
      description: 'Never miss an important event with intelligent notification and reminder system.',
      gradient: 'from-lavender-light/40 to-lavender/20',
      iconColor: 'text-lavender-dark',
    },
    {
      icon: faChartLine,
      title: 'Health Tracking',
      description: 'Track your pet\'s health metrics, medications, and veterinary visits over time.',
      gradient: 'from-mint-light/40 to-mint/20',
      iconColor: 'text-mint-dark',
    },
    {
      icon: faMobileAlt,
      title: 'Multi-Platform',
      description: 'Access your pet data from web and mobile apps, anywhere, anytime.',
      gradient: 'from-coral-light/40 to-coral/20',
      iconColor: 'text-coral-dark',
    },
    {
      icon: faRobot,
      title: 'AI-Powered',
      description: 'Leverage AI features for enhanced scheduling and pet care recommendations.',
      gradient: 'from-secondary-50 to-secondary-100',
      iconColor: 'text-secondary-500',
    },
    {
      icon: faShieldAlt,
      title: 'Secure & Private',
      description: 'Your pet data is encrypted and securely stored with industry-standard security.',
      gradient: 'from-primary-50 to-lin-3',
      iconColor: 'text-primary-600',
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
    <div className="bg-lin-2">
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #B8F4DC 0%, #FFFFFF 50%, #F4F1E8 100%)' }}>
        <div className="container mx-auto px-5 sm:px-6 lg:px-10 py-24 md:py-36 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 mb-8 shadow-soft-sm">
              <FontAwesomeIcon icon={faPaw} className="text-primary-400" />
              <span className="text-sm font-semibold text-primary-700">Pet care, simplified</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-900 tracking-tight">
              Manage Your Pet's Life with
              <span className="block text-primary-400">One Simple App</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Schedule events, track health records, set reminders, and never miss an important moment
              in your pet's life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://app.gastonapp.com"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-all shadow-soft-lg hover:shadow-soft-xl hover:-translate-y-0.5"
              >
                Get Started Free
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </a>
              <Link
                to="/features"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full bg-white text-gray-900 border-2 border-lin-5 hover:border-primary-400 hover:text-primary-700 transition-all shadow-soft-sm"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-lin-1">
        <div className="container mx-auto px-5 sm:px-6 lg:px-10">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Everything You Need for Pet Care
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive features designed to make pet ownership easier and more enjoyable
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${feature.gradient} p-7 rounded-2xl shadow-soft-sm hover:shadow-soft-lg transition-all duration-250 hover:-translate-y-0.5 border border-lin-3/50`}
              >
                <div className="w-12 h-12 bg-white/70 rounded-xl flex items-center justify-center mb-5 shadow-soft-sm">
                  <FontAwesomeIcon icon={feature.icon} className={`text-xl ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-28 bg-lin-0">
        <div className="container mx-auto px-5 sm:px-6 lg:px-10">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-secondary-500 mb-3">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Loved by Pet Owners Everywhere
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our users have to say about GastonApp
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-7 rounded-2xl shadow-soft-sm border border-lin-3/50 hover:shadow-soft-md transition-all">
                <div className="flex mb-4 gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} className="text-secondary-400 text-sm" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">&quot;{testimonial.content}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-700">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                    <p className="text-gray-500 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28" style={{ background: 'linear-gradient(135deg, #B8F4DC 0%, #E8D9F5 100%)' }}>
        <div className="container mx-auto px-5 sm:px-6 lg:px-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 tracking-tight">
            Ready to Get Started?
          </h2>
          <p className="text-lg mb-10 text-gray-700 max-w-2xl mx-auto">
            Join thousands of pet owners who trust GastonApp to manage their pets' lives
          </p>
          <a
            href="https://app.gastonapp.com"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-all shadow-soft-lg hover:shadow-soft-xl hover:-translate-y-0.5"
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
