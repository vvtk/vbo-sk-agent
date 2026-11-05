import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const english = JSON.parse(read('vbo_sk_agent/locales/en.json'));
const chinese = JSON.parse(read('vbo_sk_agent/locales/zh-CN.json'));

test('extension metadata and release notes agree on version 1.3.0', () => {
  const entry = read('vbo_sk_agent.rb');
  assert.match(entry, /PLUGIN_VERSION\s*=\s*'1\.3\.0'/);
  assert.match(entry, /# v1\.3\.0 \(2026-11-05\)/);
});

test('English and Simplified Chinese catalogs have matching keys and placeholders', () => {
  const englishKeys = Object.keys(english).sort();
  assert.deepEqual(Object.keys(chinese).sort(), englishKeys);

  for (const key of englishKeys) {
    const placeholders = (value) => (value.match(/%\{\w+\}/g) || []).sort();
    assert.deepEqual(placeholders(chinese[key]), placeholders(english[key]), key);
  }
});

test('all dashboard, Ruby, and AI-tool guidance lookups have both translations', () => {
  const references = new Set();

  const dashboard = read('vbo_sk_agent/ui/dashboard.html');
  for (const match of dashboard.matchAll(/data-i18n-(?:html-)?key="([^"]+)"/g)) references.add(match[1]);

  const app = read('vbo_sk_agent/ui/js/app.js');
  for (const match of app.matchAll(/\btr\('([^']+)'/g)) references.add(match[1].trim());

  for (const file of ['vbo_sk_agent/loader.rb', 'vbo_sk_agent/bridge.rb']) {
    const source = read(file);
    for (const match of source.matchAll(/Localization\.t\('([^']+)'/g)) references.add(match[1].trim());
  }

  for (const key of [
    'toolbar.bridge.tooltip', 'toolbar.bridge.status',
    'toolbar.mcp.tooltip', 'toolbar.mcp.status',
    'toolbar.dashboard.tooltip', 'toolbar.dashboard.status',
  ]) references.add(key);

  const context = { window: {} };
  vm.runInNewContext(read('vbo_sk_agent/ui/js/app.js'), context);
  for (const [agentName, agent] of Object.entries(context.AGENTS)) {
    for (const text of [...agent.steps, agent.note].filter(Boolean)) references.add(text.trim());
  }

  for (const key of references) {
    assert.ok(Object.hasOwn(english, key), `English translation missing: ${key}`);
    assert.ok(Object.hasOwn(chinese, key), `Chinese translation missing: ${key}`);
  }
});

test('Chinese beginner guide preserves every English prompt/code block verbatim', () => {
  const blocks = (content) => [...content.matchAll(/^```[^\n]*\n([\s\S]*?)^```/gm)].map((match) => match[1]);
  const source = blocks(read('vbo_sk_agent/templates/beginner_guide.md'));
  const translated = blocks(read('vbo_sk_agent/templates/beginner_guide.zh-CN.md'));
  assert.equal(source.length, translated.length);
  assert.deepEqual(translated, source);
});

test('loader loads localization before bridge prompts and uses the packaged assets', () => {
  const loader = read('vbo_sk_agent/loader.rb');
  const localizationIndex = loader.indexOf("'localization'");
  const bridgeIndex = loader.indexOf("'bridge'");
  assert.ok(localizationIndex >= 0 && bridgeIndex > localizationIndex);

  for (const file of [
    'vbo_sk_agent/locales/en.json',
    'vbo_sk_agent/locales/zh-CN.json',
    'vbo_sk_agent/templates/beginner_guide.zh-CN.md',
    'vbo_sk_agent/ui/dashboard.html',
    'vbo_sk_agent/ui/js/app.js',
    'vbo_sk_agent/ui/css/style.css',
  ]) assert.ok(fs.statSync(path.join(root, file)).isFile(), `Missing packaged file: ${file}`);
});
