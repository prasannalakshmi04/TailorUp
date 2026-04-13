import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [orders, setOrders] = useState(0);      
  const [revenue, setRevenue] = useState(0);   

  // Fetch inventory
  const getItems = async () => {
    const res = await fetch("https://tailorup.onrender.com/api/inventory");
    const data = await res.json();
    setItems(data);
  };

  // Fetch stats
  const getStats = async () => {
    const res = await fetch("https://tailorup.onrender.com/api/billing/stats");
    const data = await res.json();
    setOrders(data.totalOrders);
    setRevenue(data.totalRevenue);
  };

  useEffect(() => {
    getItems();
    getStats();
  }, []);

  // Create bill
  const createBill = async () => {
    await fetch("https://tailorup.onrender.com/api/billing/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: [{ name: selectedItem, quantity: Number(quantity) }]
      })
    });

    getItems();   // refresh stock
    getStats();   // refresh analytics
  };

  const chartData = {
  labels: ["Orders", "Revenue"],
  datasets: [
    {
      label: "Business Stats",
      data: [orders, revenue],
      backgroundColor: ["#4CAF50", "#2196F3"]
    }
  ]
};

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Tailor Shop Dashboard</h1>

  <div style={styles.row}>

      <div style={styles.card}>
        <h2>Add / Use Item</h2>

        <select
          style={styles.input}
          onChange={(e) => setSelectedItem(e.target.value)}
        >
          <option>Select Item</option>
          {items.map((item, index) => (
            <option key={index} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>

        <input
          style={styles.input}
          placeholder="Quantity"
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button style={styles.button} onClick={createBill}>
          Create Bill
        </button>
      </div>

      <div style={styles.card}>
        <h2>Current Stock</h2>

        {items.map((item, index) => (
          <div key={index} style={styles.item}>
            {item.name} — {item.quantity}
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <h2>Analytics</h2>
        <p>Orders: {orders}</p>
        <p>Revenue: ₹{revenue}</p>
      </div>
      <div style={styles.card}>
        <h2>Analytics Chart</h2>
        <Bar data={chartData} />
      </div>
    </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "30px",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh"
  },
  title: {
    marginBottom: "30px"
  },
  row: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap"
  },
  card: {
    background: "white",
    padding: "20px",
    width: "300px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  input: {
    width: "90%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  item: {
    padding: "5px",
    borderBottom: "1px solid #eee"
  }
};

export default App;