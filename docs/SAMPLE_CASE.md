# Sample Calculation Case

## Input

```javascript
const rows = [{
  '品項條碼': 'CB0025103-13',
  '商品編號': 'CB0025103',
  '商品名稱': '冰磁透涼厚磅短T',
  '樣式': '白',
  '尺寸': 'L',
  '可用庫存': 10,
  '配貨': 0,
  '7日銷售數': 26,
  '30日銷售數': 51,
  '90日銷售數': 89,
  '可銷售數-台中三井': 2,
  '可銷售數-桃園大江': 3
}];
```

## Expected logic

Daily velocity should use the highest weighted sales window.

- 7 day velocity = 26 / 7 = 3.714
- 30 day velocity = 51 / 30 * 1.15 = 1.955
- 90 day velocity = 89 / 90 = 0.989

Final velocity = 3.714

Because this product is apparel and fast moving, target days should be 16.

Target stock:

```text
ceil(3.714 * 16) = 60
```

For 台中三井:

```text
needQty = 60 - 2 = 58
```

If main warehouse available stock is 10, risk should be:

```text
PARTIAL_MAIN_WAREHOUSE_COVER
```

## Check target

The engine must return CHECK, STATE, LOG, and results.
