// src/utils/date.js
export function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(date).toLocaleDateString(undefined, options)
  }
  