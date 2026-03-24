import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-background-light min-h-screen flex flex-col selection:bg-primary selection:text-white">
      {/* Main Split Layout */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Column: Sticky Hero */}
        <section className="w-full lg:w-1/2 flex flex-col justify-center px-6 lg:px-20 xl:px-32 py-20 lg:py-0 lg:sticky lg:top-0 lg:h-screen z-10">
          <div className="max-w-xl mx-auto lg:mx-0">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary"></span>
              <span className="text-sm font-bold text-gray-600">The safest way to get feedback</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-[56px] font-black leading-[1.1] tracking-tight text-text-main mb-6">
              Get anonymous messages without the <span className="text-gradient">weird vibes.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg lg:text-xl font-medium text-gray-500 mb-10 leading-relaxed max-w-md">
              A delightfully tactile anonymous Q&A platform where you ask and answer questions without the anxiety of public profiles.
            </p>

            {/* CTA */}
            <Link href="/sign-up">
              <button className="btn-squish flex w-full sm:w-[200px] cursor-pointer items-center justify-center rounded-full h-14 px-8 bg-primary text-white text-lg font-bold shadow-plush">
                Start for Free
              </button>
            </Link>

            {/* Social Proof */}
            <div className="mt-12 flex items-center gap-4 text-sm font-medium text-gray-400">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-background-light bg-gradient-to-tr from-orange-200 to-pink-200 flex items-center justify-center text-lg">🤫</div>
                <div className="w-10 h-10 rounded-full border-2 border-background-light bg-gradient-to-tr from-blue-200 to-indigo-200 flex items-center justify-center text-lg">👻</div>
                <div className="w-10 h-10 rounded-full border-2 border-background-light bg-gradient-to-tr from-green-200 to-emerald-200 flex items-center justify-center text-lg">🦊</div>
              </div>
              <p>Joined by 10,000+ creators</p>
            </div>
          </div>
        </section>

        {/* Right Column: Interactive Demo */}
        <section className="hidden sm:block w-full lg:w-1/2 relative bg-gradient-to-br from-[#f8f6f5] to-[#f4e8e7] overflow-hidden lg:h-screen border-l border-white/50">
          {/* Decorative Background Blobs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl mix-blend-multiply"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-3xl mix-blend-multiply"></div>

          <div className="floating-container w-full h-full">
            {/* Card 1 */}
            <div className="floating-card card-1 animate-drift-up-1 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-200 to-pink-200 flex items-center justify-center text-xl">🤫</div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">Anonymous</span>
                  <span className="text-xs font-medium text-gray-400">Just now</span>
                </div>
              </div>
              <p className="text-gray-700 font-medium leading-relaxed text-[17px]">
                Your latest video actually changed my perspective completely. Keep making art! 🎨✨
              </p>
            </div>

            {/* Card 2 */}
            <div className="floating-card card-2 animate-drift-up-2 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-200 to-indigo-200 flex items-center justify-center text-xl">👻</div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">Anonymous</span>
                  <span className="text-xs font-medium text-gray-400">2 mins ago</span>
                </div>
              </div>
              <p className="text-gray-700 font-medium leading-relaxed text-[17px]">
                Are you going to the creator meetup this weekend? Would love to say hi!
              </p>
            </div>

            {/* Card 3 */}
            <div className="floating-card card-3 animate-drift-up-3 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-200 to-emerald-200 flex items-center justify-center text-xl">🦊</div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">Anonymous</span>
                  <span className="text-xs font-medium text-gray-400">1 hr ago</span>
                </div>
              </div>
              <p className="text-gray-700 font-medium leading-relaxed text-[17px]">
                I have the biggest crush on your aesthetic. Drop the Spotify playlist pls 🎧
              </p>
            </div>

            {/* Card 4 */}
            <div className="floating-card card-4 animate-drift-up-4 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-200 to-orange-200 flex items-center justify-center text-xl">🌟</div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">Anonymous</span>
                  <span className="text-xs font-medium text-gray-400">5 hrs ago</span>
                </div>
              </div>
              <p className="text-gray-700 font-medium leading-relaxed text-[17px]">
                Honestly just wanted to drop by and say you&apos;re doing great. Drink some water! 💧
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
