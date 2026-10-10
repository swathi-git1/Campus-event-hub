import { instance } from '@viz-js/viz'

const viz = await instance()

const test1 = `digraph G {
  User [shape=none, label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="4">
      <tr><td>User</td></tr>
      <hr/>
      <tr><td>attr</td></tr>
    </table>
  >];
}`
console.log('test1 status:', viz.render(test1).status)

const test2 = `digraph G {
  User [shape=none, label=<
    <table border="1" cellborder="0" cellspacing="0" cellpadding="4">
      <tr><td>User</td></tr>
      <tr><td border="1" sides="b"></td></tr>
      <tr><td>attr</td></tr>
    </table>
  >];
}`
console.log('test2 status:', viz.render(test2).status)
