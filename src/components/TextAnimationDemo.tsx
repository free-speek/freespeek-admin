import React from "react";
import AnimatedText from "./AnimatedText";

const TextAnimationDemo: React.FC = () => {
  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Text Animation Examples
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Typewriter Effect
          </h3>
          <AnimatedText
            animationType="typewriter"
            className="text-xl text-blue-600 font-mono"
          >
            Welcome to FreeSpeek Admin Panel
          </AnimatedText>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Fade In</h3>
          <AnimatedText
            animationType="fadeIn"
            delay={500}
            className="text-xl text-green-600"
          >
            Smooth fade in animation
          </AnimatedText>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Slide In</h3>
          <AnimatedText
            animationType="slideIn"
            delay={1000}
            className="text-xl text-purple-600"
          >
            Slides in from the left
          </AnimatedText>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Bounce</h3>
          <AnimatedText
            animationType="bounce"
            delay={1500}
            className="text-xl text-orange-600"
          >
            Bouncy entrance effect
          </AnimatedText>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Glow</h3>
          <AnimatedText
            animationType="glow"
            delay={2000}
            className="text-xl text-cyan-600"
          >
            Glowing text effect
          </AnimatedText>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Pulse</h3>
          <AnimatedText
            animationType="pulse"
            delay={2500}
            className="text-xl text-red-600"
          >
            Pulsing animation
          </AnimatedText>
        </div>
      </div>
    </div>
  );
};

export default TextAnimationDemo;
