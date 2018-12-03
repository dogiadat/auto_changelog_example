import { parseCommits, LOG_FORMAT } from './commits'
import { cmd } from './helpers'

function getCommits() {
  return cmd('git', ['log', '--shortstat', '--pretty=format:' + LOG_FORMAT]).then(parseCommits)
}

function getOrigin() {
   return cmd('git', ['remote', 'show', 'origin']).then(remote => {
     const url = 'https://' + remote.match(/github.com(:|\/)[^\/]+\/[^\.]+/)[0].replace(':', '/');
     return url
   })
 }

Promise.all([ getCommits()]).then(([ commits]) => {
  console.log(commits)
})
