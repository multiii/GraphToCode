import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#DDF3EE]">
      {/* Header */}
      <div className="px-80">
      <header className="bg-gray-100 container mx-auto px-6 py-4 my-6 rounded-full flex justify-center-safe gap-128 items-center shadow-3xl shadow-[#c1e6dd] shadow-lg">
        <div className="font-bold text-3xl text-gray-900">CodeItNodeIt</div>
        <nav className="flex items-center gap-2">
          <Link href="#about" className="text-xl font-light text-gray-700 hover:text-gray-900">
            About
          </Link>
          <span className="text-gray-700">•</span>
          <Link href="#pricing" className="text-xl font-light text-gray-700 hover:text-gray-900">
            Pricing
          </Link>
          <span className="text-gray-700">•</span>
          <Link href="#page3" className="text-xl font-light text-gray-700 hover:text-gray-900">
            Page 3
          </Link>
        </nav>
      </header>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="bg-linear-to-b from-[#ddf3ee] to-white">
          {/* Hero Section */}
          <section className="container mx-auto px-24 pt-32 pb-32  text-center">
            <h1 className="text-6xl mb-12 text-gray-900">
              Visualize and design code
              <br />
              like never before
            </h1>
            <Link href="/editor">
              <button className="cursor-pointer ring-3 ring-[#c1e6dd] shadow-3xl shadow-[#c1e6dd] text-gray-900 bg-white text-gray-700 px-6 py-2 rounded-full shadow-lg flex items-center gap-2 mx-auto hover:shadow-xl transition-shadow">
                Try now <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </section>

          {/* Feature Highlight */}
          <section className="container mx-auto px-24 py-32 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-gray-900 text-4xl">
                Orchestrate
                <br />
                software at scale
                <br />
                with our graph
                <br />
                based approach
              </h2>
            </div>
            <div className="shadow-lg ring-3 ring-[#c1e6dd] shadow-3xl shadow-[#c1e6dd] bg-[#daf1ed] px-16 py-28 rounded-xl text-center text-gray-900 text-xl">
              Picture of the graph viewer here
            </div>
          </section>
        </div>

        {/* Features Grid - Fixed to extend full width */}
        <section className="w-full bg-[#ddf3ee] py-32">
          <div className="container mx-auto px-24">
            <h2 className="text-4xl mb-8 text-gray-900">Focus on large scale with our features</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-bold text-xl mb-4 text-gray-900 border-b-4 border-[#c0cdca] pb-2">Graph to Code</h3>
                <p className="text-gray-700 pt-4">Design the architecture, leave the smaller "solved" problems to AI</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-bold text-xl mb-4 text-gray-900 border-b-4 border-[#c0cdca] pb-2">Code to Graph</h3>
                <p className="text-gray-700 pt-4">Automatically load any project into a graph</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-bold text-xl mb-4 text-gray-900 border-b-4 border-[#c0cdca] pb-2">Graph Viewer</h3>
                <p className="text-gray-700 pt-4">Navigate and understand large codebases faster than ever before with our unique graph viewer</p>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Points */}
        <section className="w-full py-16 bg-white">
          <div className="container mx-auto px-16">
            <ul className="space-y-4">
              <li className="flex items-center gap-3 border-b-4 border-[#c0cdca] pb-4">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span className="font-medium text-gray-900 text-2xl">Unlike competitors, boost productivity at large scale</span>
              </li>
              <li className="flex items-center gap-3 border-b-4 border-[#c0cdca] pb-4">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span className="font-medium text-gray-900 text-2xl">Load any existing repositories</span>
              </li>
              <li className="flex items-center gap-3 border-b-4 border-[#c0cdca] pb-4">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span className="font-medium text-gray-900 text-2xl">Integrate with any IDE</span>
              </li>
            </ul>
          </div>
        </section>


      </main>

      {/* Footer */}
      <footer className="bg-[#e6f5f3] py-8 mt-16">
        <div className="container mx-auto px-24">
          <div className="font-bold text-4xl mb-6 text-gray-900">CodeItNodeIt!</div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <div>
                <Link href="#" className="text-xl text-gray-700 hover:text-gray-900">
                  Link
                </Link>
              </div>
              <div>
                <Link href="#" className="text-xl text-gray-700 hover:text-gray-900">
                  Link
                </Link>
              </div>
              <div>
                <Link href="#" className="text-xl text-gray-700 hover:text-gray-900">
                  Link
                </Link>
              </div>
              <div>
                <Link href="#" className="text-xl text-gray-700 hover:text-gray-900">
                  Link
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <Link href="#" className="text-xl text-gray-700 hover:text-gray-900">
                  Link
                </Link>
              </div>
              <div>
                <Link href="#" className="text-xl text-gray-700 hover:text-gray-900">
                  Link
                </Link>
              </div>
              <div>
                <Link href="#" className="text-xl text-gray-700 hover:text-gray-900">
                  Link
                </Link>
              </div>
              <div>
                <Link href="#" className="text-xl text-gray-700 hover:text-gray-900">
                  Link
                </Link>
              </div>
            </div>
          </div>

          <div className="text-xl text-center text-gray-500 text-sm border-t pt-4">
            (C) 2025 ··· All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  )
}

