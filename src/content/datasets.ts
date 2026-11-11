import generated from "./datasets.generated.json";

type Generated = Record<string, { rows: number; columns: string[]; preview: Record<string, string | number | null>[] }>;
const gen = generated as Generated;

export type DatasetFile = { file: string; label: string; columns: Record<string, string> };
export type Dataset = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  useCase: string;
  files: DatasetFile[];
  exercises: { label: string; href: string }[];
  projects: { label: string; href: string }[];
};

export const datasets: Dataset[] = [
  {
    slug: "retail-sales",
    name: "Retail sales",
    summary: "Four related tables: customers, products, orders and order items.",
    description: "Eighteen months of orders for an office-supplies retailer. Every order belongs to a customer and contains one or more items, each pointing at a product. An order's amount equals the sum of its items. Some customers have never ordered and a few products have never sold, so joins behave as they do on real data.",
    useCase: "Revenue by region, month and category; customer value; products that do not sell. This is the database behind the SQL practice challenges.",
    files: [
      { file: "retail_customers.csv", label: "customers", columns: { customer_id: "Unique customer number", full_name: "Customer name", segment: "Consumer, Small Business or Enterprise", city: "Customer's city", signup_date: "Date the customer registered" } },
      { file: "retail_products.csv", label: "products", columns: { product_id: "Unique product number", product_name: "Product name", category: "Product category", unit_cost: "What one unit costs the retailer" } },
      { file: "retail_orders.csv", label: "orders", columns: { order_id: "Unique order number", customer_id: "Customer who placed the order (links to customers)", order_date: "Date of the order", region: "Sales region of the customer's city", status: "completed, refunded or cancelled", amount: "Order total: the sum of its items" } },
      { file: "retail_order_items.csv", label: "order_items", columns: { order_item_id: "Unique line number", order_id: "Order the line belongs to (links to orders)", product_id: "Product sold (links to products)", quantity: "Units sold on this line", unit_price: "Price charged per unit" } },
    ],
    exercises: [
      { label: "SQL practice challenges", href: "/practice/sql" },
      { label: "SQL lesson: INNER JOIN", href: "/paths/sql/inner-join" },
      { label: "SQL lesson: GROUP BY", href: "/paths/sql/group-by" },
    ],
    projects: [{ label: "Retail Sales Analysis", href: "/projects#retail-sales-analysis" }, { label: "Customer Segmentation", href: "/projects#customer-segmentation" }],
  },
  {
    slug: "ecommerce-orders",
    name: "E-commerce orders",
    summary: "One row per online order with channel, device, discount and delivery details.",
    description: "A year of orders from an online store selling to five countries. Each order records how the customer arrived, which device they used, what they paid and whether the order was delivered, returned or cancelled. Orders of 50 or more ship free.",
    useCase: "Compare acquisition channels, measure the effect of the free-delivery threshold, and find where returns concentrate.",
    files: [
      { file: "ecommerce_orders.csv", label: "ecommerce_orders", columns: { order_id: "Unique order number", order_date: "Date of the order", customer_id: "Customer number; repeats show returning customers", channel: "How the customer reached the site", device: "Mobile, Desktop or Tablet", category: "Main product category of the order", items: "Number of items", discount: "Discount applied", order_value: "Amount paid for goods after discount", shipping_fee: "Delivery charge; 0 when order_value is 50 or more", payment_method: "Card, Digital Wallet or Pay Later", status: "delivered, returned or cancelled", country: "Delivery country" } },
    ],
    exercises: [{ label: "Excel lesson: Sorting & Filtering", href: "/paths/excel/sorting-and-filtering" }, { label: "SQL lesson: CASE WHEN", href: "/paths/sql/case-when" }],
    projects: [{ label: "E-commerce Performance", href: "/projects#e-commerce-performance" }],
  },
  {
    slug: "customer-transactions",
    name: "Customer transactions",
    summary: "Purchases and refunds by customer, store and loyalty tier.",
    description: "A transaction log for 150 loyalty-scheme customers over eighteen months. Refunds appear as negative amounts. A small group of customers accounts for a large share of transactions, as in most real customer bases.",
    useCase: "Recency, frequency and monetary value scoring; spend by loyalty tier; refund rates.",
    files: [
      { file: "customer_transactions.csv", label: "customer_transactions", columns: { transaction_id: "Unique transaction number", customer_id: "Customer number", transaction_date: "Date of the transaction", type: "purchase or refund", amount: "Value; negative for refunds", store_id: "Store where it took place (1 to 12, matching store performance)", payment_method: "Card, Cash or Digital Wallet", loyalty_tier: "None, Silver, Gold or Platinum" } },
    ],
    exercises: [{ label: "SQL lesson: Window Functions", href: "/paths/sql/window-functions" }, { label: "SQL lesson: Date Functions", href: "/paths/sql/date-functions" }],
    projects: [{ label: "Customer Segmentation", href: "/projects#customer-segmentation" }],
  },
  {
    slug: "employee-information",
    name: "Employee information",
    summary: "300 employees with tenure, pay, overtime, satisfaction and whether they left.",
    description: "An HR extract for a 300-person company. Leavers are more common among people with heavy overtime, low satisfaction scores and one to two years' tenure, so the data rewards a proper attrition analysis.",
    useCase: "Attrition rate by department and tenure band; comparing leavers with stayers; pay analysis by level.",
    files: [
      { file: "employees.csv", label: "employees", columns: { employee_id: "Unique employee number", department: "Department", job_level: "Seniority from 1 (junior) to 4", hire_date: "Date joined", age: "Age in years", salary: "Annual salary", manager_id: "Employee number of the manager", overtime_hours: "Average overtime hours per month", years_since_promotion: "Whole years since last promotion", satisfaction: "Survey score from 1 (low) to 5 (high)", left_company: "Yes if the employee has left", exit_date: "Leaving date; blank for current staff" } },
    ],
    exercises: [{ label: "Excel lesson: Core Functions", href: "/paths/excel/core-functions" }, { label: "Excel lesson: Tables & Formatting", href: "/paths/excel/tables-and-formatting" }],
    projects: [{ label: "HR Employee Attrition", href: "/projects#hr-employee-attrition" }],
  },
  {
    slug: "marketing-campaigns",
    name: "Marketing campaigns",
    summary: "Spend and results for campaigns across five channels.",
    description: "One row per campaign and channel, following the funnel from impressions to clicks, sign-ups, orders and revenue. Channels differ in cost and conversion in the way they typically do: social is cheap to reach but converts weakly, referral is small but efficient.",
    useCase: "Click-through rate, cost per acquisition and return on ad spend by channel and campaign.",
    files: [
      { file: "marketing_campaigns.csv", label: "marketing_campaigns", columns: { campaign_id: "Unique campaign code", campaign_name: "Theme and channel", channel: "Email, Paid Search, Social, Display or Referral", start_date: "First day", end_date: "Last day", spend: "Amount spent", impressions: "Times the advert was shown", clicks: "Clicks through to the site", signups: "Accounts created", orders: "Orders attributed to the campaign", revenue: "Revenue from those orders" } },
    ],
    exercises: [{ label: "Excel lesson: Formulas & Cell References", href: "/paths/excel/formulas-and-cell-references" }, { label: "Workplace scenario: Campaign performance", href: "/explore#scenarios" }],
    projects: [{ label: "E-commerce Performance", href: "/projects#e-commerce-performance" }],
  },
  {
    slug: "financial-performance",
    name: "Financial performance",
    summary: "Monthly budget and actual figures by department and account.",
    description: "Eighteen months of budget against actual for revenue and five expense accounts across four departments. Revenue and cost of goods follow a seasonal pattern with a year-end peak.",
    useCase: "Variance analysis, gross margin by month, and finding the departments that overspend.",
    files: [
      { file: "financial_performance.csv", label: "financial_performance", columns: { month: "First day of the month", department: "Department responsible", account: "Revenue or an expense account", account_type: "Income or Expense", budget: "Planned amount", actual: "Amount recorded" } },
    ],
    exercises: [{ label: "Excel lesson: Core Functions", href: "/paths/excel/core-functions" }, { label: "SQL lesson: GROUP BY", href: "/paths/sql/group-by" }],
    projects: [{ label: "Retail Sales Analysis", href: "/projects#retail-sales-analysis" }],
  },
  {
    slug: "inventory-management",
    name: "Inventory management",
    summary: "Stock levels, reorder points and sales rates for 40 products.",
    description: "A stock snapshot for the same 40 products as the retail sales dataset. Average daily sales are calculated from the retail order items, so the two datasets agree. Some products are below their reorder point and some are heavily overstocked.",
    useCase: "Days of cover, reorder lists, overstock and cash tied up in slow stock.",
    files: [
      { file: "inventory.csv", label: "inventory", columns: { product_id: "Product number (matches retail products)", product_name: "Product name", category: "Product category", supplier: "Supplier name", unit_cost: "Cost per unit", stock_on_hand: "Units in stock", reorder_point: "Reorder when stock falls to this level", avg_daily_sales: "Average units sold per day", lead_time_days: "Days from ordering to delivery", last_restock_date: "Date of the last delivery" } },
    ],
    exercises: [{ label: "Excel lesson: Sorting & Filtering", href: "/paths/excel/sorting-and-filtering" }, { label: "SQL lesson: LEFT JOIN", href: "/paths/sql/left-join" }],
    projects: [{ label: "Inventory Analysis", href: "/projects#inventory-analysis" }],
  },
  {
    slug: "store-performance",
    name: "Store performance",
    summary: "Monthly revenue, transactions and targets for twelve stores.",
    description: "Twelve stores across four regions, one row per store per month for a year. Each store has a revenue target scaled to its size, and stores differ in how well they perform against it.",
    useCase: "Performance against target, revenue per square metre, and regional comparisons.",
    files: [
      { file: "store_performance.csv", label: "store_performance", columns: { store_id: "Store number (1 to 12)", store_name: "Store name", region: "North, South, East or West", size_sqm: "Floor area in square metres", opened_date: "Date the store opened", month: "First day of the month", revenue: "Revenue for the month", transactions: "Number of sales", staff_count: "Staff employed that month", revenue_target: "Revenue target for the month" } },
    ],
    exercises: [{ label: "Excel lesson: Tables & Formatting", href: "/paths/excel/tables-and-formatting" }, { label: "Workplace scenario: Declining retail sales", href: "/explore#scenarios" }],
    projects: [{ label: "Retail Sales Analysis", href: "/projects#retail-sales-analysis" }],
  },
];

export const fileInfo = (file: string) => gen[file];
export const datasetRows = (d: Dataset) => d.files.reduce((n, f) => n + gen[f.file].rows, 0);
