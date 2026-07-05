# c2c-replenishment-system

C2C 品牌新版補貨系統。

## V1 focus

The first version builds the calculation core before UI work.

It answers:

1. Which SKU is short at each store.
2. Whether main warehouse stock can cover the shortage.
3. Which items should be watched before shortage.
4. Which items may cause lost sales.

## Repository structure

- PROJECT_CONTEXT.md: project rules and direction.
- docs/DATA_CONTRACT.md: input and output field contract.
- docs/SAMPLE_CASE.md: sample calculation case.
- src/ReplenishmentCore.gs: pure calculation engine.

## Design rule

Apps Script moves data. BigQuery stores long-term facts. Google Sheets displays results and supports manual review.

## Current status

V1 core branch: feature/v1-replenishment-core

Next step: add the Google Sheets adapter and output sheets.
