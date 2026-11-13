/* ============================================================
 * access.js · 密码门禁（Supabase 版）
 *
 * 三个函数接口保持不变，app.js 一行都不用动：
 *   verify(code)   -> Promise<{ ok, reason?, key }>
 *   remaining(key) -> Promise<number>
 *   consume(key)   -> Promise<{ ok, remaining }>
 *
 * 后端 + 数据库全在 Supabase：
 *   - 前端用 anon key 直连，调用 2 个 RPC（verify_password / consume_password）
 *   - 密码表不直接对前端开放，只通过 RPC 原子核销，做到一码一人一核销
 *   - 配置见 site-config.js
 * ============================================================ */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Access = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var CFG = (typeof window !== 'undefined' && window.SiteConfig) || {};
  var BASE = String(CFG.SUPABASE_URL || '').replace(/\/+$/, '');
  var ANON = CFG.SUPABASE_ANON_KEY || '';
  var MAX_USES = Number(CFG.MAX_USES) > 0 ? Number(CFG.MAX_USES) : 3;

  /* 会话：中途刷新可接着答，不重复扣次数（仍存本机） */
  var SESSION_KEY = 'boundary_quiz_session_v2';

  function store() {
    try { if (typeof localStorage !== 'undefined' && localStorage) return localStorage; } catch (e) { /* 隐私模式 */ }
    var m = {};
    return {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(m, k) ? m[k] : null; },
      setItem: function (k, v) { m[k] = String(v); },
      removeItem: function (k) { delete m[k]; }
    };
  }
  function readJSON(k, f) { try { var r = store().getItem(k); return r ? JSON.parse(r) : f; } catch (e) { return f; } }
  function writeJSON(k, v) { try { store().setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }

  /* 走 Supabase REST，调用 RPC 函数 */
  function rpc(fn, body) {
    return fetch(BASE + '/rest/v1/rpc/' + fn, {
      method: 'POST',
      headers: { 'apikey': ANON, 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body || {})
    }).then(function (r) { return r.json().catch(function () { return null; }); });
  }

  function verify(raw) {
    var code = String(raw || '').trim();
    if (!code) return Promise.resolve({ ok: false, reason: 'empty' });
    if (!BASE) return Promise.resolve({ ok: false, reason: 'config' });
    return rpc('verify_password', { p_code: code }).then(function (res) {
      if (res && res.ok) return { ok: true, key: code.toUpperCase(), remaining: res.remaining };
      return { ok: false, reason: (res && res.reason) || 'wrong' };
    }).catch(function () { return { ok: false, reason: 'network' }; });
  }

  function remaining(key) {
    if (!BASE) return Promise.resolve(0);
    return rpc('verify_password', { p_code: key }).then(function (res) {
      return (res && res.ok) ? res.remaining : 0;
    }).catch(function () { return 0; });
  }

  function consume(key) {
    if (!BASE) return Promise.resolve({ ok: false, remaining: 0, reason: 'config' });
    return rpc('consume_password', { p_code: key }).then(function (res) {
      if (res && res.ok) return { ok: true, remaining: res.remaining };
      return { ok: false, remaining: 0, reason: (res && res.reason) || 'wrong' };
    }).catch(function () { return { ok: false, remaining: 0, reason: 'network' }; });
  }

  function getSession() { return readJSON(SESSION_KEY, null); }
  function saveSession(o) { return writeJSON(SESSION_KEY, o); }
  function clearSession() { try { store().removeItem(SESSION_KEY); } catch (e) {} }

  return {
    MAX_USES: MAX_USES,
    verify: verify,
    remaining: remaining,
    consume: consume,
    getSession: getSession,
    saveSession: saveSession,
    clearSession: clearSession
  };
});
