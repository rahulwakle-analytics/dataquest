// Generates the synthetic sample datasets. Deterministic: the same seed always gives the same files.
// Run with `npm run datasets`. Output: public/datasets/*.csv and src/content/datasets.generated.json
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public/datasets");
mkdirSync(join(out, "check"), { recursive: true });

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const mk = (seed) => {
  const r = rng(seed);
  const int = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
  const pick = (arr) => arr[Math.floor(r() * arr.length)];
  const weighted = (pairs) => { let x = r() * pairs.reduce((s, p) => s + p[1], 0); for (const [v, w] of pairs) { if ((x -= w) < 0) return v; } return pairs[0][0]; };
  return { r, int, pick, weighted };
};
const money = (n) => Math.round(n * 100) / 100;
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) => new Date(d.getTime() + n * 86400000);
const D = (s) => new Date(s + "T00:00:00Z");
const daysBetween = (a, b) => Math.round((b - a) / 86400000);

const csv = (rows) => {
  const cols = Object.keys(rows[0]);
  const esc = (v) => (v === null || v === undefined ? "" : /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n") + "\n";
};
const manifest = {};
const write = (name, rows, dir = "") => {
  writeFileSync(join(out, dir, name), csv(rows));
  if (!dir) manifest[name] = { rows: rows.length, columns: Object.keys(rows[0]), preview: rows.slice(0, 6) };
};

const FIRST = ["Aarav", "Maya", "Liam", "Sofia", "Noah", "Zara", "Ethan", "Priya", "Lucas", "Amara", "Kenji", "Elena", "Omar", "Hannah", "Diego", "Mei", "Samuel", "Fatima", "Jonas", "Isla", "Ravi", "Chloe", "Tariq", "Nina", "Felix", "Leila", "Marcus", "Ines", "Kofi", "Greta"];
const LAST = ["Sharma", "Okafor", "Nguyen", "Rossi", "Kim", "Haddad", "Novak", "Silva", "Tanaka", "Mensah", "Petrov", "Garcia", "Larsen", "Chen", "Dubois", "Khan", "Murphy", "Costa", "Weber", "Abara"];
const CITY_REGION = [["Leeds", "North"], ["Newcastle", "North"], ["Manchester", "North"], ["Brighton", "South"], ["Southampton", "South"], ["Bristol", "South"], ["Norwich", "East"], ["Cambridge", "East"], ["Ipswich", "East"], ["Cardiff", "West"], ["Plymouth", "West"], ["Exeter", "West"]];
const PRODUCTS = [
  ["Electronics", ["Wireless Mouse", 24.99, 11], ["Mechanical Keyboard", 79.0, 41], ["USB-C Hub", 39.5, 17], ["Webcam HD", 59.0, 28], ["Noise-Cancelling Headset", 129.0, 70], ["Portable SSD 1TB", 99.0, 61], ["Monitor 24in", 149.0, 96], ["Laptop Stand", 34.0, 13], ["Bluetooth Speaker", 45.0, 22], ["Smart Plug", 18.5, 8]],
  ["Furniture", ["Office Chair", 189.0, 105], ["Standing Desk", 349.0, 210], ["Bookshelf", 89.0, 48], ["Filing Cabinet", 119.0, 66], ["Desk Lamp", 29.0, 12], ["Monitor Arm", 64.0, 30], ["Footrest", 27.5, 11], ["Whiteboard", 55.0, 26]],
  ["Office Supplies", ["Notebook A5", 4.5, 1.6], ["Gel Pens 10pk", 6.9, 2.4], ["Printer Paper 500", 5.5, 3.1], ["Sticky Notes", 3.2, 1.0], ["Stapler", 9.9, 4.2], ["Desk Organiser", 14.0, 6.0], ["Label Maker", 32.0, 17], ["Highlighters 6pk", 4.9, 1.7], ["Ring Binder", 3.8, 1.5], ["Whiteboard Markers", 7.5, 2.9]],
  ["Kitchen", ["Coffee Machine", 85.0, 47], ["Electric Kettle", 28.0, 13], ["Water Bottle", 12.0, 4.1], ["Lunch Box", 15.5, 6.2], ["Mug Set", 19.0, 7.8], ["Mini Fridge", 139.0, 92]],
  ["Accessories", ["Laptop Backpack", 49.0, 21], ["Phone Stand", 11.0, 3.5], ["Cable Organiser", 8.5, 2.6], ["Screen Cleaner Kit", 9.0, 2.9], ["Laptop Sleeve", 22.0, 9.0], ["Travel Adapter", 16.0, 6.5]],
];

function retail(seed, nCustomers, nOrders) {
  const { r, int, pick, weighted } = mk(seed);
  const customers = [];
  for (let i = 1; i <= nCustomers; i++) {
    const [city] = pick(CITY_REGION);
    customers.push({
      customer_id: i,
      full_name: `${pick(FIRST)} ${pick(LAST)}`,
      segment: weighted([["Consumer", 55], ["Small Business", 30], ["Enterprise", 15]]),
      city,
      signup_date: iso(addDays(D("2022-06-01"), int(0, 880))),
    });
  }
  const products = [];
  let pid = 100;
  for (const [category, ...items] of PRODUCTS) for (const [product_name, price, unit_cost] of items) products.push({ product_id: ++pid, product_name, category, unit_cost, _price: price });
  const neverOrdered = new Set(products.filter((_, i) => i % 13 === 5).map((p) => p.product_id));
  const sellable = products.filter((p) => !neverOrdered.has(p.product_id));
  const buyers = customers.filter((c) => c.customer_id % 9 !== 0); // some customers never order
  const regionOf = Object.fromEntries(CITY_REGION);
  const orders = [], items = [];
  let itemId = 0;
  for (let i = 1; i <= nOrders; i++) {
    const c = buyers[Math.floor(Math.pow(r(), 1.6) * buyers.length)];
    const earliest = D(c.signup_date) > D("2024-01-01") ? D(c.signup_date) : D("2024-01-01");
    const order_date = addDays(earliest, int(0, Math.max(1, daysBetween(earliest, D("2025-06-30")))));
    const n = weighted([[1, 40], [2, 30], [3, 18], [4, 8], [5, 4]]);
    const chosen = new Set();
    let amount = 0;
    while (chosen.size < n) chosen.add(pick(sellable));
    for (const p of chosen) {
      const quantity = c.segment === "Enterprise" ? int(2, 12) : weighted([[1, 55], [2, 25], [3, 12], [5, 8]]);
      const unit_price = money(p._price * (r() < 0.2 ? 0.9 : 1));
      amount += quantity * unit_price;
      items.push({ order_item_id: ++itemId, order_id: 5000 + i, product_id: p.product_id, quantity, unit_price });
    }
    orders.push({ order_id: 5000 + i, customer_id: c.customer_id, order_date: iso(order_date), region: regionOf[c.city], status: weighted([["completed", 82], ["refunded", 8], ["cancelled", 10]]), amount: money(amount) });
  }
  orders.sort((a, b) => a.order_date.localeCompare(b.order_date) || a.order_id - b.order_id);
  return { customers, products: products.map(({ _price, ...p }) => p), productsFull: products, orders, items };
}

const main = retail(11, 120, 600);
write("retail_customers.csv", main.customers);
write("retail_products.csv", main.products);
write("retail_orders.csv", main.orders);
write("retail_order_items.csv", main.items);
const alt = retail(47, 45, 160); // second data set used only to test learners' queries
write("retail_customers.csv", alt.customers, "check");
write("retail_products.csv", alt.products, "check");
write("retail_orders.csv", alt.orders, "check");
write("retail_order_items.csv", alt.items, "check");

{ // e-commerce orders
  const { r, int, pick, weighted } = mk(21);
  const rows = [];
  for (let i = 1; i <= 800; i++) {
    const channel = weighted([["Organic Search", 30], ["Paid Search", 22], ["Email", 18], ["Social", 16], ["Referral", 9], ["Direct", 5]]);
    const device = weighted([["Mobile", 58], ["Desktop", 34], ["Tablet", 8]]);
    const itemsN = weighted([[1, 45], [2, 28], [3, 15], [4, 8], [6, 4]]);
    const subtotal = money(itemsN * (18 + r() * 60) * (device === "Desktop" ? 1.15 : 1));
    const discount = channel === "Email" || r() < 0.15 ? money(subtotal * pick([0.05, 0.1, 0.15])) : 0;
    const order_value = money(subtotal - discount);
    rows.push({
      order_id: 20000 + i,
      order_date: iso(addDays(D("2024-07-01"), int(0, 364))),
      customer_id: int(1, 420),
      channel, device,
      category: weighted([["Fashion", 34], ["Home", 22], ["Beauty", 18], ["Electronics", 16], ["Sports", 10]]),
      items: itemsN, discount, order_value,
      shipping_fee: order_value >= 50 ? 0 : 4.99,
      payment_method: weighted([["Card", 62], ["Digital Wallet", 28], ["Pay Later", 10]]),
      status: weighted([["delivered", 86], ["returned", 9], ["cancelled", 5]]),
      country: weighted([["United Kingdom", 60], ["Ireland", 12], ["Germany", 12], ["France", 10], ["Netherlands", 6]]),
    });
  }
  rows.sort((a, b) => a.order_date.localeCompare(b.order_date) || a.order_id - b.order_id);
  write("ecommerce_orders.csv", rows);
}
{ // customer transactions
  const { r, int, pick, weighted } = mk(31);
  const tiers = {}; const rows = [];
  for (let c = 1; c <= 150; c++) tiers[c] = weighted([["None", 45], ["Silver", 30], ["Gold", 18], ["Platinum", 7]]);
  for (let i = 1; i <= 1000; i++) {
    const customer_id = 1 + Math.floor(Math.pow(r(), 1.8) * 150);
    const tier = tiers[customer_id];
    const type = r() < 0.07 ? "refund" : "purchase";
    const base = (12 + r() * 90) * ({ None: 1, Silver: 1.2, Gold: 1.5, Platinum: 2 }[tier]);
    rows.push({ transaction_id: 70000 + i, customer_id, transaction_date: iso(addDays(D("2024-01-01"), int(0, 545))), type, amount: money(type === "refund" ? -base : base), store_id: int(1, 12), payment_method: pick(["Card", "Card", "Cash", "Digital Wallet"]), loyalty_tier: tier });
  }
  rows.sort((a, b) => a.transaction_date.localeCompare(b.transaction_date) || a.transaction_id - b.transaction_id);
  write("customer_transactions.csv", rows);
}
{ // employees
  const { r, int, pick, weighted } = mk(41);
  const depts = [["Sales", 34000], ["Engineering", 52000], ["Customer Support", 27000], ["Marketing", 36000], ["Finance", 41000], ["Operations", 30000], ["HR", 33000]];
  const rows = [];
  for (let i = 1; i <= 300; i++) {
    const [department, base] = pick(depts);
    const job_level = weighted([[1, 38], [2, 32], [3, 20], [4, 10]]);
    const hire = addDays(D("2017-01-01"), int(0, 3000));
    const tenureYears = daysBetween(hire, D("2025-06-30")) / 365;
    const overtime_hours = Math.max(0, Math.round((department === "Customer Support" || department === "Sales" ? 9 : 4) + (r() - 0.4) * 14));
    const satisfaction = weighted([[1, 8], [2, 15], [3, 32], [4, 30], [5, 15]]);
    const years_since_promotion = Math.min(Math.floor(tenureYears), int(0, 6));
    let risk = 0.06 + (overtime_hours > 10 ? 0.16 : 0) + (satisfaction <= 2 ? 0.2 : 0) + (tenureYears >= 1 && tenureYears < 2.5 ? 0.12 : 0) + (years_since_promotion >= 4 ? 0.08 : 0);
    if (tenureYears < 0.5) risk = 0.02;
    const left = r() < risk;
    const exit = left ? addDays(hire, int(Math.min(150, Math.floor(tenureYears * 365) - 1), Math.max(151, Math.floor(tenureYears * 365)))) : null;
    rows.push({ employee_id: 1000 + i, department, job_level, hire_date: iso(hire), age: int(22, 58), salary: Math.round((base * (1 + (job_level - 1) * 0.28) * (0.9 + r() * 0.25)) / 100) * 100, manager_id: 1000 + int(1, 24), overtime_hours, years_since_promotion, satisfaction, left_company: left ? "Yes" : "No", exit_date: exit ? iso(exit) : "" });
  }
  write("employees.csv", rows);
}
{ // marketing campaigns
  const { r, int, pick } = mk(51);
  const ch = { Email: [0.6, 0.035, 0.09, 0.3], "Paid Search": [9, 0.045, 0.07, 0.22], Social: [6, 0.012, 0.04, 0.12], Display: [3.5, 0.004, 0.03, 0.1], Referral: [2, 0.06, 0.12, 0.35] }; // cpm, ctr, signup rate, order rate
  const themes = ["Spring Sale", "Back to Work", "Summer Launch", "Loyalty Week", "Autumn Refresh", "Black Friday", "Winter Clearance", "New Customer Offer"];
  const rows = []; let id = 0;
  for (const theme of themes) for (const channel of Object.keys(ch)) {
    if (r() < 0.2) continue;
    const [cpm, ctr, sr, or] = ch[channel];
    const start = addDays(D("2024-03-01"), themes.indexOf(theme) * 44 + int(0, 6));
    const impressions = int(40, 900) * 1000;
    const clicks = Math.round(impressions * ctr * (0.7 + r() * 0.6));
    const signups = Math.round(clicks * sr * (0.7 + r() * 0.6));
    const orders = Math.round(signups * or * (0.7 + r() * 0.6));
    rows.push({ campaign_id: `CMP-${String(++id).padStart(3, "0")}`, campaign_name: `${theme} - ${channel}`, channel, start_date: iso(start), end_date: iso(addDays(start, pick([7, 14, 14, 21]))), spend: money((impressions / 1000) * cpm * (0.85 + r() * 0.3)), impressions, clicks, signups, orders, revenue: money(orders * (38 + r() * 30)) });
  }
  write("marketing_campaigns.csv", rows);
}
{ // financial performance
  const { r } = mk(61);
  const depts = { Sales: 1, Marketing: 0.5, Operations: 0.8, Technology: 0.7 };
  const accounts = [["Revenue", 420000], ["Cost of Goods Sold", 230000], ["Salaries", 90000], ["Marketing Spend", 28000], ["Software and Tools", 9000], ["Travel", 6000]];
  const rows = [];
  for (let m = 0; m < 18; m++) {
    const month = iso(new Date(Date.UTC(2024, m, 1)));
    const season = 1 + 0.18 * Math.sin(((m % 12) - 2) / 12 * Math.PI * 2) + (m % 12 === 10 || m % 12 === 11 ? 0.2 : 0);
    for (const [account, base] of accounts) for (const [department, w] of Object.entries(depts)) {
      if (account === "Revenue" && department !== "Sales") continue;
      if (account === "Cost of Goods Sold" && department !== "Operations") continue;
      if (account === "Marketing Spend" && department !== "Marketing") continue;
      const scale = account === "Revenue" || account === "Cost of Goods Sold" ? season : 1 + m * 0.004;
      const budget = Math.round((base * (["Revenue", "Cost of Goods Sold", "Marketing Spend"].includes(account) ? 1 : w) * scale) / 100) * 100;
      rows.push({ month, department, account, account_type: account === "Revenue" ? "Income" : "Expense", budget, actual: Math.round(budget * (0.9 + r() * 0.22)) });
    }
  }
  write("financial_performance.csv", rows);
}
{ // inventory, keyed to the retail product catalogue
  const { r, int, pick } = mk(71);
  const suppliers = ["Northfield Supply", "Harbour Trading", "Kestrel Wholesale", "Linden & Co", "Atlas Distribution"];
  const sold = {};
  for (const it of main.items) sold[it.product_id] = (sold[it.product_id] ?? 0) + it.quantity;
  const rows = main.productsFull.map((p) => {
    const avg_daily_sales = Math.round(((sold[p.product_id] ?? 0) / 547) * 100) / 100;
    const lead_time_days = pick([5, 7, 10, 14, 21]);
    const reorder_point = Math.ceil(avg_daily_sales * lead_time_days * 1.5) + 2;
    const mode = r();
    const stock_on_hand = mode < 0.2 ? int(0, Math.max(1, reorder_point - 1)) : mode < 0.75 ? int(reorder_point, reorder_point * 4 + 10) : int(120, 400);
    return { product_id: p.product_id, product_name: p.product_name, category: p.category, supplier: pick(suppliers), unit_cost: p.unit_cost, stock_on_hand, reorder_point, avg_daily_sales, lead_time_days, last_restock_date: iso(addDays(D("2025-03-01"), int(0, 110))) };
  });
  write("inventory.csv", rows);
}
{ // store performance
  const { r, int } = mk(81);
  const stores = CITY_REGION.map(([city, region], i) => ({ store_id: i + 1, store_name: `${city} Central`, region, size_sqm: int(18, 60) * 10, opened: iso(addDays(D("2012-01-01"), int(0, 4000))), staff: int(6, 22) }));
  const rows = [];
  for (const s of stores) {
    const strength = 0.8 + r() * 0.5;
    for (let m = 0; m < 12; m++) {
      const season = 1 + 0.15 * Math.sin((m - 2) / 12 * Math.PI * 2) + (m >= 10 ? 0.25 : 0);
      const target = Math.round((s.size_sqm * 210 * season) / 100) * 100;
      const transactions = Math.round(s.size_sqm * 7.5 * season * strength * (0.9 + r() * 0.2));
      rows.push({ store_id: s.store_id, store_name: s.store_name, region: s.region, size_sqm: s.size_sqm, opened_date: s.opened, month: iso(new Date(Date.UTC(2024, m, 1))), revenue: money(transactions * (24 + r() * 8)), transactions, staff_count: s.staff + (m >= 10 ? 2 : 0), revenue_target: target });
    }
  }
  write("store_performance.csv", rows);
}
function hrDatabase(seed, nDepartments, nEmployees) {
  const { r, int, pick, weighted } = mk(seed);
  const deptNames = ["Engineering", "Sales", "Marketing", "Customer Support", "Finance", "Human Resources", "Operations", "Product", "Legal", "IT"];
  const locations = ["London", "Manchester", "Remote", "Dublin", "Berlin"];
  const departments = [];
  for (let i = 1; i <= nDepartments; i++) {
    departments.push({ department_id: i, department_name: deptNames[i - 1], location: pick(locations), annual_budget: int(180, 950) * 1000 });
  }
  const employees = [];
  const managers = [];
  for (let i = 1; i <= nEmployees; i++) {
    const department_id = int(1, nDepartments);
    const job_level = weighted([["Junior", 34], ["Mid", 36], ["Senior", 20], ["Lead", 7], ["Manager", 3]]);
    const hire_date = addDays(D("2018-01-01"), int(0, 2800));
    const tenureYears = daysBetween(hire_date, D("2025-09-30")) / 365;
    const baseSalary = { Junior: 32000, Mid: 44000, Senior: 61000, Lead: 76000, Manager: 92000 }[job_level];
    const salary = Math.round((baseSalary * (0.9 + r() * 0.3) * (1 + Math.min(tenureYears, 6) * 0.015)) / 100) * 100;
    const performance_rating = weighted([[1, 4], [2, 10], [3, 42], [4, 32], [5, 12]]);
    const resigned = r() < (performance_rating <= 2 ? 0.22 : 0.07);
    const status = resigned ? "Resigned" : "Active";
    const termination_date = resigned ? iso(addDays(hire_date, int(Math.floor(tenureYears * 200), Math.floor(tenureYears * 360) + 30))) : "";
    employees.push({ employee_id: 2000 + i, full_name: `${pick(FIRST)} ${pick(LAST)}`, department_id, job_title: `${job_level} Analyst`, job_level, manager_id: "", hire_date: iso(hire_date), salary, performance_rating, status, termination_date });
    if (job_level === "Manager" || job_level === "Lead") managers.push(2000 + i);
  }
  // The company's most senior manager (lowest employee_id among Managers) sits at the top of the
  // chain and reports to no one, so `manager_id` is genuinely NULL for at least one real row.
  const managerLevelIds = employees.filter((e) => e.job_level === "Manager").map((e) => e.employee_id);
  const ceoId = managerLevelIds.length ? Math.min(...managerLevelIds) : managers.length ? Math.min(...managers) : employees[0].employee_id;
  for (const e of employees) {
    if (e.employee_id === ceoId) {
      e.manager_id = "";
      continue;
    }
    const sameDept = employees.filter((m) => m.department_id === e.department_id && managers.includes(m.employee_id) && m.employee_id !== e.employee_id).map((m) => m.employee_id);
    const pool = sameDept.length ? sameDept : managers.filter((m) => m !== e.employee_id);
    e.manager_id = pool.length ? pick(pool) : "";
  }
  employees.sort((a, b) => a.employee_id - b.employee_id);
  return { departments, employees };
}

const hrMain = hrDatabase(91, 7, 140);
write("hr_departments.csv", hrMain.departments);
write("hr_employees.csv", hrMain.employees);
const hrAlt = hrDatabase(97, 5, 60); // second, differently-sized data set used only to test learners' queries
write("hr_departments.csv", hrAlt.departments, "check");
write("hr_employees.csv", hrAlt.employees, "check");

writeFileSync(join(root, "src/content/datasets.generated.json"), JSON.stringify(manifest, null, 1) + "\n");
console.log(Object.entries(manifest).map(([k, v]) => `${k}: ${v.rows} rows`).join("\n"));
