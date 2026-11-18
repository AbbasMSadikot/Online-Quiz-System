import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SafeText } from "../src/SafeText.js";

test("renders untrusted quiz content as escaped text, not executable markup", () => {
  const hostileText = '<img src=x onerror="alert(1)"><script>alert(2)</script>';
  const markup = renderToStaticMarkup(React.createElement(SafeText, { value: hostileText }));

  assert.equal(markup.includes("<img"), false);
  assert.equal(markup.includes("<script>"), false);
  assert.match(markup, /&lt;img/);
  assert.match(markup, /&lt;script&gt;/);
});
