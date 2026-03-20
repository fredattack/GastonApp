import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for single pet owners getting started',
      features: [
        { text: '1 pet profile', included: true },
        { text: 'Basic event scheduling', included: true },
        { text: 'Email reminders', included: true },
        { text: 'Mobile app access', included: true },
        { text: '100 MB storage', included: true },
        { text: 'Health tracking', included: false },
        { text: 'Multi-user sharing', included: false },
        { text: 'AI-powered features', included: false },
        { text: 'Priority support', included: false },
      ],
      cta: 'Get Started',
      ctaLink: 'https://app.gastonapp.com/register',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: 'per month',
      description: 'Ideal for dedicated pet owners',
      features: [
        { text: 'Up to 5 pet profiles', included: true },
        { text: 'Advanced event scheduling', included: true },
        { text: 'Email & push notifications', included: true },
        { text: 'Mobile app access', included: true },
        { text: '10 GB storage', included: true },
        { text: 'Health & activity tracking', included: true },
        { text: 'Multi-user sharing (up to 3)', included: true },
        { text: 'Basic AI features', included: true },
        { text: 'Priority support', included: false },
      ],
      cta: 'Start Free Trial',
      ctaLink: 'https://app.gastonapp.com/register?plan=pro',
      highlighted: true,
    },
    {
      name: 'Premium',
      price: '$19.99',
      period: 'per month',
      description: 'For professionals and multi-pet households',
      features: [
        { text: 'Unlimited pet profiles', included: true },
        { text: 'Advanced event scheduling', included: true },
        { text: 'All notification types', included: true },
        { text: 'Mobile app access', included: true },
        { text: 'Unlimited storage', included: true },
        { text: 'Advanced health tracking', included: true },
        { text: 'Unlimited user sharing', included: true },
        { text: 'Full AI-powered features', included: true },
        { text: '24/7 priority support', included: true },
      ],
      cta: 'Start Free Trial',
      ctaLink: 'https://app.gastonapp.com/register?plan=premium',
      highlighted: false,
    },
  ];

  const faqs = [
    {
      question: 'Can I change my plan later?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any payments.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, all paid plans come with a 14-day free trial. No credit card required to start.',
    },
    {
      question: 'What happens to my data if I cancel?',
      answer: 'You can export all your data at any time. If you cancel, your data remains accessible in read-only mode for 30 days.',
    },
    {
      question: 'Do you offer discounts for multiple pets?',
      answer: 'Our Pro and Premium plans already include multiple pets. Contact us for custom enterprise pricing for large-scale operations.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal.',
    },
    {
      question: 'Is there a money-back guarantee?',
      answer: 'Yes! If you\'re not satisfied within the first 30 days, we\'ll refund your payment, no questions asked.',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-primary-100">
              Choose the plan that's right for you. All plans include a 14-day free trial.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                  plan.highlighted
                    ? 'ring-4 ring-primary-500 transform scale-105'
                    : 'hover:shadow-xl transition-shadow'
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-primary-600 text-white text-center py-2 font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">/ {plan.period}</span>
                  </div>
                  <a
                    href={plan.ctaLink}
                    className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors mb-8 ${
                      plan.highlighted
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </a>
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <FontAwesomeIcon
                          icon={feature.included ? faCheck : faTimes}
                          className={`mt-1 mr-3 ${
                            feature.included ? 'text-green-500' : 'text-gray-300'
                          }`}
                        />
                        <span
                          className={feature.included ? 'text-gray-700' : 'text-gray-400'}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Need a Custom Plan?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              For veterinary clinics, pet trainers, or organizations managing multiple clients,
              we offer custom enterprise solutions.
            </p>
            <a
              href="mailto:enterprise@gastonapp.com"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Your Free Trial Today
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            No credit card required. Cancel anytime. Get full access to all features for 14 days.
          </p>
          <a
            href="https://app.gastonapp.com/register"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-white text-primary-600 hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
          >
            Try GastonApp Free
          </a>
        </div>
      </section>
    </div>
  );
}

export default Pricing;
