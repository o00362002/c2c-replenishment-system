# Data Contract

## Input table: product inventory export

Each row should represent one SKU.

Required columns:

| Field | Meaning |
|---|---|
| 品項條碼 | SKU barcode or unique SKU id |
| 商品編號 | SPU or product id |
| 商品名稱 | Product name |
| 樣式 | Color or style |
| 尺寸 | Size |
| 可用庫存 | Main warehouse available quantity by default |
| 配貨 | Allocated quantity |
| 7日銷售數 | Sales quantity in last 7 days |
| 30日銷售數 | Sales quantity in last 30 days |
| 90日銷售數 | Sales quantity in last 90 days |

Store stock columns must start with:

```text
可銷售數-
```

Example:

- 可銷售數-桃園大江
- 可銷售數-台南Focus
- 可銷售數-台中三井

## Output table: SKU store replenishment result

Each output row represents one SKU at one store.

| Field | Meaning |
|---|---|
| sku | SKU id |
| spu | SPU id |
| productName | Product name |
| variant | Style |
| size | Size |
| category | RAINWEAR / APPAREL / OTHER |
| storeName | Store name |
| storeQty | Current store sellable quantity |
| mainWarehouseQty | Available main warehouse quantity |
| sales7 | 7 day sales |
| sales30 | 30 day sales |
| sales90 | 90 day sales |
| velocity | Estimated daily sales speed |
| targetDays | Target stock days |
| targetStock | Target stock quantity |
| needQty | Suggested replenishment need |
| risk | Replenishment risk level |

## Risk level definitions

| Risk | Meaning |
|---|---|
| CRITICAL_MAIN_WAREHOUSE_SHORT | Store needs stock, but main warehouse has no available stock |
| PARTIAL_MAIN_WAREHOUSE_COVER | Main warehouse can cover only part of the need |
| REPLENISH_FROM_MAIN | Main warehouse can cover the need |
| WATCH | No immediate need, but stock days are low |
| OK | No action |

## Next data tables for v2

The next version should add:

1. Sales order fact table.
2. Inventory snapshot fact table.
3. Purchase order or incoming stock table.
4. Transfer request table.
5. Product role table.
6. Store priority table.
