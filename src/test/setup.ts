import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach } from "vitest"

// 全局清理函数
afterEach(() => {
  cleanup()
})
