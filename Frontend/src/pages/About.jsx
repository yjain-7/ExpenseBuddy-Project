import React from "react";
import { ArrowRight, IndianRupee, Users, PieChart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Simplify Group Expenses</h1>
          <p className="text-xl mb-8">
            Split bills, track debts, and manage your finances with friends
            effortlessly.
          </p>
          <button 
            onClick={handleGetStarted}
            className="bg-[#b3efdc] px-6 py-3 rounded-full text-lg font-semibold hover:bg-opacity-80 transition duration-300 flex items-center mx-auto"
          >
            Get Started
            <ArrowRight className="ml-2" />
          </button>
        </div>

        {/* Rest of the component remains the same */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <FeatureCard
            icon={< IndianRupee size={40} />}
            title="Easy Expense Splitting"
            description="Divide costs fairly among group members with just a few taps."
          />
          <FeatureCard
            icon={<Users size={40} />}
            title="Group Management"
            description="Create and manage multiple groups for different occasions or friend circles."
          />
          <FeatureCard
            icon={<PieChart size={40} />}
            title="Debt Simplification"
            description="Automatically calculate and simplify debts within the group."
          />
        </div>
        <div>
          <p className="text-gray-700 mb-6 text-xl font-semibold text-center pt-10">
            For more information or to get in touch, feel free to connect with
            me through the links below:
          </p>
        </div>
        <div className="flex space-x-4 justify-center mb-8">
          <a
            href="https://www.linkedin.com/in/yjain7302/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            <img
              src="src/assets/icons8-linkedin-48.png"
              alt="LinkedIn"
              className="inline-block"
            />
          </a>
          <a
            href="https://github.com/yjain-7"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:underline"
          >
            <img
              src="src/assets/icons8-github-50.png"
              alt="GitHub"
              className="inline-block"
            />
          </a>
        </div>
      </main>

      <footer className="container mx-auto px-6 py-4  text-center text-gray-500">
        <p>&copy; 2024 Expense Buddy. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-black p-6 rounded-lg text-center">
      <div className="text-[#b3efdc] mb-4 flex justify-center">{icon}</div>
      <h3 className="text-white text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default About;