/* 自动生成，请勿手改。改题库请编辑 references/*.json 后运行 node scripts/build-site-data.js */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.QuizData = api;
})(typeof self !== 'undefined' ? self : this, function () {
  var Q = {
  "testId": "boundary",
  "title": "你的边界感，是门帘还是院墙",
  "intro": "20 个生活里真会碰上的场景，选你当时最可能干的那一件。别选「应该怎么做」，就选你真会怎么做的。",
  "scale": {
    "type": "scenario",
    "optionCount": 4,
    "answerHint": "选你真会干的那个，别选应该怎么做",
    "optionLabels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "note": "每个选项在设计层同时标注三个读数：门槛高度 / 切换弹性 / 拒绝成本。这组标注不显示给答题者。"
  },
  "designNote": {
    "structure": "20 题 × 4 维度 × 5 题；两个主轴决定型号，一个副刻度只进解读不进分型。",
    "weightEncoding": "weights 为 4 个三元数组，顺序对应 A/B/C/D；每组为 [门槛高度, 切换弹性, 拒绝成本]，各取值 0..3。",
    "prototypeOptions": {
      "T0": "全开·恒定 [0,0,c]：直接答应或直接说，不挑人、不设条件",
      "T1": "立规矩·恒定 [3,0,c]：明确挡回去或讲清条件，对谁都这一套",
      "T2": "软帘·可调 [1,3,c]：先接住、含糊过去、留余地，随场合收放",
      "T3": "认人·可调 [2,3,c]：分人分关系，熟的进、不熟的挡"
    },
    "antiPattern": "四类选项的出现顺序按题号轮换（4 种排列循环），避免答题者发现「A 永远是好说话」并顺着选。",
    "costIndependence": "拒绝成本按与原型顺序错开的独立序列分配（20 题的成本排列周期与原型排列周期互质），四类做法各自都能落在 0..3 的任一成本值上。这样「会不会挡」和「挡完累不累」才是两个独立读数：会挡的人也可能挡完内耗两小时，不挡的人也可能完全不反刍。自检脚本会验证这条非共线性。",
    "validity": "本结构保证的是维度可追溯、计分确定、同份作答结果一致、分型不塌缩；不提供心理测量学意义上的常模、信度或效度，见设计文档「关于科学性」一节。"
  },
  "dimensions": [
    {
      "id": "time",
      "name": "时间边界",
      "emoji": "⏰",
      "leftLabel": "随叫随到",
      "rightLabel": "先说清楚",
      "items": 5,
      "probe": "已经安排好的时间，能不能被临时占用"
    },
    {
      "id": "info",
      "name": "信息边界",
      "emoji": "🔒",
      "leftLabel": "问了就答",
      "rightLabel": "选择性说",
      "items": 5,
      "probe": "收入、感情、身体、住处这些私事，谁可以问到哪一步"
    },
    {
      "id": "emotion",
      "name": "情绪边界",
      "emoji": "🫧",
      "leftLabel": "替人接住",
      "rightLabel": "听完归位",
      "items": 5,
      "probe": "别人的情绪要不要由我来消化"
    },
    {
      "id": "space",
      "name": "空间与钱",
      "emoji": "🧧",
      "leftLabel": "拿去用吧",
      "rightLabel": "先问一声",
      "items": 5,
      "probe": "我的东西、地盘和账，别人能不能不打招呼就动"
    }
  ],
  "axes": [
    {
      "id": "threshold",
      "name": "门槛高度",
      "emoji": "🚪",
      "left": "低·好进",
      "right": "高·挡得住",
      "desc": "你让多少人、多少事进入你的时间、信息和情绪"
    },
    {
      "id": "flex",
      "name": "切换弹性",
      "emoji": "🔄",
      "left": "恒定·一套规则",
      "right": "可调·看人看场合",
      "desc": "你的规矩是对所有人一样，还是随关系远近切换"
    }
  ],
  "subScale": {
    "id": "cost",
    "name": "拒绝成本",
    "emoji": "🪞",
    "desc": "为一次「不」或一次「勉强答应」付的心理账，不参与分型，只进解读",
    "bands": [
      {
        "id": "light",
        "max": 33,
        "name": "说完就放下"
      },
      {
        "id": "medium",
        "max": 66,
        "name": "闷一小会儿"
      },
      {
        "id": "heavy",
        "max": 100,
        "name": "自己复盘两小时"
      }
    ]
  },
  "thresholds": {
    "axisMid": 50,
    "ambiguousBand": 8,
    "note": "两轴归一化到 0..100；>=50 判高/可调，<50 判低/恒定。两轴都落在 42..58 时标记 ambiguous（不好归类），仍给主型但附说明。"
  },
  "rarity": {
    "calibrated": false,
    "levels": [
      "常见",
      "少见",
      "稀有"
    ],
    "note": "稀有度档位为占位值，尚未经真实数据校准，不承诺具体比例，输出中禁止出现百分比数字。",
    "rule": "按两轴偏离中点的总强度分档，纯占位，不代表人群真实分布"
  },
  "questions": [
    {
      "id": "b01",
      "dim": "time",
      "probe": "非工作时间被临时派活",
      "text": "周五晚上九点多，工作群突然 @ 你：「这个明早能出吗？」可这事本来就没排给你。",
      "options": [
        "「我看看哈」——然后真就开电脑了，弄完才睡",
        "「周一上午给你。」句号，没有下文",
        "先回「我看看手头，晚点给你准信儿」，把这事挪到第二天再说",
        "得看谁 @ 的。领导发的就起来弄，别的组先问一句「急吗」"
      ],
      "weights": [
        [
          0,
          0,
          3
        ],
        [
          3,
          0,
          0
        ],
        [
          1,
          3,
          2
        ],
        [
          2,
          3,
          1
        ]
      ]
    },
    {
      "id": "b02",
      "dim": "time",
      "probe": "久不联系的人临时占用周末",
      "text": "周末下午刚要出门，好久没联系的人发来一句「在吗，想找你聊聊」。",
      "options": [
        "回「在呀，咋啦」，先接上，聊到哪儿算哪儿",
        "直接把下午空出来，约他说",
        "看是谁吧。能聊的那几个我秒回，别人晚点再说",
        "「今天不太方便，改天约～」——我基本都这么回"
      ],
      "weights": [
        [
          1,
          3,
          2
        ],
        [
          0,
          0,
          1
        ],
        [
          2,
          3,
          3
        ],
        [
          3,
          0,
          0
        ]
      ]
    },
    {
      "id": "b03",
      "dim": "time",
      "probe": "集体活动撞上已有安排",
      "text": "部门聚餐定周五晚上，可你那天早跟人约好了。",
      "options": [
        "「周五有安排了，下次叫我哈」——就这一句",
        "先看看谁组的、有没有非到不可的人，再定去不去",
        "跟朋友改约，聚餐照去，回头再赔个不是",
        "去露个脸，坐一会儿提前撤，两头都不耽误"
      ],
      "weights": [
        [
          3,
          0,
          1
        ],
        [
          2,
          3,
          3
        ],
        [
          0,
          0,
          0
        ],
        [
          1,
          3,
          2
        ]
      ]
    },
    {
      "id": "b04",
      "dim": "time",
      "probe": "深夜被倾倒情绪",
      "text": "十一点半了，朋友一口气甩来五条语音，全是倒苦水。",
      "options": [
        "看是谁。那两三个我真会听的，就回；别的明早再说",
        "先丢一句「我在」，听一半，剩下的明天接着",
        "「我睡啦，明天聊」——到点我就断，谁来都一样",
        "五条全听完，陪到他说够了才停，明天还得早起呢"
      ],
      "weights": [
        [
          2,
          3,
          0
        ],
        [
          1,
          3,
          2
        ],
        [
          3,
          0,
          1
        ],
        [
          0,
          0,
          3
        ]
      ]
    },
    {
      "id": "b05",
      "dim": "time",
      "probe": "亲戚借住",
      "text": "亲戚来你这边的城市，一句「顺便在你那儿住两晚呗」。",
      "options": [
        "「行啊来吧！」转身就把沙发铺好、钥匙找出来",
        "「我这儿不方便住人，我帮你看看附近的酒店」",
        "先说「这两天我这边有点满……」，看他接不接这话",
        "看是哪头的亲戚。从小一起长大的留，平时不怎么联系的帮订个房"
      ],
      "weights": [
        [
          0,
          0,
          0
        ],
        [
          3,
          0,
          2
        ],
        [
          1,
          3,
          1
        ],
        [
          2,
          3,
          3
        ]
      ]
    },
    {
      "id": "b06",
      "dim": "info",
      "probe": "饭桌当众问收入",
      "text": "过年饭桌上，长辈当着一整桌人问：「现在一个月挣多少啊？」",
      "options": [
        "笑一下，顺手把话岔到菜上，那个数就不接了",
        "报个大概的数，先把场面圆过去（回家路上才觉得，好像说多了）",
        "看谁问的。自己爸妈这边照实说，远房亲戚就「嗨，也就那样」",
        "「这个我不太聊哈。」桌上静两秒，我也不补话"
      ],
      "weights": [
        [
          1,
          3,
          3
        ],
        [
          0,
          0,
          0
        ],
        [
          2,
          3,
          2
        ],
        [
          3,
          0,
          1
        ]
      ]
    },
    {
      "id": "b07",
      "dim": "info",
      "probe": "催婚催育",
      "text": "刚认识没多久的人问：「怎么还单着呀」「打算什么时候要孩子？」",
      "options": [
        "「这个先不聊啦～」不解释，也不往下接",
        "看跟这人熟不熟。能聊的多说两句，不熟的一句带过去",
        "老老实实答了，回家路上才反应过来：我刚说那么多干嘛",
        "哈哈两声把话头拧走，他要是还追，我再挡一次"
      ],
      "weights": [
        [
          3,
          0,
          2
        ],
        [
          2,
          3,
          1
        ],
        [
          0,
          0,
          3
        ],
        [
          1,
          3,
          0
        ]
      ]
    },
    {
      "id": "b08",
      "dim": "info",
      "probe": "同事打听住处与租金",
      "text": "同事顺嘴问一句：「你这房租的吧？一个月多少啊。」",
      "options": [
        "跟我熟的随口就说了，不熟的我就把话岔开",
        "「嗨，也就那样呗」，糊弄过去，不往下接",
        "「租金我不太聊。」语气特平常，说完该干嘛干嘛",
        "地段、价格、押几付几全给人家说了，说完才反应过来"
      ],
      "weights": [
        [
          2,
          3,
          1
        ],
        [
          1,
          3,
          3
        ],
        [
          3,
          0,
          0
        ],
        [
          0,
          0,
          2
        ]
      ]
    },
    {
      "id": "b09",
      "dim": "info",
      "probe": "身体状况被追问",
      "text": "体检查出个要复查的，你请了假，同事问「咋了呀」。",
      "options": [
        "大概讲了一遍，讲完就有点后悔，说太细了",
        "「小事儿，去复查一下。」就这一句，谁问都这句",
        "「没啥大毛病」，先让人放心，细节以后再说",
        "看谁问。真关心的多说两句，随口一问的带过去就行"
      ],
      "weights": [
        [
          0,
          0,
          1
        ],
        [
          3,
          0,
          3
        ],
        [
          1,
          3,
          0
        ],
        [
          2,
          3,
          2
        ]
      ]
    },
    {
      "id": "b10",
      "dim": "info",
      "probe": "朋友圈被不太熟的人追问",
      "text": "发了条朋友圈，一个不太熟的人私信过来追着问细节。",
      "options": [
        "客客气气含糊两句，聊着聊着就自然收了",
        "一五一十全说了，聊完：「我干嘛跟她讲这些……」",
        "看是谁吧。顺手能答就答，不想回的就不回，也不觉得欠谁",
        "「这个就不展开啦」，发完不再多补一个字"
      ],
      "weights": [
        [
          1,
          3,
          0
        ],
        [
          0,
          0,
          2
        ],
        [
          2,
          3,
          1
        ],
        [
          3,
          0,
          3
        ]
      ]
    },
    {
      "id": "b11",
      "dim": "emotion",
      "probe": "连续多晚承接同一个人的情绪",
      "text": "朋友分手，连着三晚找你哭，你每天早上都得早起。",
      "options": [
        "第三晚直说「我明早得早起，咱今晚早点收吧」，说完不加安慰",
        "看是谁。真交情的那几位我陪到底，别人点到为止",
        "每晚都陪到他自己说停，连着好几天没睡够",
        "先听着，到点了说「我先去睡哈，明天接着聊」，两边都不落"
      ],
      "weights": [
        [
          3,
          0,
          3
        ],
        [
          2,
          3,
          0
        ],
        [
          0,
          0,
          2
        ],
        [
          1,
          3,
          1
        ]
      ]
    },
    {
      "id": "b12",
      "dim": "emotion",
      "probe": "当众被拿糗事开玩笑",
      "text": "饭局上有人把你去年那件糗事翻出来当梗，一桌都笑。",
      "options": [
        "看谁开的口。能闹的接两句，不熟的就笑一下过去",
        "跟着笑两声，顺手把话题引到别人身上（散了场才有点堵）",
        "当场一句：「这个别说啦。」语气挺平，说完照常夹菜",
        "陪着笑到最后，回家路上那句话在脑子里过了好几遍"
      ],
      "weights": [
        [
          2,
          3,
          2
        ],
        [
          1,
          3,
          1
        ],
        [
          3,
          0,
          3
        ],
        [
          0,
          0,
          0
        ]
      ]
    },
    {
      "id": "b13",
      "dim": "emotion",
      "probe": "被卷进别人的抱怨",
      "text": "同事挨了批，转头跟你吐槽半小时，越说越上头。",
      "options": [
        "一路听着还帮腔，自己的活儿全挪到晚上做",
        "「我这边还有事，先到这儿哈。」说完就回工位了",
        "先接几句，等他气顺点了再找个由头收掉",
        "看是谁。平时互相搭把手的那位多听会儿，别人听个开头就够了"
      ],
      "weights": [
        [
          0,
          0,
          2
        ],
        [
          3,
          0,
          1
        ],
        [
          1,
          3,
          3
        ],
        [
          2,
          3,
          0
        ]
      ]
    },
    {
      "id": "b14",
      "dim": "emotion",
      "probe": "被拉去站队",
      "text": "俩朋友闹别扭，都来找你评理，都巴不得你站自己这边。",
      "options": [
        "两头都先安抚着，不表态，等他俩自己缓过来",
        "两边都认真听、都好好回，最后自己累得一句话不想说",
        "看跟谁更近呗。近的多说两句，另一边我不掺和",
        "「这个我不站队啊。」头一回这么说的时候还挺别扭"
      ],
      "weights": [
        [
          1,
          3,
          1
        ],
        [
          0,
          0,
          3
        ],
        [
          2,
          3,
          0
        ],
        [
          3,
          0,
          2
        ]
      ]
    },
    {
      "id": "b15",
      "dim": "emotion",
      "probe": "安抚完别人之后的自己",
      "text": "哄完别人回到家，自己反倒一句话都不想说了。",
      "options": [
        "跟家里人直接说「今晚我想自己待会儿」，不解释",
        "看旁边是谁。能陪着不说话的就留着，别人消息先不回",
        "照常回消息、照常搭话，撑到睡前才松下来",
        "先含糊一句「有点累哈」，给自己留半小时，没把话说死"
      ],
      "weights": [
        [
          3,
          0,
          0
        ],
        [
          2,
          3,
          2
        ],
        [
          0,
          0,
          1
        ],
        [
          1,
          3,
          3
        ]
      ]
    },
    {
      "id": "b16",
      "dim": "space",
      "probe": "借出去的东西没还",
      "text": "同事借走你的充电宝，一礼拜了，还也不还、提也不提。",
      "options": [
        "看是谁。熟的顺口提一句，不熟的就算了",
        "找个不尴尬的时候带一句「那个……是不是还在你那儿呀」",
        "「充电宝记得还我哈。」直说，跟谁都这么讲",
        "算了不提了，回头自己再买一个吧"
      ],
      "weights": [
        [
          2,
          3,
          3
        ],
        [
          1,
          3,
          0
        ],
        [
          3,
          0,
          2
        ],
        [
          0,
          0,
          1
        ]
      ]
    },
    {
      "id": "b17",
      "dim": "space",
      "probe": "AA 少转钱",
      "text": "聚餐 AA，有人又少转了几十，甩一句「下次一起算哈」。",
      "options": [
        "「没事儿没事儿～」这几十块就过去了，下回还是我先垫",
        "直接发过去：「还差 38，转一下呗」，特平常的语气",
        "这回先不提，等下次点单的时候顺口把话圆回来",
        "看是谁。常一起的就算了，不熟的我得把账算清"
      ],
      "weights": [
        [
          0,
          0,
          3
        ],
        [
          3,
          0,
          0
        ],
        [
          1,
          3,
          2
        ],
        [
          2,
          3,
          1
        ]
      ]
    },
    {
      "id": "b18",
      "dim": "space",
      "probe": "合租被带人回来住",
      "text": "合租的室友没打招呼，直接带了朋友回来住一晚。",
      "options": [
        "当晚笑着提一句「下次说一声哈」，没往深了说",
        "照样客客气气的，自己缩回屋（关上门才闷了一会儿）",
        "看带来的是谁。见过几回的没事，完全不认识的我会提",
        "第二天把「带人回来提前说一声」讲清楚，对谁都这条"
      ],
      "weights": [
        [
          1,
          3,
          0
        ],
        [
          0,
          0,
          2
        ],
        [
          2,
          3,
          1
        ],
        [
          3,
          0,
          3
        ]
      ]
    },
    {
      "id": "b19",
      "dim": "space",
      "probe": "被拉群、被推微信",
      "text": "有人一声不吭把你拉进个群，顺手还把你微信推给了别人。",
      "options": [
        "直接说「以后拉我进群先问一声哈」，说完就退",
        "看谁拉的。熟人就算了，不熟的我得问一句：这什么群",
        "群进了、人也加了，回头一个个去设权限，嫌麻烦也没吭声",
        "先在群里潜着不说话，过两天悄悄退了，谁也没惊动"
      ],
      "weights": [
        [
          3,
          0,
          1
        ],
        [
          2,
          3,
          3
        ],
        [
          0,
          0,
          0
        ],
        [
          1,
          3,
          2
        ]
      ]
    },
    {
      "id": "b20",
      "dim": "space",
      "probe": "家人替你拆了快递",
      "text": "你不在家，家里人替你收了快递，顺手给拆了：「怕你急用嘛。」",
      "options": [
        "看谁拆的。爸妈拆的我就不提了，换别人我会说一句",
        "笑着说「下次等我回来拆呗」，说完还琢磨了下自己语气",
        "「我的快递我自己拆哈。」说得挺平常，下次还是这句",
        "嘴上『没事没事』，之后快递全改成寄驿站了"
      ],
      "weights": [
        [
          2,
          3,
          2
        ],
        [
          1,
          3,
          1
        ],
        [
          3,
          0,
          3
        ],
        [
          0,
          0,
          0
        ]
      ]
    }
  ],
  "copyNote": "题干与选项做过口语化改写：句式长短错落、直接给台词和动作、去掉「对谁都这样」这类元描述和 AI 式心理旁白。题号、维度、选项顺序、三重权重编码全部未变，见 scripts/polish-copy.js 的结构断言。"
};
  var MAP = {
  "testId": "boundary",
  "title": "你的边界感，是门帘还是院墙",
  "note": "四型没有高低，只有代价不同。任何型号都不得被描述为更成熟、更健康或更差。",
  "archetypes": [
    {
      "id": "wall",
      "emoji": "🧱",
      "name": "院墙型",
      "tagline": "先讲规矩，再讲交情",
      "axes": {
        "threshold": "high",
        "flex": "fixed"
      },
      "dims": "门槛高 · 规则恒定",
      "reading": "别人头一回约你，你不会先答应、回头再后悔。你当场就把话说清楚：几点到，待多久，去干嘛。工作群晚上九点 @ 你，你回「周一上午给你」，连句「不好意思」都不带。不是端着，就是觉得没必要解释。\n\n跟你相处最省事的就是不用猜。合租怎么算、聚餐谁买单、加班到几点，你一次说完，之后也不翻旧账。底线一开始就摆桌上，谁都不用去试。\n\n麻烦也在同一个地方：门修得太清楚，就没什么人会顺手来敲一下了。久了你容易把「没人来」当成「人家不想来」。",
      "mechanism": "在你这儿，「讲清楚」就是尊重人，含含糊糊才是麻烦的开始。大概吃过一次答应太快的亏吧，从那以后你就学会先把话摆前面了。你挡的其实不是人，是那些没问过一句就默认「你应该会同意」的安排。",
      "theory": "聊边界这事，常被拆成两问：挡不挡？能不能随情况调一调？前者有人叫「渗透性」，后者叫「弹性」，名字记不住也没关系。你是第一问特别干脆、第二问基本不挪的那种。好处是跟你相处不用猜，谁都知道门在哪儿；麻烦是这扇门不太会自己让一步，想靠近的人得先自己抬手。说白了，别人来适应你，比你适应别人容易。",
      "aftermath": "「不」你说得挺干净，可偶尔半夜会冒出一句：我是不是太硬了点？当场从来不这么想，都是事情过去以后才冒出来。",
      "blindspot": "规则立得越清楚，越没人来试着敲那扇门。你以为是别人不想靠近——其实是你压根没留过让人靠近的口子。",
      "socialStyle": "不熟的人觉得你不太好请；熟人反倒省心，不用猜，也不用惦记着还人情。",
      "socialCost": "你讲得清楚，有人却觉得有点远。不是不喜欢你，是不知道该从哪句话开口。",
      "howto": "① 每周挑一件小事，不提条件就答应，一件就够，就当给门留条缝。② 拒绝的时候偶尔多说半句为什么，不是解释，是让对方知道这不是冲他来的。",
      "shareHook": "我不是不好说话，我只是把话说在前面"
    },
    {
      "id": "courtyard",
      "emoji": "🌿",
      "name": "敞院型",
      "tagline": "门一直开着，靠自觉",
      "axes": {
        "threshold": "low",
        "flex": "fixed"
      },
      "dims": "门槛低 · 规则恒定",
      "reading": "谁来都先一句「行」，对谁都这样。不是讨好谁，是真觉得没什么好挡的。同事借东西、群里临时加的活、周末被叫出门，你答应得比人家问得还快。也不太分远近，不熟的人来问，一样开门。\n\n人家一问，你脑子里先冒出来的不是「我想不想」，是「麻不麻烦」。不麻烦就顺手做了，快到自己都没觉得刚才做了个决定。\n\n累不是哪一件大事累出来的，是一件件「顺手」攒出来的。等哪天你想关一次门，才发现不知道该从哪句话开口。",
      "mechanism": "「方便」在你这儿是默认值。默认值意思是：还没开始想，就已经答应了。所以你不用说服自己，也不用鼓勇气——你就是没停下来过。",
      "theory": "费孝通在《乡土中国》里讲过个词，叫「差序格局」：中国式关系不是一条对谁都一样的线，是以自己为中心一圈圈往外推，离得近的、离得远的，规矩本来就不一样。你偏反过来——谁来都是同一套「开」。这在人情社会里其实挺少见，多数人都分人，你不分。好处是公平；麻烦是别人记住的是「找他准行」，不是「这回又麻烦人家了」。",
      "aftermath": "当场你很少觉得被冒犯，那点不舒服常常晚上才到。那会儿事都过去了，也怪不着谁，只好自己消化一下。",
      "blindspot": "你以为不设防叫随和，可别人记不住你答应过多少件，只记得「找他准行」。慢慢地，你就成了那个不用问、直接被算进去的人。",
      "socialStyle": "大家喜欢你，也真信任你，就是很少有人问一句「你要不要」。群里有事第一个想到你，聚餐定完了才通知你。没人觉得这叫怠慢——反正你从来没拒过。",
      "socialCost": "你成了那个「不用考虑」的人。被信任挺好，可被默认久了，连说累的地方都没有了。",
      "howto": "① 挑一件最常被临时打断的事，给它留个固定不接的时段，哪怕就晚饭后一小时。② 答应前多停两秒，把「行」换成「我想一下」。不用拒绝，就给自己留两秒。",
      "shareHook": "找我准行，但我也会累"
    },
    {
      "id": "revolving",
      "emoji": "🚪",
      "name": "旋转门型",
      "tagline": "认人，不认事",
      "axes": {
        "threshold": "high",
        "flex": "flexible"
      },
      "dims": "门槛高 · 看人切换",
      "reading": "同一件事，换个人来问，你的答案能完全反过来。领导晚上九点 @ 你，你爬起来就做；别组的人来问一样的事，你先来一句「急吗」。你先看的是「谁」，不是「事多大」。这套切换快到自己都没察觉。\n\n脑子里有张名单，还一直在更新：谁可以半夜找你，谁的事你愿意多走一步，谁的消息明早回就行。半秒钟就归好类了，一点不费劲。\n\n偶尔也会被自己的不一致绊一下：同一件事，昨天拒了，今天又答应。别人没说什么，你自己倒会琢磨「我是不是有点势利」。其实不是——你算的是关系，不是道理。",
      "mechanism": "你心里排第一的是「谁」，不是「什么事」。所以别人看你忽冷忽热，你自己觉得一直挺讲道理——两边算的根本不是同一本账。",
      "theory": "这就是差序格局日常的样子：关系一圈圈往外推，近的一套房规矩，远的一套。所以「看人下菜碟」在这儿真不算双标，是大家用了很久的老办法——比起对谁都一视同仁，它还更贴合人情往来。问题不在分人，在那张名单你从没写下来过，连自己都看不见它。",
      "aftermath": "事后发现自己对两个人用了两套标准，会花几分钟给自己找个说法。说法一般都能找到，就是心里不太踏实。",
      "blindspot": "切得太快了，快到你自己都信了「我这人挺有原则」。可你的原则是看人调的，那张名单，你一次都没写下来过。",
      "socialStyle": "熟的人觉得你特别够意思，不熟的觉得你有点不好接近。两种都没说错，只是站在不同的圈里看。",
      "socialCost": "圈里的人想不通你怎么对别人那样，圈外的人又没机会见你这一面。两拨人，各认识了你一半。",
      "howto": "① 下回想拒绝的时候，先问自己一句「换个人来问，我还拒吗」——答案会让你看清那张名单。② 挑一条你最不想破的规矩，试着对谁都用一次，看看不切换是什么感觉。",
      "shareHook": "我不是双标，我是按圈算的"
    },
    {
      "id": "curtain",
      "emoji": "🪟",
      "name": "门帘型",
      "tagline": "看着能进，绳在你手里",
      "axes": {
        "threshold": "low",
        "flex": "flexible"
      },
      "dims": "门槛低 · 看人切换",
      "reading": "你很少当场把人挡回去。问工资、问感情、说要来借住，你多半先笑着接一句，把话岔开，或者含糊过去——没答应，也没拒绝。等人走了，帘子才慢慢放下来。\n\n不是没有边界，是你那道边界软，还慢半拍。你在意的是眼下这气氛，不是这事该怎么答。当场说「不方便」，你怕场面一下子僵了，就先把和气保住，回头再慢慢把距离找回来：消息晚点回、下次不主动约、话题轻轻绕开。\n\n最累的不是当时没说出口，是后面得花好几倍的劲儿，把距离一点点调回来。",
      "mechanism": "你把一句「不」拆成好几个动作，摊在好几天里慢慢做完，所以从来不用跟谁硬碰硬。麻烦是，对面那人往往只收到了前半段。",
      "theory": "这就是「弹性」那个词的意思：不硬挡，看场合收放。这么处确实省力，但有个前提——对方得看得懂你的信号。含糊一下、晚点回、慢半拍，熟人之间够用了；碰上读不懂的，人家会当你默认同意。所以才会有那种场面：你委屈「我没答应啊」，对方也委屈「你不是没拒绝吗」，两边居然都没说错。",
      "aftermath": "那句话你会在心里重排好几遍：「刚才直接说不方便就好了」。明知道重排也没用，下回还是照样来一遍。",
      "blindspot": "你以为自己没拒绝过，其实天天都在拒绝——用「晚点回」「下次再约」这种别人看不见的方式。边界一直都在，就是从来不当场亮出来。",
      "socialStyle": "好相处是真的。可别人常常拿不准你到底愿不愿意，连真想靠近的人，也会因为等不到一句准话，就停在门口了。",
      "socialCost": "误会全留给你自己消化了。对方既没觉得被拒，也没觉得被接纳，这段关系就一直那么悬着。",
      "howto": "① 挑一个最常被越界的场合，备一句现成的话，比如「这个我先不聊啦」。有现成的，就不用临场现编。② 把事后找补的劲儿挪一半到当场，哪怕只是多说一句「我想想」。",
      "shareHook": "我没说过不，但我也没说过行"
    }
  ],
  "costBands": [
    {
      "id": "light",
      "name": "说完就放下",
      "reading": "「不方便」说完就真翻篇了，不回头想，也不补一句解释。有时候对方还在琢磨怎么收场，你已经在干别的了。答应也一样，应了就做，做完就完。",
      "insight": "很多人以为「不会拒绝」是本事问题，你不是：挡得住，也不为它付账。说完就能放下，这比会不会说「不」其实更难。"
    },
    {
      "id": "medium",
      "name": "闷一小会儿",
      "reading": "答应完有点堵，或者拒绝完想上两分钟，睡一觉也就过去了。同一句话你不会翻来覆去地想，也不会提前替对方把反应演一遍。",
      "insight": "那笔账你当天就结了。真要留意的不是哪一次，是同一类事攒到第五回的那个晚上。"
    },
    {
      "id": "heavy",
      "name": "自己复盘两小时",
      "reading": "耗你的不是那件事，是事后那笔账：「他会不会觉得我不近人情」「刚才那句是不是太硬了」。那段对话你在脑子里重放好几遍，连他可能怎么回都替他想好了，然后自己再答一遍。",
      "insight": "你可能一直以为自己的毛病是「不会拒绝」。换个说法也许更贴：不是不会说不，是说完太贵了。门挡不挡、说完累不累，本来就是两码事。分开看才知道，该练的是开口那一下，还是开口之后那两小时。"
    }
  ],
  "crossInsight": {
    "note": "按门槛高度 × 拒绝成本交叉，给结果加一层个人化读数。",
    "high_light": "挡得住，也翻篇得快，这道门基本不用你操心。就一样：别把「我不费劲」当成「别人也不费劲」。",
    "high_heavy": "挡得住，可每挡一次，账都是自己结。别人看见的是你干脆，看不见的是事后那两小时。要练的不是把话说得更硬，是说完别再自己开第二场会。",
    "low_light": "不太挡，也不太累，这组合其实挺稳。麻烦不在心里那点别扭，在数量：一件件顺手的事都不难受，可时间就这么被占满了。",
    "low_heavy": "两头都付：当场没挡住，事后还得自己消化。四种组合里数这个最累，也最容易自己不觉得——毕竟每一回看起来都不算个事。"
  },
  "theoryNotes": [
    {
      "name": "边界的两个属性：渗透性与弹性",
      "text": "聊人际边界，常被拆成两问：挡不挡？能不能随情况调？前者叫渗透性，后者叫弹性，词儿记不住也不影响。大家平时只聊第一问，也就是会不会拒绝；第二问很少有人说，可它才决定了别人能不能摸准你。这套题的两根轴，就是从这两问来的。",
      "use": "说明四型不是从软到硬排成一排，而是两轴切出四格。"
    },
    {
      "name": "差序格局",
      "text": "费孝通在《乡土中国》里管这个叫「差序格局」：中国式关系不是一条对谁都一样的线，是以自己为中心一圈圈往外推，近的远的，规矩本来就不一样。所以「看人下菜碟」在这儿不算双标，是套用了很久的老办法。",
      "use": "讲清旋转门型，也说通为什么在国内「对谁都一样」有时反倒显得不近人情。"
    },
    {
      "name": "人情与回报预期",
      "text": "人情往来里，一句「不」不只是回掉一件事，后头还跟着「会不会欠了」「会不会被记一笔」。真正磨人的常常不是说不出口那一下，是之后那笔账。",
      "use": "说明「拒绝成本」为什么要单算，不能并进「门挡不挡」里一起算。"
    },
    {
      "name": "自我分化",
      "text": "家庭系统的书里常提一个词，叫「自我分化」。说白了就是：关系还好好处着，但不必把对方的情绪自动领成自己的活儿。挨着，和被卷走，是两回事。",
      "use": "对应情绪边界那一维：安慰人，和被人的情绪卷进去，真不是一回事。"
    }
  ],
  "theoryDisclaimer": "这几个说法只是帮你读懂结果的话头，不是给这套题背书。它不是心理测量工具，没有常模，也没做过信度、效度检验；结果不过是从你那 20 个选择里理出来的一组趣味标签。",
  "shareTemplates": {
    "minimal": "【边界感测试】\n{emoji} 我是{name} · {rarity}\n—— {tagline}\n你是门帘还是院墙？",
    "full": "【边界感测试 · 我的结果】\n\n{emoji} 我是{name}（{dims}）\n{rarity}级 · 拒绝成本：{costName}\n\n{shareHook}\n\n我的六个数：\n{bars}\n\n{blindspot}\n\n{costInsight}\n\n你也测测，看自己是哪扇门",
    "battle": "【同型号对决】\n你是什么门？我先亮牌👇\n\n我：{emoji} {name}（{dims}）\n{rarity}级 · 门槛高度 {thresholdValue} · 切换弹性 {flexValue}\n\n我这扇门你大概猜不到，敢不敢报一下你的？\n（报完我给你算：我俩是同一扇门，还是刚好互补）"
  },
  "rarityNote": "稀有度档位为占位值，尚未经真实数据校准，不承诺具体比例。",
  "compliance": "以上内容由 AI 根据你的作答生成，仅供自我探索与娱乐参考，不构成心理评估、医学诊断或任何专业能力评价，不应作为选拔、招聘等用途依据。",
  "copyNote": "结果解读文案做过口语化改写：把端着的判断句和书面术语换成大白话，术语只顺口一提（「名字记不住也没关系」），抽象结论改成具体场面；保留每型的具体行为细节与扎心盲区的劲道。型号字段、占位符、稀有度说明、免责原文全部未变，见 scripts/polish-results.js 的结构断言。"
};
  var createScore = function createScore(Q, MAP) {
  const W_THRESHOLD = 0;
  const W_FLEX = 1;
  const W_COST = 2;
  const MAX_ITEM = 3;

  const clamp100 = n => Math.max(0, Math.min(100, Math.round(n)));
  const to100 = (sum, count) => clamp100((sum / (count * MAX_ITEM)) * 100);

  return function score(answers) {
    const missing = [];
    const dimSums = {};
    Q.dimensions.forEach(d => { dimSums[d.id] = 0; });

    let tSum = 0, fSum = 0, cSum = 0;

    Q.questions.forEach(question => {
      const v = answers[question.id];
      if (v === undefined || !Number.isInteger(v) || v < 0 || v >= question.options.length) {
        missing.push(question.id);
        return;
      }
      const w = question.weights[v];
      if (!Array.isArray(w) || w.length !== 3) {
        missing.push(question.id);
        return;
      }
      tSum += w[W_THRESHOLD];
      fSum += w[W_FLEX];
      cSum += w[W_COST];
      dimSums[question.dim] += w[W_THRESHOLD];
    });

    if (missing.length) {
      return { ok: false, error: 'MISSING_OR_INVALID_ANSWERS', missing };
    }

    const axes = {
      threshold: to100(tSum, Q.questions.length),
      flex: to100(fSum, Q.questions.length),
      cost: to100(cSum, Q.questions.length)
    };

    const dimensions = Q.dimensions.map(d => {
      const pct = to100(dimSums[d.id], d.items);
      return {
        id: d.id, name: d.name, emoji: d.emoji, percent: pct,
        leftLabel: d.leftLabel, rightLabel: d.rightLabel,
        side: Math.abs(pct - 50) <= 8 ? 'neutral' : (pct >= 50 ? 'right' : 'left'),
        probe: d.probe
      };
    });

    const axisBars = [
      ...dimensions.map(d => ({
        axis: d.id, name: d.name, emoji: d.emoji,
        left: d.leftLabel, right: d.rightLabel,
        percent: d.percent, side: d.side
      })),
      ...Q.axes.map(ax => {
        const pct = axes[ax.id];
        return {
          axis: ax.id, name: ax.name, emoji: ax.emoji,
          left: ax.left, right: ax.right, percent: pct,
          side: Math.abs(pct - 50) <= 8 ? 'neutral' : (pct >= 50 ? 'right' : 'left')
        };
      })
    ];

    const mid = Q.thresholds.axisMid;
    const side = {
      threshold: axes.threshold >= mid ? 'high' : 'low',
      flex: axes.flex >= mid ? 'flexible' : 'fixed'
    };
    const top = MAP.archetypes.find(
      a => a.axes.threshold === side.threshold && a.axes.flex === side.flex
    );

    const CENTER = { high: 75, low: 25, flexible: 75, fixed: 25 };
    const ranked = MAP.archetypes
      .map(a => ({
        a,
        dist: Math.hypot(
          axes.threshold - CENTER[a.axes.threshold],
          axes.flex - CENTER[a.axes.flex]
        )
      }))
      .sort((x, y) => x.dist - y.dist);
    const runnerUp = ranked[1] ? { name: ranked[1].a.name, emoji: ranked[1].a.emoji } : null;

    const band = Q.thresholds.ambiguousBand;
    const ambiguous =
      Math.abs(axes.threshold - mid) <= band && Math.abs(axes.flex - mid) <= band;

    const intensity = (Math.abs(axes.threshold - 50) + Math.abs(axes.flex - 50)) / 2;
    const rarityLevel =
      intensity >= 34 ? Q.rarity.levels[2]
        : intensity >= 18 ? Q.rarity.levels[1]
          : Q.rarity.levels[0];

    const costBand = Q.subScale.bands.find(b => axes.cost <= b.max) || Q.subScale.bands[2];
    const costCopy = MAP.costBands.find(c => c.id === costBand.id);
    const crossKey = `${side.threshold}_${costBand.id}`;

    const shortBars = axisBars.slice(0, 4).map(b => `${b.emoji}${b.name} ${b.percent}`).join(' · ')
      + '\n' + axisBars.slice(4).map(b => `${b.emoji}${b.name} ${b.percent}`).join(' · ');

    const vars = {
      emoji: top.emoji, name: top.name, dims: top.dims, tagline: top.tagline,
      rarity: rarityLevel, costName: costBand.name, costInsight: costCopy.insight,
      blindspot: top.blindspot, shareHook: top.shareHook, bars: shortBars,
      thresholdValue: axes.threshold, flexValue: axes.flex
    };
    const fill = tpl => tpl.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{${k}}`));
    const shareBlocks = {
      minimal: fill(MAP.shareTemplates.minimal),
      full: fill(MAP.shareTemplates.full),
      battle: fill(MAP.shareTemplates.battle)
    };

    return {
      ok: true,
      testId: Q.testId,
      axes,
      axisSides: side,
      dimensions,
      axisBars,
      archetype: {
        id: top.id, emoji: top.emoji, name: top.name,
        dims: top.dims, tagline: top.tagline, axes: top.axes,
        ambiguous, runnerUp
      },
      rarity: {
        level: rarityLevel,
        calibrated: Q.rarity.calibrated,
        displayPercent: null,
        note: MAP.rarityNote
      },
      costBand: {
        id: costBand.id, name: costBand.name, value: axes.cost,
        reading: costCopy.reading, insight: costCopy.insight
      },
      crossInsight: MAP.crossInsight[crossKey],
      profile: {
        reading: top.reading,
        mechanism: top.mechanism,
        theory: top.theory,
        aftermath: top.aftermath,
        blindspot: top.blindspot,
        socialStyle: top.socialStyle,
        socialCost: top.socialCost,
        howto: top.howto,
        shareHook: top.shareHook
      },
      shareBlocks,
      theoryNotes: MAP.theoryNotes,
      theoryDisclaimer: MAP.theoryDisclaimer,
      compliance: MAP.compliance
    };
  };
};
  var score = createScore(Q, MAP);
  return { Q: Q, MAP: MAP, score: score };
});
