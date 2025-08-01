export function toTitleCase(text) {
  return text
    .toLowerCase() // make everything lowercase first
    .split(' ')     // split by space into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize first letter
    .join(' ');     // join them back into a string
}