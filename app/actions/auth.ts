"use server"

import { signIn, signOut } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { z } from "zod"

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Must contain at least one letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  gdcNumber: z
    .string()
    .regex(/^\d{5,8}$/, "GDC number must be 5-8 digits")
    .optional()
    .or(z.literal("")),
})

export type SignupState = {
  errors?: {
    name?: string[]
    email?: string[]
    password?: string[]
    gdcNumber?: string[]
  }
  message?: string
}

export async function signup(
  prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const validated = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    gdcNumber: formData.get("gdcNumber") || "",
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { name, email, password, gdcNumber } = validated.data

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { message: "An account with this email already exists." }
  }

  // Create user
  const hashedPassword = await bcrypt.hash(password, 10)
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      gdcNumber: gdcNumber || null,
    },
  })

  // Sign in the user
  await signIn("credentials", { email, password, redirect: false })
  redirect("/dashboard")
}

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

export type LoginState = {
  errors?: {
    email?: string[]
    password?: string[]
  }
  message?: string
}

export async function login(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const validated = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  try {
    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      redirect: false,
    })
  } catch (error) {
    return { message: "Invalid email or password." }
  }

  redirect("/dashboard")
}

export async function logout() {
  await signOut({ redirect: false })
  redirect("/")
}
