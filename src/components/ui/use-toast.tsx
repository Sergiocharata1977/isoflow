import { useState, useEffect } from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

// Tipos de acciones (por si quieres expandir a un reducer más adelante)
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

type Toast = {
  id: string
  title?: string
  description?: string
  duration?: number
  dismiss: () => void
  [key: string]: any // para propiedades adicionales si las necesitas
}

type ToastState = {
  toasts: Toast[]
}

type ToastInput = Omit<Partial<Toast>, "id" | "dismiss">

let count = 0

function generateId(): string {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

export function useToast() {
  const [state, setState] = useState<ToastState>({
    toasts: [],
  })

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = []

    state.toasts.forEach((toast) => {
      if (toast.duration === Infinity) return

      const timeout = setTimeout(() => {
        toast.dismiss()
      }, toast.duration ?? 5000)

      timeouts.push(timeout)
    })

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [state.toasts])

  function toast({ ...props }: ToastInput) {
    const id = generateId()

    const update = (updatedProps: Partial<Toast>) =>
      setState((state) => ({
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === id ? { ...t, ...updatedProps } : t
        ),
      }))

    const dismiss = () =>
      setState((state) => ({
        ...state,
        toasts: state.toasts.filter((t) => t.id !== id),
      }))

    setState((state) => ({
      ...state,
      toasts: [
        { ...props, id, dismiss },
        ...state.toasts,
      ].slice(0, TOAST_LIMIT),
    }))

    return {
      id,
      dismiss,
      update,
    }
  }

  return {
    toast,
    toasts: state.toasts,
  }
}
