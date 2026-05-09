import { useEffect, useState } from 'react'

export function useTypewriter(
  text: string,
  speed = 55,
  startDelay = 0,
): [string, boolean] {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let index = 0
    let holdTimer: ReturnType<typeof setTimeout>
    let ticker: ReturnType<typeof setInterval>

    holdTimer = setTimeout(() => {
      ticker = setInterval(() => {
        index++
        setDisplayed(text.slice(0, index))
        if (index >= text.length) {
          clearInterval(ticker)
          setDone(true)
        }
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(holdTimer)
      clearInterval(ticker)
    }
  }, [text, speed, startDelay])

  return [displayed, done]
}
