module.exports = function(dateString) {
  const date = new Date(dateString)

  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ]

  return days[date.getDay()]
}