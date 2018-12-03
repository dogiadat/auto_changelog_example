const COMMIT_SEPARATOR = '===COMMIT_SEPARATOR==='
const MESSAGE_SEPARATOR = '---MESSAGE_SEPARATOR---'

export const LOG_FORMAT = COMMIT_SEPARATOR + '%H%n%D%n%aI%n%an%n%ae%n%B' + MESSAGE_SEPARATOR

const MATCH_COMMIT = /(.*)\n(.*)\n(.*)\n(.*)\n(.*)\n([\S\s]+)/
const MATCH_STATS = /(\d+) files? changed(?:, (\d+) insertions?...)?(?:, (\d+) deletions?...)?/
const TAG_PREFIX = 'tag: '

export function parseCommits (string) {
  return string.split(COMMIT_SEPARATOR).slice(1).map(commit => {
    const [, hash, refs, date, author, email, tail] = commit.match(MATCH_COMMIT)
    const [message, stats] = tail.split(MESSAGE_SEPARATOR)
    return {
      hash,
      tag: refs ? tagFromRefs(refs) : null,
      author,
      email,
      date,
      subject: getSubject(message),
      message: message.trim(),
      ...parseStats(stats.trim())
    }
  })
}

 function tagFromRefs (refs) {
   const valid = refs.split(', ').find(ref => ref.indexOf(TAG_PREFIX) === 0)
   return valid ? valid.replace(TAG_PREFIX, '') : null
 }

 function parseStats (stats) {
   if (!stats) return {}
   const [, files, insertions, deletions] = stats.match(MATCH_STATS)
   return {
     files: parseInt(files || 0, 10),
     insertions: parseInt(insertions || 0, 10),
     deletions: parseInt(deletions || 0, 10)
   }
 }

 function getSubject (message) {
   return message.match(/[^\n]+/)[0]
 }
