import type { Raw, SheetSpec } from "@/lib/sheet/engine";
import type { Dataset } from "@/lib/table-practice";
import type { Lesson } from "../types";

/* ------------------------------------------------------------------ */
/* Shared data                                                         */
/* ------------------------------------------------------------------ */

const sales: Dataset = {
  idKey: "id",
  columns: [
    { key: "id", label: "Order ID", type: "number" },
    { key: "date", label: "Date", type: "date" },
    { key: "region", label: "Region", type: "text" },
    { key: "rep", label: "Rep", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "units", label: "Units", type: "number" },
    { key: "sales", label: "Sales", type: "number", fmt: "money" },
  ],
  rows: [
    { id: 1001, date: "2024-01-05", region: "North", rep: "Asha", category: "Furniture", units: 4, sales: 1200 },
    { id: 1002, date: "2024-01-09", region: "South", rep: "Ben", category: "Technology", units: 2, sales: 860 },
    { id: 1003, date: "2024-01-14", region: "West", rep: "Chen", category: "Office Supplies", units: 15, sales: 225 },
    { id: 1004, date: "2024-01-20", region: "North", rep: "Dev", category: "Technology", units: 1, sales: 540 },
    { id: 1005, date: "2024-02-02", region: "East", rep: "Asha", category: "Furniture", units: 3, sales: 930 },
    { id: 1006, date: "2024-02-07", region: "West", rep: "Ben", category: "Technology", units: 5, sales: 2150 },
    { id: 1007, date: "2024-02-11", region: "South", rep: "Chen", category: "Office Supplies", units: 30, sales: 410 },
    { id: 1008, date: "2024-02-18", region: "North", rep: "Dev", category: "Furniture", units: 2, sales: 610 },
    { id: 1009, date: "2024-03-01", region: "East", rep: "Asha", category: "Technology", units: 3, sales: 1290 },
    { id: 1010, date: "2024-03-06", region: "West", rep: "Chen", category: "Furniture", units: 6, sales: 1740 },
    { id: 1011, date: "2024-03-15", region: "South", rep: "Dev", category: "Office Supplies", units: 22, sales: 330 },
    { id: 1012, date: "2024-03-22", region: "East", rep: "Ben", category: "Office Supplies", units: 12, sales: 180 },
  ],
};

/** The Orders table used in Tables & Formatting. `extra` adds two rows, as if the table had grown. */
const ORDER_ROWS: Raw[][] = [
  [1001, "North", 3, 40, 120],
  [1002, "South", 5, 24, 120],
  [1003, "North", 2, 150, 300],
  [1004, "West", 10, 12, 120],
  [1005, "South", 1, 260, 260],
  [1006, "East", 4, 55, 220],
  [1007, "North", 6, 30, 180],
];
function ordersSheet(opts: { grown?: boolean; blankAmount?: boolean; extraColumn?: string; side?: string }): SheetSpec {
  const data = ORDER_ROWS.slice(0, opts.grown ? 7 : 5).map((r) => {
    const row = [...r];
    if (opts.blankAmount) row[4] = null;
    if (opts.extraColumn) row.push(null);
    return row;
  });
  const header: Raw[] = ["Order", "Region", "Qty", "Price", "Amount"];
  if (opts.extraColumn) header.push(opts.extraColumn);
  if (opts.side) header.push(null, opts.side, null);
  const lastCol = opts.extraColumn ? "F" : "E";
  return {
    rows: [header, ...data],
    tables: [{ name: "Orders", ref: `A1:${lastCol}${data.length + 1}` }],
    formats: { D: "money", E: "money", ...(opts.extraColumn === "Share" ? { F: "pct" } : opts.extraColumn ? { F: "money" } : {}), ...(opts.side === "Total revenue" ? { H: "money" } : {}) },
  };
}

/* ------------------------------------------------------------------ */
/* Lessons                                                             */
/* ------------------------------------------------------------------ */

export const excel: Record<string, Lesson> = {
  "excel/formulas-and-cell-references": {
    summary: "Excel formulas refer to cells, and whether a reference is relative or absolute decides what happens when you copy the formula.",
    explanation: [
      "A formula starts with = and usually points at other cells. By default a reference is relative: copy =B2*C2 down one row and it becomes =B3*C3. That is what lets you write one formula and fill a whole column.",
      "Sometimes one part must stay put, such as a tax rate in a single cell. A $ locks the part that follows it: $F$1 locks both column and row, F$1 locks only the row, and $F1 locks only the column. Press F4 while editing a reference to cycle through the options.",
      "To choose, ask what should happen as the formula is copied. If it is copied down and the cell it reads should move down too, leave the row free. If it must keep reading one fixed row, lock the row. Do the same for columns when copying across.",
    ],
    syntax: `=B2*C2        relative: both parts move when copied
=B2*$F$1      absolute: F1 never moves
=B2*F$1       mixed: row 1 is locked, the column still moves
=$B2*C$1      mixed: column B is locked in one, row 1 in the other`,
    examples: [
      { title: "Line total", code: `=B2*C2`, note: "Quantity in B, unit price in C. Fill down and each row uses its own cells." },
      { title: "Apply one tax rate to every row", code: `=D2*(1+$F$1)`, note: "D2 moves as you fill down; $F$1 keeps pointing at the tax rate." },
      { title: "A grid of prices by quantity", code: `=$A2*B$1`, note: "Prices run down column A and quantities across row 1. Each reference is locked in the direction it must not move." },
    ],
    playground: {
      title: "See what copying does",
      intro: "The formula in C2 is copied down to C5. Change it and watch the copies. Turn on “Show formulas” to see how each reference moved.",
      sheet: {
        rows: [
          ["Product", "Price (USD)", "Price (EUR)", null, "Rate", 0.9],
          ["Notebook", 10, null],
          ["Backpack", 40, null],
          ["Desk lamp", 25, null],
          ["Headphones", 80, null],
        ],
        formats: { B: "money", C: "num2" },
      },
      target: "C2",
      fill: "C2:C5",
      initial: "=B2*F1",
      tryThese: ["=B2*F1", "=B2*$F$1", "=B2*F$1", "=$B$2*$F$1"],
    },
    scenario: {
      title: "Converting a price list to another currency",
      body: "You have 200 product prices in column B and today's exchange rate in cell E1. Write the conversion once with the rate locked, fill it down, and tomorrow you change only E1.",
      code: `=B2*$E$1`,
    },
    mistakes: [
      { mistake: "Copying a formula that points at a single rate cell without locking it.", fix: "The reference drifts to empty cells and returns 0. Lock it with $ (press F4)." },
      { mistake: "Typing a number such as 0.2 directly into many formulas.", fix: "Put the value in one labelled cell and reference it, so a change happens in one place." },
      { mistake: "Locking everything with $ out of habit.", fix: "A fully locked formula returns the same value in every row. Lock only the part that must not move." },
    ],
    practice: [
      {
        kind: "formula",
        title: "Line totals",
        difficulty: "Easy",
        prompt: "Write a formula in D2 for the line total (quantity times unit price). It will be copied down to D6.",
        sheet: {
          rows: [
            ["Product", "Qty", "Unit price", "Line total"],
            ["Notebook", 12, 3.5, null],
            ["Pen box", 30, 4.2, null],
            ["Stapler", 5, 11, null],
            ["Desk lamp", 3, 24.5, null],
            ["Folder pack", 20, 2.75, null],
          ],
          formats: { C: "money", D: "money" },
        },
        target: "D2",
        fill: "D2:D6",
        solution: "=B2*C2",
        expect: [42, 126, 55, 73.5, 55],
        tests: [{ name: "the quantities change", patch: { B2: 20, B5: 7 } }],
        wrong: ["=42", "=B2*$C$2", "=$B$2*C2", "=B2+C2"],
        hints: [
          "Each row should multiply its own quantity by its own price.",
          "When a formula is copied down, a plain reference like B2 moves down with it. That is what you want here.",
          "Multiply the two cells in row 2, with no $ signs.",
        ],
        explanation: "Both references are relative, so the copy in D3 reads B3 and C3, the copy in D4 reads B4 and C4, and so on.",
      },
      {
        kind: "formula",
        title: "Discounted prices",
        difficulty: "Easy",
        prompt: "The discount is in F1. Write a formula in C2 for the sale price. It will be copied down to C6.",
        sheet: {
          rows: [
            ["Product", "List price", "Sale price", null, "Discount", 0.2],
            ["Office chair", 80, null],
            ["Monitor arm", 45, null],
            ["Standing mat", 120, null],
            ["Footrest", 60, null],
            ["Cable tray", 25, null],
          ],
          formats: { B: "money", C: "money", F: "pct" },
        },
        target: "C2",
        fill: "C2:C6",
        solution: "=B2*(1-$F$1)",
        expect: [64, 36, 96, 48, 20],
        tests: [{ name: "the discount changes to 35%", patch: { F1: 0.35 } }, { name: "the list prices change", patch: { B3: 50, B6: 30 } }],
        wrong: ["=B2*(1-F1)", "=B2*0.8", "=B2*(1-0.2)", "=B2*$F$1"],
        hints: [
          "The sale price is the list price times (1 minus the discount).",
          "The price reference should move down with each row. The discount lives in one cell and must not move.",
          "Lock F1 with $ signs on both the column and the row: $F$1.",
        ],
        explanation: "B2 is relative so each row uses its own price. $F$1 is absolute so every copy reads the same discount cell. Without the $, the copy in C3 would read F2, which is empty.",
      },
      {
        kind: "formula",
        title: "Commission by month",
        difficulty: "Medium",
        prompt: "Each month has its own commission rate in row 1. Write a formula in F3 for Asha's January commission. It will be copied across to H3 and down to row 5.",
        sheet: {
          rows: [
            ["Commission rate", 0.05, 0.06, 0.04],
            ["Rep", "Jan sales", "Feb sales", "Mar sales", null, "Jan comm.", "Feb comm.", "Mar comm."],
            ["Asha", 12000, 15000, 9000],
            ["Ben", 8000, 11000, 14000],
            ["Chen", 10000, 7000, 13000],
          ],
          formats: { F: "money", G: "money", H: "money" },
        },
        target: "F3",
        fill: "F3:H5",
        solution: "=B3*B$1",
        expect: [600, 900, 360, 400, 660, 560, 500, 420, 520],
        tests: [{ name: "February's rate changes to 10%", patch: { C1: 0.1 } }, { name: "the sales figures change", patch: { B4: 9500, D5: 4000 } }],
        wrong: ["=B3*B1", "=B3*$B$1", "=B3*$B1", "=B3*0.05"],
        hints: [
          "The sales reference should move both across and down. Think about what the rate reference should do in each direction.",
          "Copied across, the rate should move to the next month's column. Copied down, it must stay in row 1.",
          "Lock only the row of the rate: B$1.",
        ],
        explanation: "B$1 lets the column change (B, C, D for the three months) while the row stays at 1. $B$1 would apply January's rate to every month, and B1 would slide down into the header row.",
      },
      {
        kind: "formula",
        title: "Revenue by month",
        difficulty: "Medium",
        prompt: "Unit prices are in column B and monthly quantities in C to E. Write a formula in G2 for January revenue. It will be copied across to I2 and down to row 4.",
        sheet: {
          rows: [
            ["Product", "Unit price", "Jan qty", "Feb qty", "Mar qty", null, "Jan rev.", "Feb rev.", "Mar rev."],
            ["Mouse", 15, 40, 55, 30],
            ["Keyboard", 32, 20, 25, 35],
            ["Webcam", 48, 10, 12, 18],
          ],
          formats: { B: "money", G: "money", H: "money", I: "money" },
        },
        target: "G2",
        fill: "G2:I4",
        solution: "=C2*$B2",
        expect: [600, 825, 450, 640, 800, 1120, 480, 576, 864],
        tests: [{ name: "the unit prices change", patch: { B3: 30, B4: 50 } }, { name: "the quantities change", patch: { D2: 10, E4: 0 } }],
        wrong: ["=C2*B2", "=C2*$B$2", "=C2*B$2", "=$C2*$B2"],
        hints: [
          "The quantity should move across the months and down the products.",
          "The price is always in column B, but on a different row for each product.",
          "Lock only the column of the price: $B2.",
        ],
        explanation: "$B2 keeps the column fixed at B while the row follows each product. With a plain B2, the copy in H2 would multiply February's quantity by January's quantity.",
      },
      {
        kind: "formula",
        title: "Price grid",
        difficulty: "Hard",
        prompt: "Prices run down column A and quantities run across row 1. Write one formula in B2 that gives price times quantity when copied across to F and down to row 5.",
        sheet: {
          rows: [
            ["Price / Qty", 1, 5, 10, 25, 50],
            [4, null],
            [7.5, null],
            [12, null],
            [20, null],
          ],
          formats: { A: "money" },
        },
        target: "B2",
        fill: "B2:F5",
        solution: "=$A2*B$1",
        expect: [4, 20, 40, 100, 200, 7.5, 37.5, 75, 187.5, 375, 12, 60, 120, 300, 600, 20, 100, 200, 500, 1000],
        tests: [{ name: "the prices change", patch: { A3: 9, A5: 18.5 } }, { name: "the quantities change", patch: { C1: 2, F1: 100 } }],
        wrong: ["=A2*B1", "=$A$2*$B$1", "=$A2*B1", "=A2*B$1", "=A$2*$B1"],
        hints: [
          "You need two mixed references, one for the price and one for the quantity.",
          "The price must stay in column A but follow the row. The quantity must stay in row 1 but follow the column.",
          "Lock the column of the price ($A2) and the row of the quantity (B$1).",
        ],
        explanation: "In any copy, $A reads the price at the start of that row and $1 reads the quantity at the top of that column. Swapping the locks (A$2 and $B1) pins the wrong direction and every cell reads the same two inputs.",
      },
      {
        kind: "formula",
        title: "Invoice lines with discount and tax",
        difficulty: "Hard",
        prompt: "Every line gets the discount in G1 and then the tax in G2. Write a formula in D2 for the amount due (quantity × price, less discount, plus tax). It will be copied down to D5.",
        sheet: {
          rows: [
            ["Item", "Qty", "Unit price", "Amount due", null, "Discount", 0.1],
            ["Chair", 4, 75, null, null, "Tax", 0.18],
            ["Desk", 2, 220, null],
            ["Shelf", 3, 60, null],
            ["Lamp", 5, 18, null],
          ],
          formats: { C: "money", D: "money", G: "pct" },
        },
        target: "D2",
        fill: "D2:D5",
        solution: "=B2*C2*(1-$G$1)*(1+$G$2)",
        expect: [318.6, 467.28, 191.16, 95.58],
        tests: [{ name: "the discount becomes 25% and the tax 5%", patch: { G1: 0.25, G2: 0.05 } }, { name: "the quantities change", patch: { B2: 1, B5: 12 } }],
        wrong: ["=B2*C2*(1-G1)*(1+G2)", "=B2*C2*1-$G$1*1+$G$2", "=B2*C2*(1-$G$1)*1+$G$2", "=B2*C2*(1-$G$1)", "=B2*C2*0.9*1.18"],
        hints: [
          "Work out one line by hand first: 4 × 75 = 300, less 10% is 270, plus 18% tax is 318.60.",
          "Multiplying by (1 − discount) takes the discount off. Multiplying by (1 + tax) adds the tax. Both need brackets.",
          "Qty and price are relative. Both rate cells need full locks: $G$1 and $G$2.",
        ],
        explanation: "The brackets matter because multiplication happens before addition and subtraction: without them, =B2*C2*1-$G$1 subtracts 0.1 from the total instead of taking 10% off. Both rates are absolute so every line reads the same two cells.",
      },
    ],
    checks: [
      {
        q: "You copy =A1*$B$1 from C1 down to C2. What does C2 contain?",
        options: ["=A1*$B$1", "=A2*$B$1", "=A2*$B$2", "=B1*$B$1"],
        answer: 1,
        why: "A1 is relative and moves down a row; $B$1 is locked.",
      },
      {
        q: "What does B$1 lock?",
        options: ["Column B", "Row 1", "Both", "Neither"],
        answer: 1,
        why: "The $ sits in front of the row number, so only the row is fixed.",
      },
    ],
  },

  "excel/sorting-and-filtering": {
    summary: "Sorting changes the order of rows and filtering hides the rows you do not need, so the answer to a question sits at the top of the sheet.",
    explanation: [
      "Sorting rearranges whole rows by the values in one or more columns: A to Z, smallest to largest, or oldest to newest, and the reverse. Excel keeps each row together, so a customer's name stays beside their order.",
      "When you sort by more than one column, the order of the levels matters. Sorting by Region and then by Sales groups the regions together and orders the sales inside each region. The second level only decides between rows that tie on the first.",
      "Filtering hides rows that do not match and deletes nothing. You can tick values to keep (Region is North or East), or set a condition on a number or date (Sales greater than 500). Filters on different columns combine: a row must pass all of them to stay visible.",
    ],
    syntax: `Sort      Data > Sort > add a level for each column, most important first
Filter    Data > Filter > use the arrow in a column header
            Text column     tick the values to keep
            Number column   Number Filters > Greater Than, Between, Top 10…
            Date column     Date Filters > This Month, Between…
Clear     Data > Clear removes all filters and shows every row again`,
    examples: [
      { title: "Largest orders first", code: `Sort by: Sales, Largest to Smallest`, note: "One level. The biggest sale becomes the first row." },
      { title: "Best sales inside each region", code: `Sort by: Region, A to Z\nThen by: Sales, Largest to Smallest`, note: "Regions are grouped alphabetically and each group is ranked by sales." },
      { title: "Big technology orders", code: `Filter: Category = Technology\nFilter: Sales > 1000`, note: "Two filters on different columns. Only rows that pass both remain." },
    ],
    scenario: {
      title: "Who should the regional manager call first?",
      body: "The North region manager has an hour for customer calls and wants the largest recent orders. Filter Region to North, then sort Sales from largest to smallest. The call list is the top few rows, and the rest of the data is untouched underneath the filter.",
    },
    mistakes: [
      { mistake: "Selecting one column and sorting only that column.", fix: "The values come apart from their rows. Click a single cell inside the data, or choose “Expand the selection” when Excel asks." },
      { mistake: "Adding sort levels in the wrong order.", fix: "The first level is the main grouping. Put the column you want grouped at the top of the list." },
      { mistake: "Using SUM on a filtered list and expecting the visible total.", fix: "SUM includes hidden rows. Use SUBTOTAL(109, range) to total only what is visible." },
      { mistake: "Forgetting a filter is on.", fix: "Blue row numbers and a funnel icon in the header mean rows are hidden. Clear filters before concluding data is missing." },
    ],
    practice: [
      {
        kind: "table",
        title: "Biggest sales first",
        difficulty: "Easy",
        prompt: "Arrange the orders so the largest sale is at the top and the smallest at the bottom.",
        dataset: sales,
        goal: { filters: [], sort: [{ col: "sales", dir: "desc" }] },
        expectIds: [1006, 1010, 1009, 1001, 1005, 1002, 1008, 1004, 1007, 1011, 1003, 1012],
        hints: ["No rows need hiding. This is a sort only.", "Add one sort level on the Sales column.", "Set its direction to largest first."],
        steps: ["Add a sort level.", "Choose Sales.", "Choose Largest → smallest."],
        explanation: "A single descending sort on Sales puts 2,150 first and 180 last. Every row stays intact because whole rows move together.",
      },
      {
        kind: "table",
        title: "West region only",
        difficulty: "Easy",
        prompt: "Show only the orders from the West region.",
        dataset: sales,
        goal: { filters: [{ col: "region", op: "is", value: "West" }], sort: [] },
        expectIds: [1003, 1006, 1010],
        hints: ["This needs a filter, not a sort.", "Filter on the Region column.", "Keep rows where Region is West."],
        steps: ["Add a filter.", "Choose Region, “is”, West."],
        explanation: "Three orders are in the West. The other nine are hidden, not deleted: removing the filter brings them back.",
      },
      {
        kind: "table",
        title: "Furniture orders, oldest first",
        difficulty: "Medium",
        prompt: "Show only Furniture orders, with the earliest order date at the top.",
        dataset: sales,
        goal: { filters: [{ col: "category", op: "is", value: "Furniture" }], sort: [{ col: "date", dir: "asc" }] },
        expectIds: [1001, 1005, 1008, 1010],
        hints: ["You need one filter and one sort.", "Filter Category to Furniture, then sort by Date.", "Oldest first means ascending dates."],
        steps: ["Add a filter: Category is Furniture.", "Add a sort level: Date, Oldest → newest."],
        explanation: "Filtering and sorting work together: the filter decides which rows are visible and the sort decides their order.",
      },
      {
        kind: "table",
        title: "Rank sales inside each region",
        difficulty: "Medium",
        prompt: "Group the orders by region in alphabetical order, and within each region put the largest sale first.",
        dataset: sales,
        goal: { filters: [], sort: [{ col: "region", dir: "asc" }, { col: "sales", dir: "desc" }] },
        expectIds: [1009, 1005, 1012, 1001, 1008, 1004, 1002, 1007, 1011, 1006, 1010, 1003],
        hints: ["One sort level is not enough here.", "The first level does the grouping. Which column should be grouped?", "Level 1: Region, A → Z. Level 2: Sales, largest first."],
        steps: ["Add a sort level: Region, A → Z.", "Add a second level: Sales, Largest → smallest."],
        explanation: "The second level only orders rows that tie on the first. Reversing the levels would sort everything by sales and use region only to break ties between equal sales.",
      },
      {
        kind: "table",
        title: "Large orders in two regions",
        difficulty: "Hard",
        prompt: "Show orders of 500 or more from the North and East regions only. Sort them by rep name A to Z, and for each rep put the largest sale first.",
        dataset: sales,
        goal: {
          filters: [
            { col: "region", op: "is", value: "North" },
            { col: "region", op: "is", value: "East" },
            { col: "sales", op: ">=", value: 500 },
          ],
          sort: [{ col: "rep", dir: "asc" }, { col: "sales", dir: "desc" }],
        },
        expectIds: [1009, 1001, 1005, 1008, 1004],
        hints: [
          "Break it into parts: which rows, then what order.",
          "Two regions means two “is” filters on Region, like ticking two boxes. “500 or more” is a number filter on Sales.",
          "Filters: Region is North, Region is East, Sales ≥ 500. Sort: Rep A → Z, then Sales largest first.",
        ],
        steps: ["Add a filter: Region is North.", "Add a filter: Region is East.", "Add a filter: Sales ≥ 500.", "Add a sort level: Rep, A → Z.", "Add a second level: Sales, Largest → smallest."],
        explanation: "The two region filters widen the selection (either value is kept), while the sales filter narrows it. “500 or more” includes 500 itself, so the condition is ≥, not >.",
      },
    ],
    checks: [
      {
        q: "You sort by Region (A to Z) and then by Sales (largest to smallest). When does the Sales level affect the order?",
        options: ["Always, before Region", "Only between rows in the same region", "Only if Region is filtered", "Never"],
        answer: 1,
        why: "A later sort level only orders rows that tie on the levels above it.",
      },
      {
        q: "What happens to rows that do not match a filter?",
        options: ["They are deleted", "They are hidden and return when the filter is cleared", "They move to the bottom", "They move to another sheet"],
        answer: 1,
        why: "Filtering hides rows. The data is unchanged.",
      },
    ],
  },

  "excel/core-functions": {
    summary: "SUM, AVERAGE, COUNT, MIN and MAX summarise a range of cells in one number, and they keep working when the values change.",
    explanation: [
      "A function takes inputs in brackets and returns a result. Most summary functions take a range, written as first cell, colon, last cell: B2:B8 means every cell from B2 down to B8. SUM adds them, AVERAGE gives the mean, and MIN and MAX return the smallest and largest.",
      "Counting has two versions. COUNT counts cells that contain numbers. COUNTA counts cells that contain anything at all, including text. On a column with a few “pending” entries the two give different answers, and the difference tells you how many are not numbers.",
      "These functions skip text and blank cells inside a range, so AVERAGE divides by the number of numeric cells, not the number of rows. Functions can also be combined: ROUND(AVERAGE(B2:B8), 2) averages first and then rounds the result to two decimal places.",
    ],
    syntax: `=SUM(B2:B8)            add the numbers
=AVERAGE(B2:B8)        mean of the numbers
=COUNT(B2:B8)          how many cells hold numbers
=COUNTA(B2:B8)         how many cells are not empty
=MIN(B2:B8)            smallest number
=MAX(B2:B8)            largest number
=ROUND(number, 2)      round to 2 decimal places`,
    examples: [
      { title: "Total and average", code: `=SUM(B2:B8)\n=AVERAGE(B2:B8)`, note: "Seven daily sales figures give a weekly total and a daily average." },
      { title: "How many are missing?", code: `=COUNTA(B2:B9)-COUNT(B2:B9)`, note: "Non-empty cells minus numeric cells leaves the entries that are text, such as “pending”." },
      { title: "Combining functions", code: `=MAX(B2:B8)-MIN(B2:B8)`, note: "The spread between the best and worst day." },
    ],
    scenario: {
      title: "A one-minute summary of the week",
      body: "A store manager sends you seven days of sales and asks how the week went. Four formulas answer it: SUM for the weekly total, AVERAGE for a typical day, and MAX and MIN for the best and worst days. Next week you paste in new numbers and every figure updates.",
      code: `=SUM(B2:B8)\n=AVERAGE(B2:B8)\n=MAX(B2:B8)\n=MIN(B2:B8)`,
    },
    mistakes: [
      { mistake: "Adding cells one by one: =B2+B3+B4+B5.", fix: "Use =SUM(B2:B5). It is shorter and adjusts when a row is inserted inside the range." },
      { mistake: "Using COUNT on a text column and getting 0.", fix: "COUNT only counts numbers. Use COUNTA to count names, IDs or other text." },
      { mistake: "Including the total row in the range.", fix: "=SUM(B2:B9) written in B9 refers to itself. End the range on the last data row." },
      { mistake: "Reading an average when numbers are stored as text.", fix: "Text is skipped, so the average covers fewer rows than you think. Compare COUNT with COUNTA to check." },
    ],
    practice: [
      {
        kind: "formula",
        title: "Weekly sales total",
        difficulty: "Easy",
        prompt: "Write a formula in B9 for the total sales across the seven days.",
        sheet: {
          rows: [["Day", "Sales"], ["Mon", 1250], ["Tue", 980], ["Wed", 1430], ["Thu", 1105], ["Fri", 1675], ["Sat", 2210], ["Sun", 1890], ["Total", null]],
          formats: { B: "money" },
        },
        target: "B9",
        solution: "=SUM(B2:B8)",
        expect: [10540],
        tests: [{ name: "the daily figures change", patch: { B3: 0, B8: 2500 } }],
        wrong: ["=10540", "=SUM(B2:B7)", "=B2+B8", "=AVERAGE(B2:B8)"],
        hints: ["One function adds up a whole range.", "The range starts at Monday's cell and ends at Sunday's.", "Use SUM with the range B2:B8."],
        explanation: "SUM(B2:B8) adds every cell from B2 to B8. Because it reads the cells, the total updates when any day's figure changes.",
      },
      {
        kind: "formula",
        title: "Average order value",
        difficulty: "Easy",
        prompt: "Write a formula in B8 for the average order amount.",
        sheet: {
          rows: [["Order", "Amount"], ["A-101", 120], ["A-102", 85], ["A-103", 240], ["A-104", 60], ["A-105", 310], ["A-106", 145], ["Average", null]],
          formats: { B: "money" },
        },
        target: "B8",
        solution: "=AVERAGE(B2:B7)",
        expect: [160],
        tests: [{ name: "the order amounts change", patch: { B2: 300, B5: 10 } }, { name: "one amount is missing", patch: { B4: null } }],
        wrong: ["=SUM(B2:B7)", "=160", "=SUM(B2:B7)/6", "=AVERAGE(B2:B6)"],
        hints: ["There is a function that does the adding and dividing for you.", "It takes the same kind of range as SUM.", "Use AVERAGE with the range B2:B7."],
        explanation: "AVERAGE divides the sum by the number of numeric cells. That is why it beats =SUM(B2:B7)/6: if an amount is missing, AVERAGE divides by 5, while the hand-written version still divides by 6.",
      },
      {
        kind: "formula",
        title: "Invoices with an amount",
        difficulty: "Medium",
        prompt: "Some invoices are still “pending” and one is blank. Write a formula in B11 that counts how many invoices have a numeric amount.",
        sheet: {
          rows: [
            ["Invoice", "Amount"],
            ["INV-101", 450],
            ["INV-102", "pending"],
            ["INV-103", 320],
            ["INV-104", null],
            ["INV-105", 610],
            ["INV-106", 275],
            ["INV-107", "pending"],
            ["INV-108", 180],
            [null, null],
            ["Amounts recorded", null],
          ],
          formats: { B: "int" },
        },
        target: "B11",
        solution: "=COUNT(B2:B9)",
        expect: [5],
        tests: [{ name: "a pending invoice gets an amount", patch: { B3: 500 } }, { name: "the blank invoice is marked pending", patch: { B5: "pending" } }],
        wrong: ["=COUNTA(B2:B9)", "=5", "=COUNT(A2:A9)", "=SUM(B2:B9)"],
        hints: ["Excel has two counting functions. One counts anything that is not empty; the other counts only numbers.", "“pending” is text, so it must not be counted.", "Use COUNT, not COUNTA, on B2:B9."],
        explanation: "COUNT ignores text and blanks, so it returns 5. COUNTA would return 7 because it also counts the two “pending” cells.",
      },
      {
        kind: "formula",
        title: "Delivery time spread",
        difficulty: "Medium",
        prompt: "Write a formula in B9 for the difference between the slowest and fastest delivery, in days.",
        sheet: {
          rows: [["Order", "Days to deliver"], ["D-1", 3], ["D-2", 5], ["D-3", 2], ["D-4", 8], ["D-5", 4], ["D-6", 6], ["D-7", 3], ["Spread", null]],
        },
        target: "B9",
        solution: "=MAX(B2:B8)-MIN(B2:B8)",
        expect: [6],
        tests: [{ name: "the delivery times change", patch: { B2: 12, B4: 4 } }],
        wrong: ["=MAX(B2:B8)", "=6", "=B5-B4", "=MIN(B2:B8)-MAX(B2:B8)"],
        hints: ["You need two functions in one formula.", "Find the largest value and the smallest value, then subtract.", "MAX of the range minus MIN of the same range."],
        explanation: "MAX returns 8 and MIN returns 2, so the spread is 6. Pointing at the cells that happen to hold those values (=B5-B4) breaks as soon as the data changes.",
      },
      {
        kind: "formula",
        title: "Rounded monthly averages",
        difficulty: "Hard",
        prompt: "Write a formula in B7 for the average January sales across the five stores, rounded to 2 decimal places. It will be copied across to D7 for February and March.",
        sheet: {
          rows: [
            ["Store", "Jan", "Feb", "Mar"],
            ["North", 1234.5, 1310.25, 1188.4],
            ["South", 987.3, 1045.6, 1102.75],
            ["East", 1456.8, 1390.1, 1502.35],
            ["West", 1120.45, 1175.9, 1099.6],
            ["Central", 1333.33, 1288.88, 1401.01],
            ["Average", null, null, null],
          ],
        },
        target: "B7",
        fill: "B7:D7",
        solution: "=ROUND(AVERAGE(B2:B6),2)",
        expect: [1226.48, 1242.15, 1258.82],
        tests: [{ name: "the store figures change", patch: { B2: 1000.01, C4: 1500.555, D6: 1200 } }],
        wrong: ["=AVERAGE(B2:B6)", "=ROUND(AVERAGE($B$2:$B$6),2)", "=ROUND(AVERAGE(B2:B6),0)", "=ROUND(SUM(B2:B6),2)"],
        hints: [
          "Do it in two steps: average the column, then round the result.",
          "Put the AVERAGE inside ROUND. ROUND's second input is the number of decimal places.",
          "Leave the range relative so it moves to C and D when copied across.",
        ],
        explanation: "The inner AVERAGE runs first and ROUND trims its result to two decimals. The range has no $ signs, so the copy in C7 averages C2:C6. Changing a cell's number format would only hide the extra decimals; ROUND changes the value itself.",
      },
      {
        kind: "formula",
        title: "Share of total revenue",
        difficulty: "Hard",
        prompt: "Write a formula in C2 for each category's share of total revenue. It will be copied down to C5.",
        sheet: {
          rows: [["Category", "Revenue", "Share"], ["Furniture", 4200, null], ["Technology", 6300, null], ["Office Supplies", 2100, null], ["Clothing", 1400, null]],
          formats: { B: "money", C: "pct" },
        },
        target: "C2",
        fill: "C2:C5",
        solution: "=B2/SUM($B$2:$B$5)",
        expect: [0.3, 0.45, 0.15, 0.1],
        tests: [{ name: "the revenue figures change", patch: { B2: 1000, B4: 5000 } }],
        wrong: ["=B2/SUM(B2:B5)", "=B2/14000", "=B2/$B$2", "=SUM($B$2:$B$5)/B2"],
        hints: [
          "A share is the part divided by the whole.",
          "The part changes on each row. The whole is the sum of the same four cells every time.",
          "Divide B2 by SUM of a fully locked range: $B$2:$B$5.",
        ],
        explanation: "B2 is relative so each row uses its own revenue. The range inside SUM is absolute so every row divides by the same total. With an unlocked range, the copy in C3 would sum B3:B6 and miss the first category.",
      },
    ],
    checks: [
      {
        q: "A column holds 10, 20, “n/a” and 30. What does AVERAGE return for it?",
        options: ["15", "20", "An error", "0"],
        answer: 1,
        why: "Text is skipped, so the average is (10 + 20 + 30) / 3 = 20.",
      },
      {
        q: "Which function counts cells that contain text as well as numbers?",
        options: ["COUNT", "COUNTA", "SUM", "MAX"],
        answer: 1,
        why: "COUNTA counts every non-empty cell. COUNT counts numeric cells only.",
      },
    ],
  },

  "excel/tables-and-formatting": {
    summary: "An Excel table is a range that knows its own columns and grows with your data; number formats change how a value looks without changing the value.",
    explanation: [
      "Select a cell in your data and press Ctrl+T to turn the range into a table. A table has a name, headers that stay visible, built-in filter buttons, and it expands when you type a new row underneath. Charts, PivotTables and formulas that point at the table pick up the new rows automatically.",
      "Formulas can refer to a table by name instead of by cell address. Orders[Amount] means the whole Amount column of the Orders table, however long it gets. [@Qty] means the Qty value in the same row as the formula. These are called structured references, and they read almost like a sentence.",
      "Formatting controls appearance only. A cell showing 12.5% holds 0.125, and a cell showing $1,200 holds 1200. Dates are numbers too, displayed as dates. Formatting never changes what a formula calculates with, which is why a sum of rounded-looking numbers can appear to be off by a cent.",
    ],
    syntax: `Ctrl+T                         turn a range into a table
=SUM(Orders[Amount])           a whole column of the Orders table
=[@Qty]*[@Price]               values from this row
=[@Amount]/SUM(Orders[Amount]) this row compared with the whole column

Ctrl+1                         open Format Cells
Number formats                 Currency, Percentage, Date, Comma style`,
    examples: [
      { title: "A total that keeps up", code: `=SUM(Orders[Amount])`, note: "Add ten rows to the table and the total includes them, with no range to edit." },
      { title: "A calculated column", code: `=[@Qty]*[@Price]`, note: "Type it once in a table column and Excel fills the whole column, including future rows." },
      { title: "Display versus value", code: `Cell holds 0.125   →   Percentage format shows 12.5%`, note: "The stored value is still 0.125. Multiply by it and you get 12.5% of the other number." },
    ],
    scenario: {
      title: "A sales log that grows every day",
      body: "The team adds new orders to the bottom of a sheet daily, and the summary at the top keeps going stale because its formulas stop at last week's final row. Converting the log to a table named Orders and rewriting the summary with structured references fixes it: tomorrow's rows are inside Orders[Amount] the moment they are typed.",
      code: `=SUM(Orders[Amount])\n=COUNTIF(Orders[Region],"North")`,
    },
    mistakes: [
      { mistake: "Pointing summary formulas at a fixed range such as E2:E500.", fix: "Rows added past the end are ignored. Use a table and a structured reference so the range grows with the data." },
      { mistake: "Typing a % or currency symbol into the cell as text.", fix: "The cell becomes text and cannot be calculated. Type the number and apply a number format." },
      { mistake: "Assuming a cell that shows 0.33 holds exactly 0.33.", fix: "It may hold 0.3333… Formatting hides decimals; ROUND removes them." },
      { mistake: "Leaving blank rows or merged cells inside the data.", fix: "A table must be one unbroken block with a single header row." },
    ],
    practice: [
      {
        kind: "formula",
        title: "A total that grows with the table",
        difficulty: "Easy",
        prompt: "The data in A1:E6 is a table named Orders. Write a formula in H1 for total revenue that will still be right when new orders are added.",
        sheet: ordersSheet({ side: "Total revenue" }),
        target: "H1",
        solution: "=SUM(Orders[Amount])",
        expect: [920],
        tests: [{ name: "two more orders are added to the table", sheet: ordersSheet({ side: "Total revenue", grown: true }) }],
        wrong: ["=SUM(E2:E6)", "=920", "=SUM(Orders[Qty])", "=SUM(Orders[Price])"],
        hints: ["Refer to the column by name, not by cell addresses.", "A structured reference looks like TableName[ColumnName].", "Sum the Amount column of Orders: Orders[Amount]."],
        explanation: "Orders[Amount] always means every row of the Amount column. A fixed range such as E2:E6 gives 920 today but misses any order added in row 7 or below.",
      },
      {
        kind: "formula",
        title: "A calculated column",
        difficulty: "Easy",
        prompt: "The Amount column is empty. Write a formula in E2 that multiplies this row's Qty by this row's Price. It fills the whole column.",
        sheet: ordersSheet({ blankAmount: true }),
        target: "E2",
        fill: "E2:E6",
        solution: "=[@Qty]*[@Price]",
        expect: [120, 120, 300, 120, 260],
        tests: [{ name: "two more orders are added to the table", sheet: ordersSheet({ blankAmount: true, grown: true }), fill: "E2:E8" }, { name: "the quantities change", patch: { C2: 7, C5: 1 } }],
        wrong: ["=C2*$D$2", "=[@Qty]*40", "=[@Qty]+[@Price]", "=SUM(Orders[Qty])*[@Price]"],
        hints: ["Inside a table you can refer to “this row” of a column.", "The form is [@ColumnName].", "Multiply [@Qty] by [@Price]."],
        explanation: "[@Qty] and [@Price] read the values on the formula's own row, so the same formula works on every row. A plain =C2*D2 calculates the same thing; the structured form is easier to read and check.",
      },
      {
        kind: "formula",
        title: "North region order count",
        difficulty: "Medium",
        prompt: "Write a formula in H1 that counts the orders from the North region and stays correct as the table grows.",
        sheet: ordersSheet({ side: "North orders" }),
        target: "H1",
        solution: '=COUNTIF(Orders[Region],"North")',
        expect: [2],
        tests: [{ name: "two more orders are added to the table", sheet: ordersSheet({ side: "North orders", grown: true }) }, { name: "an order moves to another region", patch: { B2: "East" } }],
        wrong: ['=COUNTIF(B2:B6,"North")', "=2", "=COUNTA(Orders[Region])", '=COUNTIF(Orders[Region],"South")'],
        hints: ["COUNTIF counts the cells in a range that match a condition.", "Its two inputs are the range to look in and the value to look for. Text goes in double quotes.", 'Look in Orders[Region] for "North".'],
        explanation: "COUNTIF checks each cell of the Region column against “North”. Because the range is a structured reference, a new North order is counted as soon as it is added.",
      },
      {
        kind: "formula",
        title: "Each order's share of revenue",
        difficulty: "Medium",
        prompt: "Write a formula in F2 for this order's share of total revenue. It fills the whole Share column and must stay correct when orders are added.",
        sheet: ordersSheet({ extraColumn: "Share" }),
        target: "F2",
        fill: "F2:F6",
        solution: "=[@Amount]/SUM(Orders[Amount])",
        expect: [0.1304348, 0.1304348, 0.326087, 0.1304348, 0.2826087],
        tests: [{ name: "two more orders are added to the table", sheet: ordersSheet({ extraColumn: "Share", grown: true }), fill: "F2:F8" }],
        wrong: ["=E2/SUM($E$2:$E$6)", "=[@Amount]/920", "=E2/SUM(E2:E6)", "=[@Amount]/[@Amount]"],
        hints: ["A share is this row's amount divided by the total of all amounts.", "Use [@Amount] for this row and Orders[Amount] for the whole column.", "Divide [@Amount] by SUM(Orders[Amount])."],
        explanation: "The column reference needs no $ signs: Orders[Amount] is the whole column from every row. The cell shows a percentage because of its number format; the stored value is a fraction such as 0.13.",
      },
      {
        kind: "formula",
        title: "Region total on every row",
        difficulty: "Hard",
        prompt: "Write a formula in F2 that shows the total Amount for this order's region. It fills the whole column and must stay correct when orders are added.",
        sheet: ordersSheet({ extraColumn: "Region total" }),
        target: "F2",
        fill: "F2:F6",
        solution: "=SUMIF(Orders[Region],[@Region],Orders[Amount])",
        expect: [420, 380, 420, 120, 380],
        tests: [
          { name: "two more orders are added to the table", sheet: ordersSheet({ extraColumn: "Region total", grown: true }), fill: "F2:F8" },
          { name: "an order moves to another region", patch: { B4: "West" } },
        ],
        wrong: ["=SUMIF($B$2:$B$6,B2,$E$2:$E$6)", '=SUMIF(Orders[Region],"North",Orders[Amount])', "=SUM(Orders[Amount])", "=SUMIF(Orders[Region],[@Region],Orders[Qty])"],
        hints: [
          "SUMIF adds the values in one column for the rows where another column matches a condition.",
          "Its inputs are: the range to test, the value to match, and the range to add up.",
          "Test Orders[Region] against [@Region], and add up Orders[Amount].",
        ],
        explanation: "For each row, SUMIF finds every order whose region equals this row's region and adds their amounts. Using [@Region] as the condition is what makes the result different on each row.",
      },
      {
        title: "Why does the total look wrong?",
        difficulty: "Medium",
        prompt: "Three cells each show 0.33 and their sum shows 1.00. A colleague says Excel has made an arithmetic error. What is the likely cause, and how would you confirm it?",
        hints: ["Think about the difference between what a cell shows and what it holds.", "What fraction displays as 0.33 when formatted to two decimal places?", "Increase the decimal places on the three cells and see what appears."],
        solution: "Each cell probably holds 1/3 (0.3333…) and is formatted to show two decimals. Excel adds the stored values, which total 1, not the displayed 0.33s. Confirm by increasing the decimal places or selecting a cell and reading the formula bar. If the values must really be 0.33, wrap the calculation in ROUND(…, 2).",
        explanation: "Number formats change the display only. Calculations always use the stored value.",
      },
    ],
    checks: [
      {
        q: "A cell is formatted as Percentage and shows 25%. What value does it hold?",
        options: ["25", "0.25", "2.5", "“25%” as text"],
        answer: 1,
        why: "Percentage format multiplies the display by 100. The stored value is 0.25.",
      },
      {
        q: "In a table named Orders, what does [@Price] refer to?",
        options: ["The whole Price column", "The Price header cell", "The Price value in the same row as the formula", "The first Price value"],
        answer: 2,
        why: "The @ means “this row”. Orders[Price] without the @ is the whole column.",
      },
    ],
  },
};
