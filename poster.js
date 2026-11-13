/* ============================================================
 * poster.js · 用原生 Canvas 生成分享长图
 * 不依赖任何第三方库：离线可用、file:// 可用、移动端不挑跨域字体
 * 输出尺寸 = 750 × 动态高度（逻辑像素），按 2 倍像素密度导出
 * ============================================================ */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Poster = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var W = 750;
  var PAD = 56;
  var INNER = W - PAD * 2;
  /* iOS Safari 对 canvas 单边有约 4096 上限，超了 toBlob 会产出空白图。
     因此按内容高度动态降采样：优先 1.5 倍清晰度，长图自动压到 1 倍，
     保证最长的一份结果在 iPhone 上也能正常保存。 */
  var MAX_DPR = 1.5;
  var MAX_EDGE = 4000;

  var C = {
    bg: '#FBF7F2',
    surface: '#FFFFFF',
    ink: '#2C2C2A',
    ink2: '#6B645C',
    ink3: '#9A9088',
    brand: '#8C4A5A',
    deep: '#72243E',
    soft: '#F6E9EC',
    line: '#E8DCCB',
    track: '#F0E7DA'
  };
  var F = {
    sans: '-apple-system, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif',
    serif: '"Songti SC", "Noto Serif CJK SC", "STSong", serif',
    emoji: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
  };
  function font(size, weight, family) {
    return (weight ? weight + ' ' : '') + size + 'px ' + (family || F.sans);
  }

  /* 中文逐字断行 */
  function wrap(ctx, text, maxW, f) {
    ctx.font = f;
    var out = [], cur = '';
    var chars = Array.from(String(text || ''));
    for (var i = 0; i < chars.length; i++) {
      var ch = chars[i];
      if (ch === '\n') { out.push(cur); cur = ''; continue; }
      if (cur && ctx.measureText(cur + ch).width > maxW) { out.push(cur); cur = ch; }
      else cur += ch;
    }
    if (cur) out.push(cur);
    return out;
  }

  function para(ctx, text, x, y, maxW, lh, f, color) {
    var arr = wrap(ctx, text, maxW, f);
    ctx.font = f; ctx.fillStyle = color; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    for (var i = 0; i < arr.length; i++) ctx.fillText(arr[i], x, y + i * lh);
    return y + arr.length * lh;
  }

  function roundRect(ctx, x, y, w, h, r, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); }
  }

  function line(ctx, x1, y1, x2, y2, color, width) {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.strokeStyle = color; ctx.lineWidth = width || 1.5; ctx.stroke();
  }

  /* 由若干 section 组成；每个 section 先用测量 ctx 算高度，再用最终 ctx 绘制 */
  function makeSections(r, mctx) {
    var sections = [];
    var bodyF = font(27, 400);
    var bodyLH = 46;

    /* 1 · 页眉 */
    sections.push({
      gap: 30,
      h: 62,
      paint: function (ctx, y) {
        ctx.font = font(21, 400); ctx.fillStyle = C.ink3;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('趣味测评 · 你的边界感', PAD, y);
        ctx.textAlign = 'right';
        ctx.fillText('VOL.01', W - PAD, y);
        ctx.textAlign = 'left';
        line(ctx, PAD, y + 40, W - PAD, y + 40, C.line, 1.5);
      }
    });

    /* 2 · 身份 */
    sections.push({
      gap: 34,
      h: 218,
      paint: function (ctx, y) {
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.font = font(76, 400, F.emoji); ctx.fillStyle = C.ink;
        ctx.fillText(r.archetype.emoji, W / 2, y);
        ctx.font = font(60, 600, F.serif); ctx.fillStyle = C.ink;
        ctx.fillText(r.archetype.name, W / 2, y + 88);
        ctx.font = font(23, 400); ctx.fillStyle = C.ink2;
        ctx.fillText(r.archetype.dims, W / 2, y + 164);
        ctx.font = font(28, 400, F.serif); ctx.fillStyle = C.deep;
        ctx.fillText('—— ' + r.archetype.tagline, W / 2, y + 196);
        ctx.textAlign = 'left';
      }
    });

    /* 3 · 六维数据卡 */
    var barH = 62;
    var cardH = 76 + r.axisBars.length * barH + 24;
    sections.push({
      gap: 26,
      h: cardH,
      paint: function (ctx, y) {
        roundRect(ctx, PAD, y, INNER, cardH, 22, C.surface, C.line);
        ctx.font = font(20, 400); ctx.fillStyle = C.ink3;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('六 维 读 数', PAD + 30, y + 28);
        var by = y + 76;
        r.axisBars.forEach(function (b) {
          ctx.font = font(22, 400); ctx.fillStyle = C.ink;
          ctx.fillText(b.emoji + ' ' + b.name, PAD + 30, by);
          ctx.textAlign = 'right'; ctx.fillStyle = C.deep;
          ctx.fillText(String(b.percent), W - PAD - 30, by);
          ctx.textAlign = 'left';
          roundRect(ctx, PAD + 30, by + 32, INNER - 60, 9, 5, C.track);
          if (b.percent > 0) {
            roundRect(ctx, PAD + 30, by + 32, Math.max(9, (INNER - 60) * b.percent / 100), 9, 5, C.brand);
          }
          by += barH;
        });
      }
    });

    /* 4 · 稀有度 / 副刻度 */
    var metaText = r.rarity.level + '级 · 拒绝成本：' + r.costBand.name;
    sections.push({
      gap: 30,
      h: 54,
      paint: function (ctx, y) {
        ctx.font = font(23, 400); ctx.fillStyle = C.ink2;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(metaText, W / 2, y + 8);
        ctx.textAlign = 'left';
      }
    });

    /* 5 · 扎心盲区 */
    var bsF = font(32, 600, F.serif);
    var bsLines = wrap(mctx, r.profile.blindspot, INNER - 76, bsF);
    var bsH = 86 + bsLines.length * 52;
    sections.push({
      gap: 30,
      h: bsH,
      paint: function (ctx, y) {
        roundRect(ctx, PAD, y, INNER, bsH, 18, C.soft);
        roundRect(ctx, PAD, y, 7, bsH, 3, C.brand);
        ctx.font = font(20, 400); ctx.fillStyle = C.deep;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('扎 心 盲 区', PAD + 34, y + 28);
        ctx.font = bsF; ctx.fillStyle = C.ink;
        bsLines.forEach(function (ln, i) {
          ctx.fillText(ln, PAD + 34, y + 70 + i * 52);
        });
      }
    });

    /* 6 · 核心解读 */
    var readingParts = String(r.profile.reading).split(/\n\n/).filter(Boolean);
    var readLines = [];
    readingParts.forEach(function (p, i) {
      wrap(mctx, p, INNER - 60, bodyF).forEach(function (ln) { readLines.push(ln); });
      if (i < readingParts.length - 1) readLines.push('');
    });
    var readH = 74 + readLines.length * bodyLH + 26;
    sections.push({
      gap: 26,
      h: readH,
      paint: function (ctx, y) {
        roundRect(ctx, PAD, y, INNER, readH, 22, C.surface, C.line);
        ctx.font = font(27, 600, F.serif); ctx.fillStyle = C.deep;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('你是什么样的', PAD + 30, y + 28);
        ctx.font = bodyF; ctx.fillStyle = C.ink;
        readLines.forEach(function (ln, i) {
          if (ln) ctx.fillText(ln, PAD + 30, y + 78 + i * bodyLH);
        });
      }
    });

    /* 7 · 行为机制 */
    var mechLines = wrap(mctx, r.profile.mechanism, INNER - 60, bodyF);
    var mechH = 74 + mechLines.length * bodyLH + 22;
    sections.push({
      gap: 26,
      h: mechH,
      paint: function (ctx, y) {
        roundRect(ctx, PAD, y, INNER, mechH, 22, C.surface, C.line);
        ctx.font = font(27, 600, F.serif); ctx.fillStyle = C.deep;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('为什么会这样', PAD + 30, y + 28);
        ctx.font = bodyF; ctx.fillStyle = C.ink;
        mechLines.forEach(function (ln, i) { ctx.fillText(ln, PAD + 30, y + 78 + i * bodyLH); });
      }
    });

    /* 8 · 两条建议 */
    var howto = String(r.profile.howto).split(/(?=[①②])/).filter(Boolean);
    var howLines = [];
    howto.forEach(function (t) { wrap(mctx, t, INNER - 66, bodyF).forEach(function (ln) { howLines.push(ln); }); });
    var howH = 74 + howLines.length * bodyLH + 22;
    sections.push({
      gap: 30,
      h: howH,
      paint: function (ctx, y) {
        roundRect(ctx, PAD, y, INNER, howH, 22, C.soft);
        ctx.font = font(27, 600, F.serif); ctx.fillStyle = C.deep;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('两句可以今天就试的话', PAD + 30, y + 28);
        ctx.font = bodyF; ctx.fillStyle = C.ink;
        howLines.forEach(function (ln, i) { ctx.fillText(ln, PAD + 30, y + 78 + i * bodyLH); });
      }
    });

    /* 9 · 分享钩子 + 免责 */
    var hookF = font(30, 600, F.serif);
    var disclaimerLines = wrap(mctx, r.compliance, INNER - 20, font(19, 400));
    var footH = 60 + 52 + 24 + disclaimerLines.length * 32 + 52;
    sections.push({
      gap: 0,
      h: footH,
      paint: function (ctx, y) {
        line(ctx, PAD, y, W - PAD, y, C.line, 1.5);
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.font = hookF; ctx.fillStyle = C.deep;
        ctx.fillText(r.profile.shareHook, W / 2, y + 30);
        ctx.font = font(22, 400); ctx.fillStyle = C.ink2;
        ctx.fillText('你也来测测，看自己是哪种门', W / 2, y + 92);
        ctx.font = font(19, 400); ctx.fillStyle = C.ink3;
        ctx.textAlign = 'left';
        disclaimerLines.forEach(function (ln, i) { ctx.fillText(ln, PAD + 10, y + 140 + i * 32); });
      }
    });

    return sections;
  }

  function create(r) {
    var measure = document.createElement('canvas').getContext('2d');
    var sections = makeSections(r, measure);
    var topPad = 52, bottomPad = 52, H = topPad;
    sections.forEach(function (s) { H += s.h + s.gap; });
    H += bottomPad;

    var dpr = Math.max(1, Math.min(MAX_DPR, Math.floor((MAX_EDGE / H) * 100) / 100));
    var canvas = document.createElement('canvas');
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, W, H);

    var y = topPad;
    sections.forEach(function (s) { s.paint(ctx, y); y += s.h + s.gap; });
    return canvas;
  }

  function toBlob(canvas) {
    return new Promise(function (resolve, reject) {
      if (canvas.toBlob) {
        canvas.toBlob(function (blob) { blob ? resolve(blob) : reject(new Error('toBlob 失败')); }, 'image/png');
      } else {
        try { resolve(dataURLToBlob(canvas.toDataURL('image/png'))); }
        catch (e) { reject(e); }
      }
    });
  }

  function dataURLToBlob(dataURL) {
    var parts = dataURL.split(',');
    var bin = atob(parts[1]);
    var arr = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: 'image/png' });
  }

  return { create: create, toBlob: toBlob, WIDTH: W, MAX_DPR: MAX_DPR, MAX_EDGE: MAX_EDGE };
});
