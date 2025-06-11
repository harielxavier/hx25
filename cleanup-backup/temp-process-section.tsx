      {/* Process Section */}
      <section ref={processRef} className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 transform transition-all duration-1000 ease-out"
               style={{ 
                 opacity: processInView ? 1 : 0, 
                 transform: processInView ? 'translateY(0)' : 'translateY(30px)'
               }}>
            <p className="text-sm uppercase tracking-[0.3em] mb-4 text-black/70 relative inline-block">
              The Journey
            </p>
            <h2 className="text-5xl md:text-6xl font-serif">
              Your love story deserves to be told 
              <span className="block mt-2 text-black/80">with artistry and grace</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                title: "The First Connection",
                description: "Share your dreams and vision over a heartfelt conversation, where your story begins to unfold.",
                icon: "✨"
              },
              {
                title: "Crafting Your Journey",
                description: "Together, we'll design an artful approach to capturing every precious moment of your celebration.",
                icon: "🎨"
              },
              {
                title: "Your Celebration",
                description: "Immerse yourself in the joy while we artfully document each meaningful moment of your love story.",
                icon: "📸"
              },
              {
                title: "Timeless Art",
                description: "Your legacy of love, transformed into an exquisite collection of artful memories to cherish forever.",
                icon: "♾️"
              }
            ].map((step, index) => (
              <div 
                key={index}
                className={`text-center relative group cursor-default`}
                style={{ 
                  opacity: processInView ? 1 : 0,
                  transform: processInView ? 'translateY(0)' : 'translateY(40px)',
                  transition: `all 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${index * 150}ms`
                }}
              >
                {/* Step number */}
                <div className="relative inline-block mb-6">
                  <p className="text-6xl font-light text-black/20 relative z-10 group-hover:text-black/40 transition-colors duration-500">
                    0{index + 1}
                  </p>
                </div>
                
                <h3 className="text-xl mb-3 font-medium group-hover:text-black transition-colors duration-300">{step.title}</h3>
                <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 max-w-xs mx-auto">
                  {step.description}
                </p>
                
                {/* Subtle hover effect indicator */}
                <div 
                  className="w-10 h-0.5 bg-black/30 mx-auto mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
