import { spawn } from 'child_process'
import { parseCommits, LOG_FORMAT } from './commits'


function cmd (cmd, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, options)
    let data = ''

    child.stdout.on('data', buffer => data += buffer.toString())
    child.stdout.on('end', () => resolve(data))
    child.on('error', reject)
  })
}

function getCommits () {
  return cmd('git', ['log', '--shortstat', '--pretty=format:' + LOG_FORMAT]).then(parseCommits)
}

Promise.all([ getCommits()]).then(([ commits]) => {
  console.log(commits)
})
