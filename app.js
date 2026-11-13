/* ============================================================
 * app.js · 流程控制
 * 密码门禁 → 20 题逐题作答（可返回） → 结果页（长图 / 链接 / 再测一次）
 * ============================================================ */
(function () {
  'use strict';

  var Q = QuizData.Q;
  var MAP = QuizData.MAP;
  var score = QuizData.score;
  var A = Access;
  var TOTAL = Q.questions.length;
  var LABELS = ['A', 'B', 'C', 'D'];

  var S = {
    idx: 0,
    answers: {},
    key: null,
    result: null,
    shared: false,
    sharedAnswers: '',
    posterUrl: null,
    posterBlob: null
  };

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };
  var paras = function (text) {
    return String(text || '').split(/\n\n/).filter(Boolean)
      .map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
  };

  function show(id) {
    ['screen-gate', 'screen-quiz', 'screen-result'].forEach(function (s) {
      $(s).classList.toggle('is-active', s === id);
    });
    $(id).scrollTop = 0;
  }

  var toastTimer = null;
  function toast(msg) {
    var el = $('toast');
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-on'); }, 2400);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;left:-9999px;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error('copy failed'));
    });
  }

  /* ---------------- 分享链接：只带 20 个选项编号 ---------------- */
  function encodeAnswers(answers) {
    return Q.questions.map(function (q) {
      var v = answers[q.id];
      return (typeof v === 'number' && v >= 0 && v <= 3) ? String(v) : '0';
    }).join('');
  }
  function decodeAnswers(s) {
    if (!/^[0-3]{20}$/.test(s)) return null;
    var a = {};
    Q.questions.forEach(function (q, i) { a[q.id] = Number(s.charAt(i)); });
    return a;
  }
  function shareURL() {
    var bits = S.shared ? S.sharedAnswers : encodeAnswers(S.answers);
    return location.href.split('#')[0] + '#a=' + bits;
  }

  function readHash() {
    var m = location.hash.match(/^#a=([0-3]{20})$/);
    return m ? m[1] : null;
  }

  /* ---------------- 屏 1 · 密码 ---------------- */
  function setHint(text, kind) {
    var el = $('gate-hint');
    el.textContent = text;
    el.className = 'gate__hint' + (kind ? ' is-' + kind : '');
  }

  function resumeSession(session) {
    S.key = session.key;
    S.answers = session.answers || {};
    S.idx = Math.min(TOTAL - 1, Math.max(0, Number(session.idx) || 0));
    S.shared = false;
    show('screen-quiz');
    renderQuestion();
  }

  function beginFresh(key) {
    S.key = key;
    S.answers = {};
    S.idx = 0;
    S.shared = false;
    A.saveSession({ key: key, answers: {}, idx: 0 });
    show('screen-quiz');
    renderQuestion();
  }

  function start() {
    var code = $('code').value;
    A.verify(code).then(function (v) {
      if (!v.ok) {
        setHint(v.reason === 'empty' ? '先输入密码再开始吧。' : '这个密码不对，再检查一下？', 'error');
        return;
      }
      var session = A.getSession();
      if (session && session.key === v.key && Object.keys(session.answers || {}).length < TOTAL) {
        setHint('接着上次继续，不额外扣次数。', 'ok');
        resumeSession(session);
        return;
      }
      if ((v.remaining || 0) <= 0) {
        setHint('这个密码的次数已经用完了，换一个试试。', 'error');
        return;
      }
      A.consume(v.key).then(function (used) {
        if (!used.ok) {
          setHint('次数用完了，换一个密码试试。', 'error');
          return;
        }
        setHint('开始吧，还剩 ' + used.remaining + ' 次。', 'ok');
        beginFresh(v.key);
      });
    }).catch(function () {
      setHint('网络好像有点问题，稍后再试一次。', 'error');
    });
  }

  /* ---------------- 屏 2 · 答题 ---------------- */
  function renderQuestion() {
    var q = Q.questions[S.idx];
    var dim = Q.dimensions.find(function (d) { return d.id === q.dim; });
    $('quiz-count').textContent = (S.idx + 1) + ' / ' + TOTAL;
    $('progress-bar').style.width = ((S.idx + 1) / TOTAL * 100) + '%';
    $('quiz-dim').textContent = dim.emoji + ' ' + dim.name;
    $('quiz-q').textContent = q.text;
    $('btn-back').disabled = S.idx === 0;

    var picked = S.answers[q.id];
    $('options').innerHTML = q.options.map(function (o, i) {
      return '<button class="option' + (picked === i ? ' is-picked' : '') + '" type="button" data-i="' + i + '">' +
        '<span class="option__key">' + LABELS[i] + '</span><span>' + esc(o) + '</span></button>';
    }).join('');

    Array.prototype.forEach.call($('options').querySelectorAll('.option'), function (btn) {
      btn.addEventListener('click', function () { choose(Number(btn.getAttribute('data-i'))); });
    });
  }

  var advancing = false;
  function choose(i) {
    if (advancing) return;
    advancing = true;
    var q = Q.questions[S.idx];
    S.answers[q.id] = i;
    A.saveSession({ key: S.key, answers: S.answers, idx: S.idx });

    Array.prototype.forEach.call($('options').querySelectorAll('.option'), function (btn) {
      btn.classList.toggle('is-picked', Number(btn.getAttribute('data-i')) === i);
    });

    setTimeout(function () {
      advancing = false;
      if (S.idx < TOTAL - 1) {
        S.idx += 1;
        A.saveSession({ key: S.key, answers: S.answers, idx: S.idx });
        renderQuestion();
        $('screen-quiz').scrollTop = 0;
      } else {
        finish();
      }
    }, 240);
  }

  function prev() {
    if (S.idx === 0) return;
    S.idx -= 1;
    A.saveSession({ key: S.key, answers: S.answers, idx: S.idx });
    renderQuestion();
    $('screen-quiz').scrollTop = 0;
  }

  function finish() {
    var r = score(S.answers);
    if (!r.ok) {
      toast('还有 ' + r.missing.length + ' 题没答完，回去补一下');
      S.idx = Q.questions.findIndex(function (q) { return q.id === r.missing[0]; });
      renderQuestion();
      return;
    }
    A.clearSession();
    S.result = r;
    S.shared = false;
    renderResult(r, false);
    show('screen-result');
  }

  /* ---------------- 屏 3 · 结果 ---------------- */
  function barHTML(r) {
    return r.axisBars.map(function (b) {
      return '<div class="bar">' +
        '<div class="bar__head"><span class="bar__name">' + esc(b.emoji + ' ' + b.name) +
        (b.side === 'neutral' ? '（中性）' : '') + '</span>' +
        '<span class="bar__num">' + b.percent + '</span></div>' +
        '<div class="bar__track"><div class="bar__fill" style="width:' + b.percent + '%"></div></div>' +
        '<div class="bar__labels"><span>' + esc(b.left) + '</span><span>' + esc(b.right) + '</span></div>' +
        '</div>';
    }).join('');
  }

  function shareCards(r) {
    var list = [
      { label: '极简卡 · 随手截图', text: r.shareBlocks.minimal },
      { label: '完整卡 · 群聊主力', text: r.shareBlocks.full },
      { label: '对战卡 · 找人对答案', text: r.shareBlocks.battle }
    ];
    return list.map(function (c, i) {
      return '<div class="sharecard"><div class="sharecard__head">' +
        '<span class="sharecard__label">' + esc(c.label) + '</span>' +
        '<button class="sharecard__copy" type="button" data-copy="' + i + '">复制</button></div>' +
        '<pre>' + esc(c.text) + '</pre></div>';
    }).join('');
  }

  function renderResult(r, shared) {
    var a = r.archetype;
    var howto = String(r.profile.howto).split(/(?=[①②])/).filter(Boolean)
      .map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');

    var html = '' +
      (shared
        ? '<div class="result__banner"><span>这是朋友分享的结果</span><button type="button" id="btn-try-mine">我也测一次 →</button></div>'
        : '') +
      '<div class="result">' +
        '<div class="identity">' +
          '<div class="identity__emoji">' + esc(a.emoji) + '</div>' +
          '<div class="identity__name">' + esc(a.name) + '</div>' +
          '<div class="identity__dims">' + esc(a.dims) + '</div>' +
          '<div class="identity__tag">—— ' + esc(a.tagline) + '</div>' +
          (a.ambiguous ? '<div class="identity__ambiguous">你的两轴都靠近中间，这类人本来就不好归类' +
            (a.runnerUp ? '（和' + esc(a.runnerUp.name) + '挨得很近）' : '') + '。</div>' : '') +
        '</div>' +

        '<div class="datacard">' +
          '<div class="datacard__title">六 维 读 数</div>' +
          barHTML(r) +
          '<div class="datacard__meta">' +
            '<span>' + esc(r.rarity.level) + '级</span>' +
            '<span>拒绝成本：' + esc(r.costBand.name) + '</span>' +
          '</div>' +
        '</div>' +

        '<div class="blindspot">' +
          '<div class="blindspot__label">扎 心 盲 区</div>' +
          '<p class="blindspot__text">' + esc(r.profile.blindspot) + '</p>' +
        '</div>' +

        '<div class="block"><h3 class="block__title">你是什么样的</h3>' + paras(r.profile.reading) + '</div>' +
        '<div class="block"><h3 class="block__title">为什么会这样 <span>行为机制</span></h3>' + paras(r.profile.mechanism) + '</div>' +
        '<div class="block"><h3 class="block__title">顺手懂一点 <span>理论依据</span></h3>' + paras(r.profile.theory) + '</div>' +
        '<div class="block"><h3 class="block__title">善后代价</h3>' + paras(r.profile.aftermath) + '</div>' +
        '<div class="block"><h3 class="block__title">社交代价</h3>' + paras(r.profile.socialStyle) + paras(r.profile.socialCost) + '</div>' +
        '<div class="block"><h3 class="block__title">你的两个读数，分开看</h3>' +
          '<p>' + esc(r.crossInsight) + '</p>' +
          '<p class="muted">' + esc(r.costBand.insight) + '</p>' +
        '</div>' +
        '<div class="block"><h3 class="block__title">两句今天就能试的话</h3><ul class="howto">' + howto + '</ul></div>' +

        '<div class="sharebox">' +
          '<div class="sharebox__title">可以直接复制发出去</div>' +
          shareCards(r) +
        '</div>' +

        '<div class="actions">' +
          '<button class="btn btn--primary" id="btn-save" type="button">保存结果为长图</button>' +
          '<div class="actions__row">' +
            '<button class="btn btn--ghost" id="btn-copy" type="button">复制结果链接</button>' +
            '<button class="btn btn--soft" id="btn-again" type="button">' + (shared ? '我也测一次' : '再测一次') + '</button>' +
          '</div>' +
        '</div>' +

        '<div class="disclaimer">' +
          '<p><strong>稀有度</strong>：' + esc(r.rarity.note) + '</p>' +
          '<p>' + esc(r.theoryDisclaimer) + '</p>' +
          '<p>' + esc(r.compliance) + '</p>' +
        '</div>' +
      '</div>';

    $('result-root').innerHTML = html;
    bindResult(r, shared);
  }

  function bindResult(r, shared) {
    $('btn-save').addEventListener('click', function () { savePoster(r); });
    $('btn-copy').addEventListener('click', function () {
      copyText(shareURL()).then(function () {
        toast('链接复制好了，发给朋友就能直接看结果');
      }).catch(function () {
        toast('复制没成功，长按地址栏手动复制一下');
      });
    });
    $('btn-again').addEventListener('click', function () { again(shared); });
    if (shared) {
      $('btn-try-mine').addEventListener('click', function () {
        history.replaceState(null, '', location.pathname + location.search);
        location.hash = '';
        showGate();
      });
    }
    Array.prototype.forEach.call(document.querySelectorAll('.sharecard__copy'), function (btn) {
      btn.addEventListener('click', function () {
        var i = Number(btn.getAttribute('data-copy'));
        var text = [r.shareBlocks.minimal, r.shareBlocks.full, r.shareBlocks.battle][i];
        copyText(text).then(function () { toast('复制好了，去群里发吧'); })
          .catch(function () { toast('复制没成功，长按文字选中复制'); });
      });
    });
  }

  function again(shared) {
    if (shared) {
      history.replaceState(null, '', location.pathname + location.search);
      showGate();
      return;
    }
    A.clearSession();
    var key = S.key;
    if (!key) { showGate(); return; }
    A.consume(key).then(function (used) {
      if (!used.ok) {
        toast('这个密码的 3 次用完了，换一个吧');
        showGate();
        return;
      }
      toast('开始新一轮，还剩 ' + used.remaining + ' 次');
      beginFresh(key);
    }).catch(function () {
      toast('网络好像有点问题，稍后再试一次。');
    });
  }

  function showGate() {
    S.shared = false;
    S.result = null;
    var session = A.getSession();
    var canResume = session && Object.keys(session.answers || {}).length > 0
      && Object.keys(session.answers || {}).length < TOTAL;
    $('btn-resume').hidden = !canResume;
    if (canResume) {
      $('btn-resume').onclick = function () { resumeSession(session); };
    }
    setHint('一个密码可以测 3 次。');
    show('screen-gate');
  }

  /* ---------------- 长图保存 ---------------- */
  var IS_MOBILE = /Android|iPhone|iPad|iPod|Mobile|HarmonyOS/i.test(navigator.userAgent) ||
    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

  function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
  }

  function savePoster(r) {
    var btn = $('btn-save');
    btn.disabled = true;
    btn.textContent = '正在生成长图…';
    setTimeout(function () {
      try {
        var canvas = Poster.create(r);
        Poster.toBlob(canvas).then(function (blob) {
          S.posterBlob = blob;
          var url = URL.createObjectURL(blob);
          S.posterUrl = url;
          $('poster-img').src = url;
          $('poster-tip').textContent = IS_MOBILE
            ? '长按图片 → 保存到相册'
            : '已为你下载，也可以点下面再存一次';
          $('poster-overlay').hidden = false;

          var filename = '边界感测评-' + r.archetype.name + '.png';
          if (!IS_MOBILE) downloadBlob(blob, filename);

          var shareBtn = $('btn-poster-share');
          shareBtn.hidden = true;
          try {
            var file = new File([blob], filename, { type: 'image/png' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              shareBtn.hidden = false;
              shareBtn.onclick = function () {
                navigator.share({ files: [file], title: '我的边界感测评结果' })
                  .catch(function () { /* 用户取消，不提示 */ });
              };
            }
          } catch (e) { /* 老浏览器没有 File，忽略 */ }

          btn.disabled = false;
          btn.textContent = '保存结果为长图';
        }).catch(function (err) {
          btn.disabled = false;
          btn.textContent = '保存结果为长图';
          toast('图片生成失败，换个浏览器试试');
          console.error(err);
        });
      } catch (err) {
        btn.disabled = false;
        btn.textContent = '保存结果为长图';
        toast('图片生成失败，换个浏览器试试');
        console.error(err);
      }
    }, 30);
  }

  function closePoster() {
    $('poster-overlay').hidden = true;
    if (S.posterUrl) {
      URL.revokeObjectURL(S.posterUrl);
      S.posterUrl = null;
    }
    $('poster-img').removeAttribute('src');
  }

  /* ---------------- 初始化 ---------------- */
  function init() {
    var bits = readHash();
    if (bits) {
      var answers = decodeAnswers(bits);
      if (answers) {
        var r = score(answers);
        if (r.ok) {
          S.shared = true;
          S.sharedAnswers = bits;
          S.result = r;
          renderResult(r, true);
          show('screen-result');
          return;
        }
      }
    }

    $('btn-start').addEventListener('click', start);
    $('code').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); start(); }
    });
    $('btn-back').addEventListener('click', prev);
    $('btn-poster-close').addEventListener('click', closePoster);
    $('btn-poster-download').addEventListener('click', function () {
      if (!S.posterBlob) return;
      var name = S.result ? S.result.archetype.name : '结果';
      downloadBlob(S.posterBlob, '边界感测评-' + name + '.png');
      toast(IS_MOBILE ? '已触发下载，也可以长按图片保存' : '图片已保存');
    });

    showGate();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
