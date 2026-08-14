module.exports = function eslintFormatter(results) {
  const lines = []
  let errorCount = 0
  let warningCount = 0

  results.forEach((result) => {
    const messages = result.messages || []
    if (messages.length === 0) return

    errorCount += result.errorCount || 0
    warningCount += result.warningCount || 0
    lines.push(result.filePath)

    messages.forEach((message) => {
      const level = message.severity === 2 ? 'error' : 'warning'
      const position = `${message.line || 0}:${message.column || 0}`
      const rule = message.ruleId ? ` ${message.ruleId}` : ''
      lines.push(`  ${position}  ${level}${rule}  ${message.message}`)
    })
  })

  if (lines.length > 0) {
    lines.push('')
  }

  lines.push(`${errorCount} errors, ${warningCount} warnings`)
  return `${lines.join('\n')}\n`
}
