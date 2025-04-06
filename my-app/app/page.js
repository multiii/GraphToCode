"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#DDF3EE]">
      {/* Header */}
      <div className="px-80">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-100 container mx-auto px-6 py-4 my-6 rounded-full flex justify-center-safe gap-128 items-center shadow-3xl shadow-[#c1e6dd] shadow-lg"
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="font-bold text-3xl text-gray-900"
          >
            CodeItNodeIt!
          </motion.div>
          <nav className="flex items-center gap-2">
              <Link
                href="#about"
                className="text-xl font-light text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                About
              </Link>
            <span className="text-gray-700">•</span>
              <Link
                href="#pricing"
                className="text-xl font-light text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                Pricing (Free)
              </Link>
          </nav>
        </motion.header>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="bg-linear-to-b from-[#ddf3ee] to-white">
          {/* Hero Section */}
          <section className="container mx-auto px-24 pt-32 pb-32 text-center">
            <motion.h1
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              variants={fadeIn}
              className="text-6xl mb-12 text-gray-900"
            >
              Visualize and design code
              <br />
              like never before
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Link href="/editor">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(193, 230, 221, 0.7)" }}
                  whileTap={{ scale: 0.98 }}
                  className="text-lg font-bold cursor-pointer ring-3 ring-[#c1e6dd] shadow-3xl shadow-[#c1e6dd] text-gray-900 bg-white text-gray-700 py-4 px-8 rounded-full shadow-lg flex items-center gap-2 mx-auto hover:shadow-xl transition-all duration-300"
                >
                  Try now
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, repeatDelay: 3, duration: 1 }}
                  >
                    <ArrowRight className="w-8 h-8" />
                  </motion.div>
                </motion.button>
              </Link>
            </motion.div>
          </section>

          {/* Feature Highlight */}
          <section className="container mx-auto px-24 py-32 grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2 className="text-gray-900 text-4xl">
                Orchestrate
                <br />
                software at scale
                <br />
                with our graph
                <br />
                based approach
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="shadow-lg ring-3 ring-[#c1e6dd] shadow-3xl shadow-[#c1e6dd] bg-[#daf1ed] px-4 py-4 rounded-xl text-center text-gray-900 text-xl"
            >
              <img src="unrealer_graph.png" alt="Graph visualization" />
            </motion.div>
          </section>
        </div>

        {/* Features Grid - Fixed to extend full width */}
        <section className="w-full bg-[#ddf3ee] py-32">
          <div className="container mx-auto px-24">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-4xl mb-8 text-gray-900"
            >
              Focus on large scale with our features
            </motion.h2>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="grid md:grid-cols-3 gap-6"
            >
              <motion.div
                variants={fadeIn}
                whileHover={{ y: -8, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="bg-white p-6 rounded-xl shadow transition-all duration-300"
              >
                <h3 className="font-bold text-xl mb-4 text-gray-900 border-b-4 border-[#c0cdca] pb-2">Graph to Code</h3>
                <p className="text-gray-700 pt-4">Design the architecture, leave the smaller "solved" problems to AI</p>
              </motion.div>

              <motion.div
                variants={fadeIn}
                whileHover={{ y: -8, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="bg-white p-6 rounded-xl shadow transition-all duration-300"
              >
                <h3 className="font-bold text-xl mb-4 text-gray-900 border-b-4 border-[#c0cdca] pb-2">Code to Graph</h3>
                <p className="text-gray-700 pt-4">Automatically load any project into a graph</p>
              </motion.div>

              <motion.div
                variants={fadeIn}
                whileHover={{ y: -8, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="bg-white p-6 rounded-xl shadow transition-all duration-300"
              >
                <h3 className="font-bold text-xl mb-4 text-gray-900 border-b-4 border-[#c0cdca] pb-2">Graph Viewer</h3>
                <p className="text-gray-700 pt-4">
                  Navigate and understand large codebases faster than ever before with our unique graph viewer
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Integration Points */}
        <section className="w-full py-16 bg-white">
          <div className="container mx-auto px-16">
            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="space-y-4"
            >
              <motion.li
                variants={fadeIn}
                className="flex items-center gap-3 border-b-4 border-[#c0cdca] pb-4"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-3 h-3 rounded-full bg-gray-300"
                ></motion.div>
                <span className="font-medium text-gray-900 text-2xl">
                  Unlike competitors, boost productivity at large scale
                </span>
              </motion.li>
              <motion.li
                variants={fadeIn}
                className="flex items-center gap-3 border-b-4 border-[#c0cdca] pb-4"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-3 h-3 rounded-full bg-gray-300"
                ></motion.div>
                <span className="font-medium text-gray-900 text-2xl">Load any existing repositories</span>
              </motion.li>
              <motion.li
                variants={fadeIn}
                className="flex items-center gap-3 border-b-4 border-[#c0cdca] pb-4"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-3 h-3 rounded-full bg-gray-300"
                ></motion.div>
                <span className="font-medium text-gray-900 text-2xl">Integrate with any IDE</span>
              </motion.li>
            </motion.ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-[#e6f5f3] py-8 mt-16"
      >
        <div className="container mx-auto px-24">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="font-bold text-4xl mb-6 text-gray-900"
          >
            CodeItNodeIt!
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xl text-center text-gray-500 text-sm border-t pt-4"
          >
            (C) 2025 ··· All Rights Reserved
          </motion.div>
        </div>
      </motion.footer>
    </div>
  )
}

