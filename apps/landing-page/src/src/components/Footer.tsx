import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white">
      <div className="container mx-auto px-5 sm:px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <FontAwesomeIcon icon={faPaw} className="text-3xl text-primary-300" />
              <span className="text-2xl font-bold">GastonApp</span>
            </div>
            <p className="text-primary-200/70 mb-4">
              The complete pet event management solution for pet owners, trainers, and veterinarians.
              Schedule, track, and manage all your pet-related activities in one place.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-200/50 hover:text-primary-300 transition-colors">
                <FontAwesomeIcon icon={faFacebook} className="text-xl" />
              </a>
              <a href="#" className="text-primary-200/50 hover:text-primary-300 transition-colors">
                <FontAwesomeIcon icon={faTwitter} className="text-xl" />
              </a>
              <a href="#" className="text-primary-200/50 hover:text-primary-300 transition-colors">
                <FontAwesomeIcon icon={faInstagram} className="text-xl" />
              </a>
              <a href="#" className="text-primary-200/50 hover:text-primary-300 transition-colors">
                <FontAwesomeIcon icon={faLinkedin} className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-primary-200/70 hover:text-primary-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-primary-200/70 hover:text-primary-300 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-primary-200/70 hover:text-primary-300 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="text-primary-200/70 hover:text-primary-300 transition-colors">
                  Tutorials
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-primary-200/70 hover:text-primary-300 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-200/70 hover:text-primary-300 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-200/70 hover:text-primary-300 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-200/70 hover:text-primary-300 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-800 mt-8 pt-8 text-center text-primary-200/50">
          <p>&copy; {currentYear} GastonApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
