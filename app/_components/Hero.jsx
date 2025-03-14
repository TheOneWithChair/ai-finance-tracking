"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ContainerScroll } from "../../components/ui/container-scroll-animation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Hero() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/dashboard");
  };

  return (
    <section className="bg-gray-50 flex items-center flex-col">
      <div className="flex flex-col overflow-hidden">
        <ContainerScroll
          titleComponent={
            <>
              {/* Heading with Motion Effects */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-4xl font-semibold text-black dark:text-white text-center"
              >
                Your AI-Powered Guide to Smarter Spending & Saving <br />
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                  className="text-4xl md:text-[6rem] text-blue-800 font-bold mt-1 leading-none"
                >
                  Personalized Finance Advice
                </motion.span>
              </motion.h1>

              {/* Button with Motion Hover Effect */}
              <div className="mt-8 flex flex-col items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleGetStarted}
                    className="bg-blue-800 hover:bg-blue-700 text-white px-8 py-6 rounded-full text-lg font-semibold transition-all duration-200"
                  >
                    Get Started for Free
                  </Button>
                </motion.div>
                <p className="text-gray-600 text-sm">
                  ✨ No credit card required • Free forever plan available
                </p>
              </div>
            </>
          }
        >
          {/* Hero Image */}
          <div className="relative">
            <Image
              src={`/dashboard.png`}
              alt="hero"
              height={720}
              width={1400}
              className="mx-auto rounded-2xl object-cover h-full object-left-top shadow-xl"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent bottom-0 h-20"></div>
          </div>
        </ContainerScroll>
      </div>
    </section>
  );
}

export default Hero;
