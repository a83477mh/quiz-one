/* ============================================================
 * admin.js · 密码管理后台（Supabase 版）
 *
 * 生成 / 统计都走 site-config.js 里的 Supabase 配置，调用两个 RPC：
 *   admin_generate(count, max_uses, batch, admin_pw)
 *   admin_stats(admin_pw)
 *
 * 本地 localStorage 只存「展示 / 导出用」的台账，不存真实核销数据。
 * 真实核销在 Supabase 数据库里，靠 ③ 核销统计 实时读取。
 * ============================================================ */
(function () {
  'use strict';

  var CFG = (typeof window !== 'undefined' && window.SiteConfig) || {};
  var BASE = String(CFG.SUPABASE_URL || '').replace(/\/+$/, '');
  var ANON = CFG.SUPABASE_ANON_KEY || '';

  var BATCH_KEY = 'boundary_admin_batches_v1';
  var PW_KEY = 'boundary_admin_pw_v1';   // 仅本机记忆后台口令，方便下次自动填

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  var batches = [];   // 本地台账：{ id, createdAt, maxUses, codes, sent }

  /* ---------------- Supabase RPC ---------------- */
  function rpc(fn, body) {
    return fetch(BASE + '/rest/v1/rpc/' + fn, {
      method: 'POST',
      headers: { 'apikey': ANON, 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body || {})
    }).then(function (r) { return r.json().catch(function () { return null; }); });
  }

  /* ---------------- 存储（本地台账） ---------------- */
  function load() {
    try {
      var raw = localStorage.getItem(BATCH_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      batches = Array.isArray(arr) ? arr.filter(function (b) {
        return b && Array.isArray(b.codes);
      }) : [];
    } catch (e) { batches = []; }
  }
  function save() {
    try { localStorage.setItem(BATCH_KEY, JSON.stringify(batches)); return true; }
    catch (e) { toast('本机存储不可用，刷新后台账会丢失'); return false; }
  }

  var toastTimer = null;
  function toast(msg) {
    var el = $('toast');
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-on'); }, 2400);
  }

  function nowText() {
    var d = new Date();
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) +
      ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }
  function dateTag() {
    var d = new Date();
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return '' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate());
  }

  function nextBatchId() {
    var tag = dateTag();
    var n = 1;
    var used = {};
    batches.forEach(function (b) { used[b.id] = 1; });
    while (used['B' + tag + '-' + ('00' + n).slice(-3)]) n++;
    return 'B' + tag + '-' + ('00' + n).slice(-3);
  }

  function adminPw() {
    return String($('in-adminpw').value || '').trim();
  }

  /* ---------------- 生成 ---------------- */
  function generate() {
    var pw = adminPw();
    if (!pw) { $('adminpw-note').textContent = '先填后台口令才能生成。'; $('in-adminpw').focus(); return; }
    $('adminpw-note').textContent = '';
    var count = Math.max(1, Math.min(500, Number($('in-count').value) || 20));
    var uses = Math.max(1, Math.min(99, Number($('in-uses').value) || 3));
    var batchLabel = String($('in-batch').value || '').trim().slice(0, 24);
    var batchId = nextBatchId() + (batchLabel ? ' · ' + batchLabel : '');
    $('in-count').value = count;
    $('in-uses').value = uses;

    rpc('admin_generate', { p_count: count, p_max_uses: uses, p_batch: batchId, p_admin_pw: pw })
      .then(function (res) {
        if (!res || res.ok !== true) {
          if (res && res.reason === 'unauthorized') toast('后台口令不对');
          else toast('生成失败，检查 Supabase 配置');
          return;
        }
        var codes = (res.codes || []).map(function (c) { return String(c).toUpperCase(); });
        if (!codes.length) { toast('没有生成到密码，稍后重试'); return; }
        var batch = {
          id: batchId, createdAt: nowText(), maxUses: uses, codes: codes, sent: {}
        };
        batches.unshift(batch);
        save();
        renderBatches();
        renderPreview(batch);
        $('gen-note').textContent = '已生成 ' + codes.length + ' 个，已写入 Supabase，立刻生效。';
        toast('生成好了 ' + codes.length + ' 个密码');
      })
      .catch(function () { toast('网络出错，稍后重试'); });
  }

  function renderPreview(batch) {
    $('gen-preview').hidden = false;
    $('gen-count').textContent = '（' + batch.id + '，共 ' + batch.codes.length + ' 个）';
    $('gen-codes').innerHTML = batch.codes.map(function (c) {
      return '<span class="code">' + esc(c) + '</span>';
    }).join('');
  }

  /* ---------------- 批次列表 ---------------- */
  function renderBatches() {
    var box = $('batch-list');
    $('batch-empty').hidden = batches.length > 0;
    box.innerHTML = batches.map(function (b) {
      var sentCount = b.codes.filter(function (c) { return b.sent && b.sent[c]; }).length;
      var cells = b.codes.map(function (c) {
        var on = !!(b.sent && b.sent[c]);
        return '<label class="sent' + (on ? ' is-sent' : '') + '">' +
          '<input type="checkbox" data-sent="' + esc(c) + '" data-id="' + esc(b.id) + '"' + (on ? ' checked' : '') + '>' +
          '<span>' + esc(c) + '</span></label>';
      }).join('');
      return '<div class="batch">' +
        '<div class="batch__head">' +
          '<span class="batch__name">' + esc(b.id) + '</span>' +
          '<span class="batch__meta">' + esc(b.createdAt) + ' · ' + b.codes.length + ' 个 · 每个 ' +
            esc(b.maxUses || 3) + ' 次 · 已发出 ' + sentCount + '/' + b.codes.length + '</span>' +
          '<span class="batch__ops">' +
            '<button class="btn btn--soft btn--tiny" type="button" data-act="copy" data-id="' + esc(b.id) + '">复制密码</button>' +
            '<button class="btn btn--soft btn--tiny" type="button" data-act="txt" data-id="' + esc(b.id) + '">导出清单</button>' +
            '<button class="btn btn--soft btn--tiny" type="button" data-act="csv" data-id="' + esc(b.id) + '">导出 CSV</button>' +
            '<button class="btn btn--ghost btn--tiny" type="button" data-act="del" data-id="' + esc(b.id) + '">删除台账</button>' +
          '</span>' +
        '</div>' +
        '<div class="batch__body">' +
          '<div class="batch__tools">' +
            '<a data-act="sent-all" data-id="' + esc(b.id) + '">全部标为已发出</a>' +
            '<a data-act="sent-none" data-id="' + esc(b.id) + '">清空发出标记</a>' +
            '<span>勾一下只是记台账，不影响密码生效</span>' +
          '</div>' +
          '<div class="sent-grid">' + cells + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function findBatch(id) {
    for (var i = 0; i < batches.length; i++) if (batches[i].id === id) return batches[i];
    return null;
  }

  /* ---------------- 导出 ---------------- */
  function download(filename, content, mime) {
    var blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 30000);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.cssText = 'position:fixed;left:-9999px;opacity:0';
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error('copy failed'));
    });
  }

  function buyerTXT(b) {
    var lines = [
      '边界感测评 · 密码清单',
      '批次：' + b.id,
      '生成时间：' + b.createdAt,
      '每个密码可测 ' + (b.maxUses || 3) + ' 次',
      '',
      '怎么用：',
      '打开站长发给你的网址 → 输入下面的密码 → 开始测试。',
      '一个密码可以测 ' + (b.maxUses || 3) + ' 次，中途关掉页面再回来会接着答，不会多扣。',
      '请勿把密码转发给别人，用完就作废了。',
      '',
      '—— 密码清单 ——',
      ''
    ].concat(b.codes);
    return lines.join('\r\n') + '\r\n';
  }

  function buyerCSV(b) {
    var rows = [['批次', '密码', '可用次数', '是否已发放']];
    b.codes.forEach(function (c) {
      rows.push([b.id, c, String(b.maxUses || 3), (b.sent && b.sent[c]) ? '是' : '否']);
    });
    return '\ufeff' + rows.map(function (r) {
      return r.map(function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(',');
    }).join('\r\n') + '\r\n';
  }

  /* ---------------- 核销统计 ---------------- */
  function refreshStats() {
    var pw = adminPw();
    if (!pw) { toast('先填后台口令才能看统计'); return; }
    rpc('admin_stats', { p_admin_pw: pw })
      .then(function (res) {
        if (!res || res.ok !== true) {
          if (res && res.reason === 'unauthorized') toast('后台口令不对');
          else toast('读取统计失败');
          return;
        }
        var data = res.data || [];
        if (!data.length) {
          $('stats-note').textContent = '还没有任何密码记录。';
          $('stats-box').hidden = true;
          return;
        }
        $('stats-rows').innerHTML = data.map(function (d) {
          return '<div class="stats__row">' +
            '<span>' + esc(d.batch_id || '（未分组）') + '</span>' +
            '<span>' + (d.total || 0) + '</span>' +
            '<span>' + (d.exhausted || 0) + '</span>' +
            '<span>' + (d.used_total || 0) + '</span>' +
          '</div>';
        }).join('');
        $('stats-box').hidden = false;
        $('stats-note').textContent = '已加载 ' + data.length + ' 个批次。';
      })
      .catch(function () { toast('网络出错，稍后重试'); });
  }

  /* ---------------- 连接状态 ---------------- */
  function checkConn() {
    var dot = $('conn-dot'), text = $('conn-text');
    if (!BASE || !ANON) {
      dot.classList.remove('is-ok');
      text.innerHTML = '<strong>还没配置</strong>：打开 <code>site-config.js</code>，填入 SUPABASE_URL 和 SUPABASE_ANON_KEY。';
      return;
    }
    dot.classList.add('is-ok');
    text.innerHTML = '已连上 Supabase：<strong>' + esc(BASE.replace(/^https?:\/\//, '')) + '</strong>';
  }

  /* ---------------- 事件 ---------------- */
  function onAction(e) {
    var t = e.target;
    var id = t.getAttribute && t.getAttribute('data-id');
    var act = t.getAttribute && t.getAttribute('data-act');
    var b = id ? findBatch(id) : null;

    if (t.getAttribute && t.getAttribute('data-sent') !== null && t.type === 'checkbox') {
      var code = t.getAttribute('data-sent');
      if (b) {
        b.sent = b.sent || {};
        if (t.checked) b.sent[code] = true; else delete b.sent[code];
        save(); renderBatches();
      }
      return;
    }
    if (!act || !b) return;

    if (act === 'copy') {
      copyText(b.codes.join('\n')).then(function () { toast('已复制 ' + b.codes.length + ' 个密码'); })
        .catch(function () { toast('复制没成功，请用「导出清单」'); });
    } else if (act === 'txt') {
      download('密码清单-' + b.id + '.txt', buyerTXT(b), 'text/plain;charset=utf-8');
      toast('清单已下载，可直接发给买家');
    } else if (act === 'csv') {
      download('密码台账-' + b.id + '.csv', buyerCSV(b), 'text/csv;charset=utf-8');
      toast('CSV 已下载');
    } else if (act === 'del') {
      if (!window.confirm('确定从本地台账删除批次 ' + b.id + ' 吗？\n注意：数据库里的密码不会被删，只是这台电脑上看不到了。')) return;
      batches = batches.filter(function (x) { return x.id !== b.id; });
      save(); renderBatches();
      toast('本地台账已删除（云端密码仍有效）');
    } else if (act === 'sent-all' || act === 'sent-none') {
      b.sent = {};
      if (act === 'sent-all') b.codes.forEach(function (c) { b.sent[c] = true; });
      save(); renderBatches();
    }
  }

  function init() {
    // 记住后台口令，刷新不丢（仅本机）
    try {
      var saved = localStorage.getItem(PW_KEY);
      if (saved) $('in-adminpw').value = saved;
    } catch (e) {}
    $('in-adminpw').addEventListener('input', function () {
      try { localStorage.setItem(PW_KEY, $('in-adminpw').value); } catch (e) {}
    });

    load();
    renderBatches();
    checkConn();

    $('btn-generate').addEventListener('click', generate);
    $('btn-stats').addEventListener('click', refreshStats);
    $('batch-list').addEventListener('click', onAction);
    $('batch-list').addEventListener('change', onAction);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
