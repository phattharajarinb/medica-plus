function App() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Doctor Booking Dashboard</h1>
        <p style={styles.subtitle}>Welcome back 👋</p>

        <div style={styles.grid}>
          <div style={styles.box}>
            <h3>Appointments</h3>
            <p>12 bookings today</p>
          </div>

          <div style={styles.box}>
            <h3>Doctors</h3>
            <p>8 available</p>
          </div>

          <div style={styles.box}>
            <h3>Patients</h3>
            <p>24 registered</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    height: "100vh",
    background: "#f0f8ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "sans-serif"
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    width: "500px",
    textAlign: "center"
  },
  title: {
    color: "#2196f3"
  },
  subtitle: {
    color: "#888"
  },
  grid: {
    display: "flex",
    gap: "15px",
    marginTop: "20px"
  },
  box: {
    flex: 1,
    background: "#e3f2fd",
    padding: "20px",
    borderRadius: "12px"
  }
}

export default App