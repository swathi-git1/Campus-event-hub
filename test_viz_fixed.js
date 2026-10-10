import { instance } from '@viz-js/viz'

const viz = await instance()

const testFixed = `digraph G {
  User [shape=none, label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="4">
      <tr><td bgcolor="#E6EEF8"><b>User</b></td></tr>
      <hr/>
      <tr><td align="left">
        - id : String<br/>
        - name : String
      </td></tr>
      <hr/>
      <tr><td align="left">
        + findUserByEmail() : User
      </td></tr>
    </table>
  >];
}`

const res = viz.render(testFixed, { format: 'svg' })
console.log('Fixed status:', res.status)
console.log('Fixed errors:', res.errors)
