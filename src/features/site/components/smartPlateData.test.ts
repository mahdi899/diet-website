import test from "node:test";
import assert from "node:assert/strict";
import {
  ORBIT_FOODS_100,
  DISH_TEMPLATES,
  SMART_PLATE_FILTERS,
  getCategoryRadialTheme,
  toPersianDigits,
  type FoodCategory,
} from "./smartPlateData";

test("ORBIT_FOODS_100 generates exactly 100 food items across 4 rings", () => {
  assert.equal(ORBIT_FOODS_100.length, 100);
  const ring0 = ORBIT_FOODS_100.filter((f) => f.ringIndex === 0);
  const ring1 = ORBIT_FOODS_100.filter((f) => f.ringIndex === 1);
  const ring2 = ORBIT_FOODS_100.filter((f) => f.ringIndex === 2);
  const ring3 = ORBIT_FOODS_100.filter((f) => f.ringIndex === 3);
  assert.equal(ring0.length, 14);
  assert.equal(ring1.length, 22);
  assert.equal(ring2.length, 28);
  assert.equal(ring3.length, 36);
});

test("Each category including budget has a distinct warm radial theme", () => {
  const categories: FoodCategory[] = [
    "budget",
    "polo",
    "khoresht",
    "kabab",
    "seafood",
    "traditional",
  ];
  const primaryStops = new Set<string>();
  for (const cat of categories) {
    const theme = getCategoryRadialTheme(cat);
    assert.ok(theme.primaryStop.startsWith("rgba("));
    assert.ok(theme.accentHex.startsWith("#"));
    primaryStops.add(theme.primaryStop);
  }
  assert.equal(primaryStops.size, categories.length);
});

test("SMART_PLATE_FILTERS includes budget filter and matches budget dishes", () => {
  const budgetFilter = SMART_PLATE_FILTERS.find((f) => f.id === "budget");
  assert.ok(budgetFilter);
  const matchingItems = ORBIT_FOODS_100.filter((item) => budgetFilter.matches(item.category));
  assert.ok(matchingItems.length >= 25);
});

test("Macro percentages always sum to 100% for every orbit food item", () => {
  for (const item of ORBIT_FOODS_100) {
    assert.equal(item.proteinPct + item.carbsPct + item.fatPct, 100);
    assert.ok(item.kcal > 250 && item.kcal < 650);
    assert.ok(item.name.length > 3);
  }
});

test("Newly generated budget and classic food images are included in DISH_TEMPLATES", () => {
  const images = DISH_TEMPLATES.map((d) => d.image);
  assert.ok(images.some((img) => img.includes("plate_persian_omelet_sangak_")));
  assert.ok(images.some((img) => img.includes("plate_adasi_lentil_bowl_")));
  assert.ok(images.some((img) => img.includes("plate_kookoo_sabzi_walnut_")));
  assert.ok(images.some((img) => img.includes("plate_persian_macaroni_tahdig_")));
  assert.ok(images.some((img) => img.includes("plate_zereshk_polo_chicken_")));
});

test("toPersianDigits converts numbers accurately", () => {
  assert.equal(toPersianDigits(998), "۹۹۸");
});
