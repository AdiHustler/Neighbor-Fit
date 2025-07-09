"use client"

import { useState, useEffect } from "react"

interface TypewriterProps {
  text?: string
  words?: string[]
  speed?: number
  deleteSpeed?: number
  delayBetweenWords?: number
  className?: string
}

export function Typewriter({
  text,
  words = [],
  speed = 80,
  deleteSpeed = 40,
  delayBetweenWords = 2000,
  className = "",
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  // Handle single text mode
  useEffect(() => {
    if (text && (!words || words.length === 0)) {
      setIsTyping(true)
      let i = 0
      const timer = setInterval(() => {
        if (i <= text.length) {
          setDisplayText(text.slice(0, i))
          i++
        } else {
          setIsTyping(false)
          clearInterval(timer)
        }
      }, speed)

      return () => clearInterval(timer)
    }
  }, [text, speed, words])

  // Handle words array mode
  useEffect(() => {
    if (!words || words.length === 0) return

    const currentWord = words[currentWordIndex] || ""
    setIsTyping(true)

    const timer = setTimeout(
      () => {
        if (isDeleting) {
          if (displayText.length > 0) {
            setDisplayText(currentWord.substring(0, displayText.length - 1))
          } else {
            setIsDeleting(false)
            setCurrentWordIndex((prev) => (prev + 1) % words.length)
          }
        } else {
          if (displayText.length < currentWord.length) {
            setDisplayText(currentWord.substring(0, displayText.length + 1))
          } else {
            setIsTyping(false)
            setTimeout(() => {
              setIsDeleting(true)
              setIsTyping(true)
            }, delayBetweenWords)
          }
        }
      },
      isDeleting ? deleteSpeed : speed,
    )

    return () => clearTimeout(timer)
  }, [displayText, currentWordIndex, isDeleting, words, speed, deleteSpeed, delayBetweenWords])

  return (
    <span className={`typewriter ${className}`} style={{ minHeight: "1.2em", display: "inline-block" }}>
      {displayText}
    </span>
  )
}
