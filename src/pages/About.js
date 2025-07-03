"use client"

import { useState } from "react"
import { Award, Users, Clock, Heart } from "lucide-react"

const About = () => {
  const [galleryImages] = useState([
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">About WoodCraft</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Crafting beautiful wooden furniture with passion and precision since 2010. We believe every piece tells a
          story and every home deserves furniture that lasts a lifetime.
        </p>
      </div>

      {/* Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              WoodCraft began as a small family workshop with a simple mission: to create beautiful, durable wooden
              furniture that brings warmth and character to every home. What started as a passion project has grown into
              a trusted name in quality craftsmanship.
            </p>
            <p>
              Our founder, inspired by traditional woodworking techniques passed down through generations, combined
              time-honored methods with modern design sensibilities. Today, we continue to honor that legacy while
              embracing innovation and sustainability.
            </p>
            <p>
              Every piece we create is a testament to our commitment to excellence. From selecting the finest materials
              to the final finishing touches, we ensure that each item meets our exacting standards and exceeds your
              expectations.
            </p>
          </div>
        </div>

        <div className="relative">
          <img
            src="/placeholder.svg?height=400&width=500"
            alt="Our workshop"
            className="w-full h-80 object-cover rounded-lg shadow-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality</h3>
            <p className="text-gray-600">
              We never compromise on quality. Every piece is crafted with attention to detail and built to last.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Passion</h3>
            <p className="text-gray-600">
              Our love for woodworking drives us to create furniture that brings joy to your home.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Community</h3>
            <p className="text-gray-600">
              We believe in supporting our local community and building lasting relationships.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Heritage</h3>
            <p className="text-gray-600">
              We honor traditional craftsmanship while embracing modern innovation and design.
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Our Workshop</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg">
              <img
                src={image || "/placeholder.svg"}
                alt={`Workshop ${index + 1}`}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <img
              src="/placeholder.svg?height=200&width=200"
              alt="John Smith"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-1">John Smith</h3>
            <p className="text-amber-600 mb-2">Founder & Master Craftsman</p>
            <p className="text-gray-600 text-sm">
              With over 25 years of experience, John leads our team with passion and expertise.
            </p>
          </div>

          <div className="text-center">
            <img
              src="/placeholder.svg?height=200&width=200"
              alt="Sarah Johnson"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-1">Sarah Johnson</h3>
            <p className="text-amber-600 mb-2">Design Director</p>
            <p className="text-gray-600 text-sm">
              Sarah brings creativity and modern design sensibilities to every project.
            </p>
          </div>

          <div className="text-center">
            <img
              src="/placeholder.svg?height=200&width=200"
              alt="Mike Wilson"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-1">Mike Wilson</h3>
            <p className="text-amber-600 mb-2">Production Manager</p>
            <p className="text-gray-600 text-sm">
              Mike ensures every piece meets our high standards of quality and craftsmanship.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="bg-amber-50 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          To create exceptional wooden furniture that enhances your living spaces, reflects your personal style, and
          stands the test of time. We are committed to sustainable practices, superior craftsmanship, and customer
          satisfaction in everything we do.
        </p>
      </div>
    </div>
  )
}

export default About
