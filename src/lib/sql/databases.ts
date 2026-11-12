/**
 * Registry of SQL Playground databases. Each database is a small set of realistic, related
 * tables with primary/foreign keys, loaded from its own CSV files (main + a differently-sized
 * "check" variant used to catch hardcoded answers — see lib/sql/engine.ts).
 */
export type DatabaseId = "retail" | "hr";

export type ColumnInfo = { name: string; type: "integer" | "decimal" | "text" | "date" | "boolean"; description: string; key?: "PK" | "FK" };
export type TableInfo = { name: string; description: string; columns: ColumnInfo[] };
export type DatabaseInfo = {
  id: DatabaseId;
  name: string;
  description: string;
  /** CSV file prefix, e.g. "retail" for retail_customers.csv. */
  prefix: string;
  tables: TableInfo[];
  /** Human-readable foreign-key relationships, for the schema viewer. */
  relationships: string[];
};

export const DATABASES: Record<DatabaseId, DatabaseInfo> = {
  retail: {
    id: "retail",
    name: "Retail database",
    description: "A multi-channel retailer's customers, product catalogue and orders.",
    prefix: "retail",
    relationships: ["orders.customer_id → customers.customer_id", "order_items.order_id → orders.order_id", "order_items.product_id → products.product_id"],
    tables: [
      {
        name: "customers",
        description: "One row per customer.",
        columns: [
          { name: "customer_id", type: "integer", description: "Unique customer identifier.", key: "PK" },
          { name: "full_name", type: "text", description: "Customer name." },
          { name: "segment", type: "text", description: "Consumer, Small Business or Enterprise." },
          { name: "city", type: "text", description: "Billing city." },
          { name: "signup_date", type: "date", description: "Date the account was created." },
        ],
      },
      {
        name: "products",
        description: "The product catalogue.",
        columns: [
          { name: "product_id", type: "integer", description: "Unique product identifier.", key: "PK" },
          { name: "product_name", type: "text", description: "Product name." },
          { name: "category", type: "text", description: "Product category." },
          { name: "unit_cost", type: "decimal", description: "What the product costs the business." },
        ],
      },
      {
        name: "orders",
        description: "One row per order.",
        columns: [
          { name: "order_id", type: "integer", description: "Unique order identifier.", key: "PK" },
          { name: "customer_id", type: "integer", description: "The customer who placed the order.", key: "FK" },
          { name: "order_date", type: "date", description: "Date the order was placed." },
          { name: "region", type: "text", description: "North, South, East or West." },
          { name: "status", type: "text", description: "completed, refunded or cancelled." },
          { name: "amount", type: "decimal", description: "Order total." },
        ],
      },
      {
        name: "order_items",
        description: "One row per product line within an order.",
        columns: [
          { name: "order_item_id", type: "integer", description: "Unique line identifier.", key: "PK" },
          { name: "order_id", type: "integer", description: "The order this line belongs to.", key: "FK" },
          { name: "product_id", type: "integer", description: "The product on this line.", key: "FK" },
          { name: "quantity", type: "integer", description: "Units ordered." },
          { name: "unit_price", type: "decimal", description: "Price charged per unit on this line." },
        ],
      },
    ],
  },
  hr: {
    id: "hr",
    name: "HR database",
    description: "An HR analytics database: departments and the employees who work in them.",
    prefix: "hr",
    relationships: ["employees.department_id → departments.department_id", "employees.manager_id → employees.employee_id (self-referencing)"],
    tables: [
      {
        name: "departments",
        description: "One row per department.",
        columns: [
          { name: "department_id", type: "integer", description: "Unique department identifier.", key: "PK" },
          { name: "department_name", type: "text", description: "Department name." },
          { name: "location", type: "text", description: "Primary office, or Remote." },
          { name: "annual_budget", type: "integer", description: "Approved budget for the year." },
        ],
      },
      {
        name: "employees",
        description: "One row per employee, current or former.",
        columns: [
          { name: "employee_id", type: "integer", description: "Unique employee identifier.", key: "PK" },
          { name: "full_name", type: "text", description: "Employee name." },
          { name: "department_id", type: "integer", description: "Department the employee belongs to.", key: "FK" },
          { name: "job_title", type: "text", description: "Job title." },
          { name: "job_level", type: "text", description: "Junior, Mid, Senior, Lead or Manager." },
          { name: "manager_id", type: "integer", description: "This employee's manager (another employee_id, or blank).", key: "FK" },
          { name: "hire_date", type: "date", description: "Date hired." },
          { name: "salary", type: "integer", description: "Annual salary." },
          { name: "performance_rating", type: "integer", description: "Most recent review, 1 (lowest) to 5 (highest)." },
          { name: "status", type: "text", description: "Active or Resigned." },
          { name: "termination_date", type: "date", description: "Date left, if resigned; blank otherwise." },
        ],
      },
    ],
  },
};

export const DATABASE_LIST = Object.values(DATABASES);
export const TABLES_OF = (db: DatabaseId) => DATABASES[db].tables.map((t) => t.name);

/** Table name -> column names, for the SQL editor's autocomplete/highlighting. */
export const schemaFor = (db: DatabaseId): Record<string, string[]> =>
  Object.fromEntries(DATABASES[db].tables.map((t) => [t.name, t.columns.map((c) => c.name)]));
