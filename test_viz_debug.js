import fs from 'fs'
import { instance } from '@viz-js/viz'

const viz = await instance()
const code = fs.readFileSync('generate_diagrams_v2.js', 'utf8')
const start = code.indexOf('const classDiagramDot = `') + 'const classDiagramDot = `'.length
const end = code.indexOf('`', start)
const dotStr = code.slice(start, end)

const res = viz.render(dotStr, { format: 'svg' })
console.log('classDiagramDot status:', res.status)
if (res.errors && res.errors.length) {
  console.log('Errors:', res.errors)
}

// Let's test individual nodes
const nodeBlocks = dotStr.split(/\n\s*(?=[A-Za-z0-9_]+ \[)/)
console.log('Found blocks:', nodeBlocks.length)

let accumulated = nodeBlocks[0]
for (let i = 1; i < nodeBlocks.length; i++) {
  const block = nodeBlocks[i]
  const testDot = accumulated + '\n' + block + '\n}'
  const r = viz.render(testDot, { format: 'svg' })
  if (r.status === 'failure') {
    console.log(`Failed at block ${i}:`)
    console.log(block.slice(0, 100))
    console.log('Full block:\n', block)
    break
  }
  accumulated += '\n' + block
}
