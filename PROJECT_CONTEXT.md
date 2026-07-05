# C2C Replenishment System Project Context

## Core direction

This repo is the new C2C replenishment system.

Architecture rule:

- Apps Script moves data and writes display sheets.
- BigQuery stores long-term facts and heavy calculation results.
- Google Sheets displays results and supports manual review.

Google Sheets should not become the long-term database or main calculation engine.

## Version 1 goal

The first version must answer:

1. Which SKU is short at each store.
2. Whether main warehouse stock can cover it.
3. Whether inter-store transfer can cover it.
4. Which shortage may cause lost sales.

## Current known fields

The current inventory export includes SKU, SPU, product name, variant, size, available stock, allocated stock, demand, shortage, suggested order, 7 day sales, 30 day sales, 90 day sales, and store stock columns beginning with `可銷售數-`.

## Product groups

Version 1 splits products into:

- RAINWEAR
- APPAREL
- OTHER

## Default calculation idea

Use weighted sales velocity from 7, 30, and 90 day sales.

Default target days:

- Minimum: 10 days
- Default: 14 days
- Maximum: 20 days

Need quantity is target stock minus store available stock and incoming stock.

## Risk levels

- CRITICAL_MAIN_WAREHOUSE_SHORT: store is short and main warehouse cannot cover.
- TRANSFER_CANDIDATE: store is short and another store has excess stock.
- REPLENISH_FROM_MAIN: store is short and main warehouse can cover.
- WATCH: stock is low but not urgent.
- OK: no action.

## Validation output

Each run must output:

- CHECK: schema and data quality checks.
- STATE: calculation settings.
- LOG: processed rows, warnings, and skipped rows.

## Development rules

Keep input/output separate from calculation. Keep calculation functions pure when possible. Every formula needs a sample case and expected result.
