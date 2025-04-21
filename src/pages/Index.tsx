
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import Navbar from "@/components/Navbar";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-golocal-softpurple to-white">
          <div className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8">
              <h1 className="text-4xl md:text-5xl font-bold text-golocal-dark mb-6">
                Campus rides made <span className="text-golocal-primary">simple</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Connect with fellow students for safe, affordable rides to campus and beyond. Share the journey, save money, and reduce your carbon footprint.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button className="w-full sm:w-auto bg-golocal-primary hover:bg-golocal-secondary text-white font-medium px-8 py-3">
                    Sign Up
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="w-full sm:w-auto border-golocal-primary text-golocal-primary hover:bg-golocal-softpurple px-8 py-3">
                    Log In
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="md:w-1/2 mt-12 md:mt-0">
              <div className="relative">
                <div className="w-full h-72 md:h-96 bg-golocal-primary/10 rounded-lg overflow-hidden shadow-lg relative">
                  {/* This would ideally be an image, using a placeholder for now */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-golocal-primary font-bold text-xl">Go Local App Preview</div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-golocal-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">Go Local</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">How Go Local Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-golocal-softpurple rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-golocal-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Host or Book</h3>
                <p className="text-gray-600">Either share your ride or find a ride that matches your schedule and destination.</p>
              </div>
              
              <div className="bg-golocal-softpurple rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-golocal-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect</h3>
                <p className="text-gray-600">Safely connect with verified students from your college community.</p>
              </div>
              
              <div className="bg-golocal-softpurple rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-golocal-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Go Together</h3>
                <p className="text-gray-600">Share the journey, split the cost, and make new friends along the way.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Go Local</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <div className="bg-golocal-primary rounded-full p-3 mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 10c0-1.105-2.686-2-6-2s-6 .895-6 2m12 0v6c0 1.105-2.686 2-6 2s-6-.895-6-2v-6"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Save Money</h3>
                  <p className="text-gray-600">Split fuel costs and parking fees with other students heading your way.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-golocal-primary rounded-full p-3 mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">College Community</h3>
                  <p className="text-gray-600">Travel with verified students only. Stay within your trusted college network.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-golocal-primary rounded-full p-3 mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Reduce Emissions</h3>
                  <p className="text-gray-600">Fewer cars means less traffic and a smaller carbon footprint.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-golocal-primary rounded-full p-3 mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Flexible Schedule</h3>
                  <p className="text-gray-600">Find rides that match your class schedule or set your own as a host.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-golocal-primary">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Go Local?</h2>
            <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
              Join your fellow students in making campus transportation easier, cheaper, and more sustainable.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button className="w-full sm:w-auto bg-white hover:bg-gray-100 text-golocal-primary font-medium px-8 py-3">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-golocal-primary/80 px-8 py-3">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-golocal-dark text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="font-bold text-xl">Go Local</span>
              <p className="text-sm mt-2 text-gray-300">Campus ridesharing made simple</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <Link to="/login" className="text-gray-300 hover:text-white">
                Login
              </Link>
              <Link to="/signup" className="text-gray-300 hover:text-white">
                Sign Up
              </Link>
              <a href="#" className="text-gray-300 hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                Terms of Service
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Go Local. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
