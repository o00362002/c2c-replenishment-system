/*
 * C2C Replenishment Core v1
 * Pure calculation layer for Apps Script V8.
 * IO should stay outside this file.
 */

const C2C_REPLENISHMENT_DEFAULTS = Object.freeze({
  recentWeight: 1.15,
  stableWeight: 1.0,
  minTargetDays: 10,
  defaultTargetDays: 14,
  maxTargetDays: 20,
  watchDays: 7,
  excessDays: 21
});

const C2C_REQUIRED_FIELDS = Object.freeze([
  '品項條碼',
  '商品編號',
  '商品名稱',
  '樣式',
  '尺寸',
  '可用庫存',
  '配貨',
  '7日銷售數',
  '30日銷售數',
  '90日銷售數'
]);

function runC2CReplenishmentCore(rows, config) {
  const cfg = normalizeConfig_(config);
  const check = validateInputRows_(rows);

  if (!check.ok) {
    return {
      CHECK: check,
      STATE: buildState_(cfg),
      LOG: { processedRows: 0, outputRows: 0, warnings: check.errors },
      results: []
    };
  }

  const storeColumns = detectStoreColumns_(rows[0]);
  const mainWarehouseField = cfg.mainWarehouseField || '可用庫存';
  const results = [];
  const warnings = [];

  rows.forEach(function(row, index) {
    const base = normalizeProductRow_(row);
    if (!base.sku) {
      warnings.push('Row ' + (index + 1) + ' skipped: missing SKU');
      return;
    }

    const velocity = calculateVelocity_(base.sales7, base.sales30, base.sales90, cfg);
    const category = classifyProduct_(base.productName, base.spu);
    const targetDays = chooseTargetDays_(category, velocity, cfg);
    const targetStock = Math.ceil(velocity * targetDays);
    const mainWarehouseQty = toNumber_(row[mainWarehouseField]);

    storeColumns.forEach(function(storeField) {
      const storeName = storeField.replace('可銷售數-', '');
      const storeQty = toNumber_(row[storeField]);
      const needQty = Math.max(targetStock - storeQty, 0);
      const risk = decideRisk_(needQty, mainWarehouseQty, storeQty, velocity, cfg);

      results.push({
        sku: base.sku,
        spu: base.spu,
        productName: base.productName,
        variant: base.variant,
        size: base.size,
        category: category,
        storeName: storeName,
        storeQty: storeQty,
        mainWarehouseQty: mainWarehouseQty,
        sales7: base.sales7,
        sales30: base.sales30,
        sales90: base.sales90,
        velocity: round_(velocity, 3),
        targetDays: targetDays,
        targetStock: targetStock,
        needQty: needQty,
        risk: risk
      });
    });
  });

  return {
    CHECK: Object.assign({}, check, { storeColumns: storeColumns }),
    STATE: buildState_(cfg),
    LOG: {
      processedRows: rows.length,
      outputRows: results.length,
      warnings: warnings
    },
    results: results
  };
}

function normalizeConfig_(config) {
  return Object.assign({}, C2C_REPLENISHMENT_DEFAULTS, config || {});
}

function validateInputRows_(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return { ok: false, errors: ['Input rows are empty.'] };
  }

  const first = rows[0];
  const missing = C2C_REQUIRED_FIELDS.filter(function(field) {
    return !(field in first);
  });

  const storeColumns = detectStoreColumns_(first);
  const errors = [];
  if (missing.length > 0) errors.push('Missing fields: ' + missing.join(', '));
  if (storeColumns.length === 0) errors.push('No store stock columns found. Expected prefix: 可銷售數-');

  return { ok: errors.length === 0, errors: errors };
}

function detectStoreColumns_(row) {
  return Object.keys(row || {}).filter(function(key) {
    return key.indexOf('可銷售數-') === 0;
  });
}

function normalizeProductRow_(row) {
  return {
    sku: String(row['品項條碼'] || '').trim(),
    spu: String(row['商品編號'] || '').trim(),
    productName: String(row['商品名稱'] || '').trim(),
    variant: String(row['樣式'] || '').trim(),
    size: String(row['尺寸'] || '').trim(),
    availableQty: toNumber_(row['可用庫存']),
    allocatedQty: toNumber_(row['配貨']),
    sales7: toNumber_(row['7日銷售數']),
    sales30: toNumber_(row['30日銷售數']),
    sales90: toNumber_(row['90日銷售數'])
  };
}

function calculateVelocity_(sales7, sales30, sales90, cfg) {
  const v7 = sales7 / 7;
  const v30 = (sales30 / 30) * cfg.recentWeight;
  const v90 = (sales90 / 90) * cfg.stableWeight;
  return Math.max(v7, v30, v90, 0);
}

function chooseTargetDays_(category, velocity, cfg) {
  let days = cfg.defaultTargetDays;
  if (category === 'RAINWEAR') days += 2;
  if (velocity >= 2) days += 2;
  return Math.min(Math.max(days, cfg.minTargetDays), cfg.maxTargetDays);
}

function classifyProduct_(productName, spu) {
  const text = String(productName || '') + ' ' + String(spu || '');
  if (/雨衣|防水|斗篷|雨褲|雨鞋/.test(text)) return 'RAINWEAR';
  if (/T|短T|上衣|褲|外套|背心|冰磁|涼感|防曬衣|襯衫|洋裝/.test(text)) return 'APPAREL';
  return 'OTHER';
}

function decideRisk_(needQty, mainWarehouseQty, storeQty, velocity, cfg) {
  if (needQty <= 0) {
    if (velocity > 0 && storeQty / velocity <= cfg.watchDays) return 'WATCH';
    return 'OK';
  }
  if (mainWarehouseQty >= needQty) return 'REPLENISH_FROM_MAIN';
  if (mainWarehouseQty > 0) return 'PARTIAL_MAIN_WAREHOUSE_COVER';
  return 'CRITICAL_MAIN_WAREHOUSE_SHORT';
}

function buildState_(cfg) {
  return {
    engineVersion: 'v1-core',
    recentWeight: cfg.recentWeight,
    stableWeight: cfg.stableWeight,
    minTargetDays: cfg.minTargetDays,
    defaultTargetDays: cfg.defaultTargetDays,
    maxTargetDays: cfg.maxTargetDays,
    watchDays: cfg.watchDays,
    excessDays: cfg.excessDays,
    mainWarehouseField: cfg.mainWarehouseField || '可用庫存'
  };
}

function toNumber_(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function round_(value, digits) {
  const base = Math.pow(10, digits || 0);
  return Math.round(value * base) / base;
}
