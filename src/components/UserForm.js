"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useUser } from "../context/UserContext"

const UserForm = ({ onSubmit, buttonText = "Continue" }) => {
  const { user, saveUser } = useUser()
  const [isEditing, setIsEditing] = useState(!user)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      email: user?.email || "",
    },
  })

  const handleFormSubmit = (data) => {
    saveUser(data)
    onSubmit(data)
  }

  if (user && !isEditing) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-3">Your Details</h3>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Name:</span> {user.name}
          </p>
          <p>
            <span className="font-medium">Phone:</span> {user.phone}
          </p>
          <p>
            <span className="font-medium">Address:</span> {user.address}
          </p>
          {user.email && (
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
          )}
        </div>
        <div className="flex space-x-3 mt-4">
          <button onClick={() => handleFormSubmit(user)} className="btn-primary flex-1">
            {buttonText}
          </button>
          <button onClick={() => setIsEditing(true)} className="btn-secondary">
            Edit
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <h3 className="font-semibold text-gray-800 mb-4">{user ? "Edit Your Details" : "Enter Your Details"}</h3>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          {...register("name", { required: "Name is required" })}
          className="input-field"
          placeholder="Enter your full name"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          {...register("phone", {
            required: "Phone number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Please enter a valid 10-digit phone number",
            },
          })}
          className="input-field"
          placeholder="Enter your phone number"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Address *
        </label>
        <textarea
          id="address"
          rows={3}
          {...register("address", { required: "Address is required" })}
          className="input-field resize-none"
          placeholder="Enter your complete address"
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email (Optional)
        </label>
        <input
          type="email"
          id="email"
          {...register("email", {
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Please enter a valid email address",
            },
          })}
          className="input-field"
          placeholder="Enter your email address"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div className="flex space-x-3">
        <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 disabled:opacity-50">
          {isSubmitting ? "Processing..." : buttonText}
        </button>
        {user && (
          <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default UserForm
