import { expect, test } from "vitest"
import { sum } from "./sum" // 如果 sum 函数定义在 sum.ts 文件中，去掉 .js 后缀

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3)
})
