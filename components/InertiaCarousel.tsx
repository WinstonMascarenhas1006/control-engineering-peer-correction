'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    gsap: any
    Draggable: any
  }
}

export default function InertiaCarousel() {
  const wrapperRef = useRef<HTMLElement>(null)
  const [gsapReady, setGsapReady] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Image URLs - using placeholder images that match the running animation theme
  const images = [
    'https://cdn.prod.website-files.com/67fea42b19018db93e3fe132/68014be6408118620403e9a0_run1.png',
    'https://cdn.prod.website-files.com/67fea42b19018db93e3fe132/68014be61c6cd36ab183dfcb_run2.png',
    'https://cdn.prod.website-files.com/67fea42b19018db93e3fe132/68014be69e11d4352fe75f35_run3.png',
    'https://cdn.prod.website-files.com/67fea42b19018db93e3fe132/68014be611882842b65d0cde_run4.png',
    'https://cdn.prod.website-files.com/67fea42b19018db93e3fe132/68014be65c4395c2a01bca17_run5.png',
    'https://cdn.prod.website-files.com/67fea42b19018db93e3fe132/68014be64f5f29ef20ed7ccc_run6.png',
  ]

  useEffect(() => {
    // Wait for both GSAP and Draggable to be loaded
    if (!gsapReady || !wrapperRef.current) {
      return
    }

    // Double check GSAP is actually available
    if (typeof window === 'undefined' || !window.gsap || !window.Draggable) {
      // Retry after a short delay
      const timer = setTimeout(() => {
        if (window.gsap && window.Draggable) {
          setGsapReady(true)
        }
      }, 100)
      return () => clearTimeout(timer)
    }

    const wrapper = wrapperRef.current
    const items = Array.from(wrapper.querySelectorAll('[data-inertia-item]')) as HTMLElement[]

    if (items.length === 0) return

    const gsap = window.gsap
    const Draggable = window.Draggable

    // Params
    let dragDistancePerRotation = 3000
    let itemWidth = items[0].offsetWidth
    let itemCount = items.length
    let radius = (itemWidth / (2 * Math.sin(Math.PI / itemCount))) * 0.85
    const perspective = 5000
    const proxy = document.createElement('div')
    const progressWrap = gsap.utils.wrap(0, 1)
    let startProgress = 0

    // Set up perspective on wrapper
    gsap.set(wrapper, {
      perspective: perspective,
      transformStyle: 'preserve-3d',
    })

    // Set up container
    const container = wrapper.querySelector('[data-inertia-container]') as HTMLElement
    if (container) {
      gsap.set(container, {
        transformStyle: 'preserve-3d',
      })
    }

    // Create spin animation
    const spin = gsap.fromTo(
      items,
      {
        rotationY: (i: number) => (i * 360) / items.length,
        z: -radius,
      },
      {
        rotationY: '-=360',
        duration: 20,
        ease: 'none',
        repeat: -1,
        transformOrigin: `50% 50% ${-radius}px`,
        z: -radius,
      }
    )

    // Set up proxy element
    proxy.style.position = 'absolute'
    proxy.style.width = '100%'
    proxy.style.height = '100%'
    proxy.style.top = '0'
    proxy.style.left = '0'
    proxy.style.zIndex = '1'
    proxy.style.cursor = 'grab'
    
    const firstChild = wrapper.firstElementChild as HTMLElement
    if (firstChild) {
      firstChild.appendChild(proxy)
    }

    // Create Draggable
    Draggable.create(proxy, {
      trigger: wrapper,
      type: 'x',
      inertia: true,
      onPress() {
        gsap.killTweensOf(spin)
        spin.timeScale(0)
        startProgress = spin.progress()
        proxy.style.cursor = 'grabbing'
      },
      onDrag: function() {
        updateRotation.call(this)
      },
      onThrowUpdate: function() {
        updateRotation.call(this)
      },
      onRelease() {
        proxy.style.cursor = 'grab'
        if (!this.tween || !this.tween.isActive()) {
          gsap.to(spin, { timeScale: 1, duration: 1 })
        }
      },
      onThrowComplete() {
        gsap.to(spin, { timeScale: 1, duration: 1 })
      },
    })

    function updateRotation(this: any) {
      let p = startProgress + (this.startX - this.x) / dragDistancePerRotation
      spin.progress(progressWrap(p))
    }

    function recalculatePositions() {
      itemWidth = items[0].offsetWidth
      itemCount = items.length
      radius = (itemWidth / (2 * Math.sin(Math.PI / itemCount))) * 0.8

      items.forEach((item, i) => {
        gsap.set(item, {
          rotationY: (i * 360) / itemCount,
          z: -radius,
        })
      })

      spin.vars.transformOrigin = `50% 50% ${-radius}px`
      spin.vars.z = -radius
      spin.invalidate()
    }

    window.addEventListener('resize', recalculatePositions)

    wrapper.addEventListener(
      'touchstart',
      (e) => {
        if (e.target === wrapper || e.target === proxy) {
          e.preventDefault()
        }
      },
      { passive: false }
    )

    // Mark as loaded
    setIsLoading(false)

    return () => {
      window.removeEventListener('resize', recalculatePositions)
      gsap.killTweensOf(spin)
      if (proxy.parentNode) {
        proxy.parentNode.removeChild(proxy)
      }
    }
  }, [gsapReady])

  const handleGsapReady = () => {
    // Check if both GSAP and Draggable are loaded
    if (typeof window !== 'undefined' && window.gsap && window.Draggable) {
      setGsapReady(true)
    }
  }

  // Also check on mount in case scripts loaded before component
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gsap && window.Draggable) {
      setGsapReady(true)
    }
  }, [])

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
        onLoad={() => {
          // Wait a bit for Draggable to potentially load
          setTimeout(handleGsapReady, 100)
        }}
        strategy="afterInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/Draggable.min.js"
        onLoad={handleGsapReady}
        strategy="afterInteractive"
      />

      <section
        id="inertia"
        ref={wrapperRef}
        data-animate="inertia"
        className="relative flex min-h-[50svh] flex-col items-center justify-center overflow-clip py-12 px-4 sm:py-16 md:py-24"
      >
        <div className="relative flex w-[94%] max-w-[1620px] min-w-[80vw] flex-col items-center justify-center gap-6 sm:min-w-[60vw] md:w-[90%] md:min-w-[40vw]">
          <div
            data-inertia-container
            className="relative flex h-[50svh] w-full flex-row flex-nowrap items-center justify-center overflow-clip sm:h-[55svh] md:h-[60svh]"
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-400 border-t-transparent"></div>
              </div>
            )}
            {images.map((src, index) => (
              <div
                key={index}
                data-inertia-item
                className={`absolute flex w-[70vw] items-center justify-center rounded-lg bg-gradient-to-br from-orange-400/95 to-orange-500/95 shadow-lg transition-opacity duration-300 sm:w-[60vw] md:w-[50vw] lg:w-[45vw] ${
                  isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                style={{ aspectRatio: '517/439' }}
              >
                <img
                  src={src}
                  alt={`Animation frame ${index + 1}`}
                  className="h-full w-auto rounded-lg object-contain"
                  loading={index < 2 ? 'eager' : 'lazy'}
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement
                    target.src = `https://via.placeholder.com/517x439/FFA500/FFFFFF?text=Frame+${index + 1}`
                  }}
                />
              </div>
            ))}
          </div>

          <div className="relative z-[5] mt-8 flex w-[94%] items-end justify-end sm:mt-12 sm:w-[80%] sm:justify-center">
            <div
              data-css="explainer"
              data-module="explainer"
              className={`flex w-full flex-col rounded-lg bg-amber-50/95 p-3 shadow-md transition-all duration-300 sm:max-w-md ${
                isExpanded ? 'shadow-lg' : ''
              }`}
            >
              <label className="relative mb-0 cursor-pointer pb-3 pt-1">
                <input
                  type="checkbox"
                  checked={isExpanded}
                  onChange={(e) => setIsExpanded(e.target.checked)}
                  className="absolute opacity-0"
                />
                <span className="relative z-[2] flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900">Feel the inertia</div>
                  <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-[#270f03]">
                    <div className="absolute h-[1px] w-1/2 bg-[#270f03]" />
                    <div
                      className={`absolute h-1/2 w-[1px] bg-[#270f03] transition-transform duration-300 ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                </span>
              </label>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div className="max-w-[25ch] py-2 text-sm text-gray-700">
                    <p>
                      Continue movement from a given speed, slow naturally to a stop. Perfect for adding physicality and flow to your interface.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

