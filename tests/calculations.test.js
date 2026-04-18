import test from "node:test";
import assert from "node:assert/strict";
import { calculerLd, calculerLdc, calculerLdh, calculerLs } from "../src/utils/calculations.js";

test("calculerLd plafonne k1 x k2 a 1.7", () => {
  const result = calculerLd({ barSize: "15M", fc: 30, fy: 400, k1: 1.3, k2: 1.5, lambda: 1 });
  assert.equal(result.k1k2, 1.7);
  assert.equal(result.k1k2_capped, true);
});

test("calculerLd applique le minimum de 300 mm", () => {
  const result = calculerLd({ barSize: "10M", fc: 80, fy: 400, k1: 1, k2: 1, lambda: 1 });
  assert.equal(result.ld >= 300, true);
});

test("calculerLdc applique le minimum de 200 mm", () => {
  const result = calculerLdc({ barSize: "10M", fc: 80, fy: 400 });
  assert.equal(result.ldc >= 200, true);
});

test("calculerLdh applique max(8db, 150 mm)", () => {
  const result = calculerLdh({ barSize: "10M", fc: 60, fy: 400 });
  assert.equal(result.ldh >= 150, true);
});

test("calculerLs distingue les classes A et B", () => {
  const classA = calculerLs({
    barSize: "15M",
    fc: 30,
    fy: 400,
    k1: 1,
    k2: 1,
    lambda: 1,
    As_fourni: 400,
    As_requis: 100,
    pct_recouvert: 50,
  });
  const classB = calculerLs({
    barSize: "15M",
    fc: 30,
    fy: 400,
    k1: 1,
    k2: 1,
    lambda: 1,
    As_fourni: 100,
    As_requis: 100,
    pct_recouvert: 100,
  });

  assert.equal(classA.classe, "A");
  assert.equal(classB.classe, "B");
  assert.equal(classB.ls > classA.ls, true);
});
