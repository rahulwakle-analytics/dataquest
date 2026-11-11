import type { SheetSpec } from "@/lib/sheet/engine";
import type { Dataset } from "@/lib/table-practice";
import type { TableQuestion } from "./types";

export type Difficulty = "Easy" | "Medium" | "Hard";
export const XP: Record<Difficulty, number> = { Easy: 10, Medium: 20, Hard: 30 };

export type SheetChallenge = {
  slug: string;
  title: string;
  difficulty: Difficulty;
  topics: string[];
  scenario: string;
  task: string;
  sheet: SheetSpec;
  /** Cells the learner must fill. Everything else is read-only sample data. */
  targets: string[];
  /** Reference formula per target. Expected values are calculated from these, not hand-typed. */
  solution: Record<string, string>;
  hints: string[];
  explanation: string;
};

export const challengeId = (slug: string) => `practice-excel/${slug}`;

/**
 * One shared retail order sheet (A:D), a small price list (F:G) and a region pivot shell (K:L).
 * Every challenge below reuses this sheet and only differs in which cells are the answer.
 */
const sheet: SheetSpec = {
  rows: [
    ["Region", "Product", "Units", "Revenue", "Flag", "Product", "Price", "Lookup result", null, null, "Region", "Total revenue"],
    ["North", "Desk", 4, 480, null, "Desk", 120, null, null, null, "North", null],
    ["South", "Chair", 8, 320, null, "Chair", 40, null, null, null, "South", null],
    ["North", "Chair", 3, 120, null, "Lamp", 15, null, null, null, "East", null],
    ["East", "Desk", 6, 720, null, "Shelf", 60, null, null, null, "West", null],
    ["South", "Desk", 2, 240],
    ["North", "Lamp", 10, 150],
    ["West", "Chair", 5, 200],
    ["East", "Lamp", 7, 105],
    ["South", "Lamp", 9, 135],
    ["North", "Desk", 5, 600],
  ],
  formats: { D: "money", G: "money" },
};

export const sheetChallenges: SheetChallenge[] = [
  {
    slug: "monthly-revenue-total",
    title: "Total revenue",
    difficulty: "Easy",
    topics: ["SUM"],
    scenario: "A store manager wants the total revenue across every order in the sheet.",
    task: "In F2, add up the Revenue column for all 10 orders (D2:D11).",
    sheet,
    targets: ["F2"],
    solution: { F2: "=SUM(D2:D11)" },
    hints: ["SUM adds every number in a range.", "The orders run from row 2 to row 11.", "=SUM(D2:D11)"],
    explanation: "SUM(D2:D11) adds all ten order revenues: 3,070 in total.",
  },
  {
    slug: "average-order-value",
    title: "Average order value",
    difficulty: "Easy",
    topics: ["AVERAGE"],
    scenario: "Leadership wants to know the typical size of an order, not just the total.",
    task: "In F2, calculate the average revenue per order (D2:D11).",
    sheet,
    targets: ["F2"],
    solution: { F2: "=AVERAGE(D2:D11)" },
    hints: ["AVERAGE divides the sum by the count automatically.", "=AVERAGE(D2:D11)"],
    explanation: "AVERAGE(D2:D11) is 3,070 ÷ 10 = 307.",
  },
  {
    slug: "order-count",
    title: "Number of orders",
    difficulty: "Easy",
    topics: ["COUNT"],
    scenario: "Ops wants to confirm how many orders were placed this period.",
    task: "In F2, count how many orders are in the Revenue column (D2:D11).",
    sheet,
    targets: ["F2"],
    solution: { F2: "=COUNT(D2:D11)" },
    hints: ["COUNT only counts cells holding numbers.", "=COUNT(D2:D11)"],
    explanation: "COUNT(D2:D11) counts the 10 numeric revenue cells.",
  },
  {
    slug: "high-value-flag",
    title: "Flag a high-value order",
    difficulty: "Easy",
    topics: ["IF"],
    scenario: "Orders over $400 get routed to the key-accounts team.",
    task: "In E2, write a formula that shows \"High\" if D2 is over 400, and \"Low\" otherwise.",
    sheet,
    targets: ["E2"],
    solution: { E2: '=IF(D2>400,"High","Low")' },
    hints: ["IF(condition, value if true, value if false).", 'The condition compares D2 to 400.', '=IF(D2>400,"High","Low")'],
    explanation: 'D2 is 480, which is over 400, so the formula returns "High".',
  },
  {
    slug: "flagged-count",
    title: "Count large orders",
    difficulty: "Medium",
    topics: ["COUNTIF"],
    scenario: "Finance wants to know how many orders were worth more than $500.",
    task: "In F2, count how many orders in D2:D11 are greater than 500.",
    sheet,
    targets: ["F2"],
    solution: { F2: '=COUNTIF(D2:D11,">500")' },
    hints: ["COUNTIF takes a range and a condition, like \">500\".", '=COUNTIF(D2:D11,">500")'],
    explanation: "Only two orders (720 and 600) are over 500.",
  },
  {
    slug: "regional-filtered-total",
    title: "Revenue from larger North orders",
    difficulty: "Medium",
    topics: ["SUMIFS"],
    scenario: "A regional manager only cares about North orders of 5 units or more.",
    task: "In F2, total the Revenue for orders where Region is \"North\" and Units is at least 5.",
    sheet,
    targets: ["F2"],
    solution: { F2: '=SUMIFS(D2:D11,A2:A11,"North",C2:C11,">=5")' },
    hints: [
      "SUMIFS starts with the range to sum, then pairs of (condition range, condition).",
      "Two conditions here: Region is North, and Units is >= 5.",
      '=SUMIFS(D2:D11,A2:A11,"North",C2:C11,">=5")',
    ],
    explanation: "Only two North orders have 5+ units (150 and 600), totalling 750.",
  },
  {
    slug: "channel-order-count",
    title: "Count South chair orders",
    difficulty: "Medium",
    topics: ["COUNTIFS"],
    scenario: "Merchandising wants to know how many chair orders came from the South region.",
    task: "In F2, count the orders where Region is \"South\" and Product is \"Chair\".",
    sheet,
    targets: ["F2"],
    solution: { F2: '=COUNTIFS(A2:A11,"South",B2:B11,"Chair")' },
    hints: ["COUNTIFS takes pairs of (range, condition), with no sum range first.", '=COUNTIFS(A2:A11,"South",B2:B11,"Chair")'],
    explanation: "Only one order is South + Chair, so the count is 1.",
  },
  {
    slug: "average-desk-revenue",
    title: "Average revenue for desks",
    difficulty: "Medium",
    topics: ["AVERAGEIFS"],
    scenario: "Product management wants the average order value for desks specifically.",
    task: 'In F2, average the Revenue for orders where Product is "Desk".',
    sheet,
    targets: ["F2"],
    solution: { F2: '=AVERAGEIFS(D2:D11,B2:B11,"Desk")' },
    hints: ["Same pattern as AVERAGE, but with a condition pair after the average range.", '=AVERAGEIFS(D2:D11,B2:B11,"Desk")'],
    explanation: "Four desk orders (480, 720, 240, 600) average to 510.",
  },
  {
    slug: "price-lookup",
    title: "Look up a product's price",
    difficulty: "Medium",
    topics: ["XLOOKUP"],
    scenario: "A small price list sits in F1:G5. Sales wants to look prices up by name instead of scrolling.",
    task: 'In H2, look up the price of "Chair" from the price list. In H3, look up the price of "Stool" — which is not in the list — and show "Not found" instead of an error.',
    sheet,
    targets: ["H2", "H3"],
    solution: { H2: '=XLOOKUP("Chair",F2:F5,G2:G5)', H3: '=XLOOKUP("Stool",F2:F5,G2:G5,"Not found")' },
    hints: [
      "XLOOKUP(what to find, where to look, what to return).",
      "A fourth, optional argument is what to show when nothing matches.",
      '=XLOOKUP("Chair",F2:F5,G2:G5)',
      '=XLOOKUP("Stool",F2:F5,G2:G5,"Not found")',
    ],
    explanation: 'Chair\'s price is 40. "Stool" is not in the list, so the fourth argument supplies the fallback text instead of an error.',
  },
  {
    slug: "pivot-region-summary",
    title: "Build a region summary (pivot-style)",
    difficulty: "Hard",
    topics: ["SUMIF", "pivot-style summary"],
    scenario: "A regional breakdown, like a small pivot table, sits in K1:L5 with the regions already listed in K2:K5.",
    task: "Fill L2:L5 with the total Revenue for each region named in the same row's column K.",
    sheet,
    targets: ["L2", "L3", "L4", "L5"],
    solution: {
      L2: '=SUMIF(A2:A11,"North",D2:D11)',
      L3: '=SUMIF(A2:A11,"South",D2:D11)',
      L4: '=SUMIF(A2:A11,"East",D2:D11)',
      L5: '=SUMIF(A2:A11,"West",D2:D11)',
    },
    hints: [
      "Each row needs its own SUMIF, filtering by that row's region label.",
      'You could reference K2 instead of typing "North" again, so the formula still works if copied.',
      '=SUMIF($A$2:$A$11,K2,$D$2:$D$11) copied down works too — either is correct.',
    ],
    explanation: "The four regional totals (1,350 / 695 / 825 / 200) add back up to the 3,070 grand total.",
  },
];

/* ------------------------------------------------------------------ */
/* Sort & filter: the same TableQuestion engine used in lessons,       */
/* exposed as standalone practice items in the Excel Playground.       */
/* ------------------------------------------------------------------ */

const inventory: Dataset = {
  idKey: "id",
  columns: [
    { key: "id", label: "Item ID", type: "number" },
    { key: "product", label: "Product", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "region", label: "Region", type: "text" },
    { key: "stock", label: "Stock", type: "number" },
  ],
  rows: [
    { id: 1, product: "Desk", category: "Furniture", region: "North", stock: 12 },
    { id: 2, product: "Chair", category: "Furniture", region: "South", stock: 5 },
    { id: 3, product: "Monitor", category: "Technology", region: "North", stock: 30 },
    { id: 4, product: "Keyboard", category: "Technology", region: "West", stock: 8 },
    { id: 5, product: "Lamp", category: "Furniture", region: "East", stock: 20 },
    { id: 6, product: "Printer", category: "Technology", region: "South", stock: 3 },
    { id: 7, product: "Shelf", category: "Furniture", region: "West", stock: 15 },
    { id: 8, product: "Mouse", category: "Technology", region: "North", stock: 50 },
    { id: 9, product: "Cabinet", category: "Furniture", region: "South", stock: 2 },
    { id: 10, product: "Webcam", category: "Technology", region: "East", stock: 18 },
    { id: 11, product: "Stapler", category: "Office Supplies", region: "North", stock: 40 },
    { id: 12, product: "Paper", category: "Office Supplies", region: "South", stock: 6 },
  ],
};

export const sortFilterChallenges: { slug: string; question: TableQuestion }[] = [
  {
    slug: "south-low-stock",
    question: {
      kind: "table",
      title: "South region, low on stock",
      prompt: 'Show South region items with 6 or fewer in stock, lowest stock first.',
      difficulty: "Easy",
      dataset: inventory,
      goal: { filters: [{ col: "region", op: "is", value: "South" }, { col: "stock", op: "<=", value: 6 }], sort: [{ col: "stock", dir: "asc" }] },
      expectIds: [9, 6, 2, 12],
      steps: ['Filter Region is "South".', "Filter Stock ≤ 6.", "Sort by Stock, smallest to largest."],
      explanation: "Cabinet, Printer, Chair and Paper are the South items at 6 units or fewer, ordered from lowest stock to highest.",
    },
  },
  {
    slug: "technology-well-stocked",
    question: {
      kind: "table",
      title: "Technology items with healthy stock",
      prompt: "Show Technology items with 18 or more in stock, highest stock first.",
      difficulty: "Medium",
      dataset: inventory,
      goal: { filters: [{ col: "category", op: "is", value: "Technology" }, { col: "stock", op: ">=", value: 18 }], sort: [{ col: "stock", dir: "desc" }] },
      expectIds: [8, 3, 10],
      steps: ['Filter Category is "Technology".', "Filter Stock ≥ 18.", "Sort by Stock, largest to smallest."],
      explanation: "Mouse, Monitor and Webcam are the Technology items at 18+ units, from most to least stock.",
    },
  },
];
