/* ============================================================
   バイオリン姫と魔法のシンフォニー - Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initLanguage();      // 言語設定を最初に適用
  initPageScripts();
  initBGMPlayer();     // BGMプレイヤー（初回のみ完全初期化、以後は状態復元）
  initOpeningFlow();   // オープニングフロー（トップページのみ）

  // CCメニュー：外側クリックで全メニューを閉じる
  document.addEventListener('click', () => {
    ['ovc-cc-menu', 'gvm-cc-menu'].forEach(id => {
      const m = document.getElementById(id);
      if (m) m.hidden = true;
    });
  });
});

/* ══════════════════════════════════════════════════════════
   PAGE SCRIPTS（ページ遷移のたびに呼ぶ処理）
   ══════════════════════════════════════════════════════════ */
function initPageScripts() {

  /* ── Active nav link ── */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === currentPage);
  });

  /* ── Hamburger menu ── */
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  /* ── Floating musical notes ── */
  const notes = ['♩', '♪', '♫', '♬', '𝄞', '𝄢'];
  function createNote() {
    const note = document.createElement('div');
    note.className = 'note';
    note.textContent = notes[Math.floor(Math.random() * notes.length)];
    note.style.left = Math.random() * 100 + 'vw';
    note.style.animationDuration = (8 + Math.random() * 12) + 's';
    note.style.animationDelay = (Math.random() * 4) + 's';
    note.style.fontSize = (0.8 + Math.random() * 1.5) + 'rem';
    document.body.appendChild(note);
    setTimeout(() => note.remove(), 24000);
  }
  setInterval(createNote, 2000);
  for (let i = 0; i < 5; i++) setTimeout(createNote, i * 400);

  /* ── Scroll fade-in ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  /* ══ CHARACTER PAGE ══ */
  const charData = {
    violin: {
      name: 'バイオリン姫', nameSub: 'Violin Princess',
      role: '主人公 / ゲンガク国の姫', country: 'ゲンガク国', avatar: '🎻', color: '#ffb7c5',
      appearance: '薄ピンク色のドレス、長く艶やかな髪、凛とした瞳',
      personality: '勇敢でおてんば。強い意志と繊細な感性を持つ。',
      desc: 'ゲンガク国の王女。幼い頃からバイオリンを愛し、美しく繊細な音色で人々の心を癒してきた。ケンバンガク国の侵攻で家族を奪われ、国を追われる苦難に直面する。敵国の騎士サックスと不本意ながら手を組み、囚われた家族と民を救うための旅へ踏み出す。マスタータクトのもとで修行を積み、音楽の真の力に目覚めていく。',
      instrument: 'バイオリン（魔法の弓弦）', ability: '魔法の音色・心を癒す旋律・音の結界',
      mainImgSrc: 'images/characters/main/violin-princess.png',
      detailImgSrc: 'images/characters/details/violin-princess-detail.png',
    },
    sax: {
      name: 'サックス', nameSub: 'Sax / Alto Saxophone',
      role: 'カンガク国 騎士団大将', country: 'カンガク国', avatar: '🎷', color: '#ffd700',
      appearance: '金色の鎧、逞しい体格、力強い瞳',
      personality: '力強く熱い男。クラリネット姫に密かに想いを寄せる。',
      desc: 'カンガク国の騎士団大将。金色の鎧に身を包んだ豪胆な武人。本来はバイオリン姫と敵対関係にあるが、共通の敵であるパイプオルガン魔女の存在を知り、不本意ながら協力関係を結ぶ。熱い正義感と仲間への強い絆が最大の武器。クラリネット姫への想いを心の支えに戦い続ける。',
      instrument: 'アルト・サクソフォーン（音波の魔法武器）', ability: '音波衝撃・金属強化・突撃の鬨の声',
      mainImgSrc: 'images/characters/main/sax-knight.png',
      detailImgSrc: 'images/characters/details/sax-knight-detail.png',
    },
    piano: {
      name: 'ピアノ王子', nameSub: 'Piano Prince',
      role: 'ケンバンガク国 王子', country: 'ケンバンガク国', avatar: '🎹', color: '#c890ff',
      appearance: '黒いマント、大きな黒い帽子、金色の髪、蒼い目。白馬フォルテシモに乗る',
      personality: '気品があり謎めいた存在。冷静沈着だが内に熱を秘める。',
      desc: 'ケンバンガク国の王子。黒いマントと大きな帽子に身を包んだ謎めいた青年。白馬「フォルテシモ」に乗り、静かに戦場を駆ける。父・チェンバロ皇帝が魔女に操られていることを知り、内側から国を救おうとする。',
      instrument: 'グランドピアノ（時空を操る鍵盤）', ability: '時の調律・空間のアルペジオ・フォルテシモの突進',
      mainImgSrc: 'images/characters/main/piano-prince.png',
      detailImgSrc: 'images/characters/details/piano-prince-detail.png',
    },
    maestro: {
      name: 'マスタータクト', nameSub: 'Master Tact / Takt Maestro',
      role: '伝説の音楽家 / 師匠', country: '各地を放浪', avatar: '🎼', color: '#f0d060',
      appearance: '白いトンガリ帽、長い白髭、魔法の指揮棒を携えた老人',
      personality: '豪放磊落だが深い知恵を持つ。弟子には厳しく愛情深い。',
      desc: 'かつて世界中の音楽家の頂点に立った伝説の指揮者・タクト・マエストロ。今は各地を放浪する老人として知られている。魔法の指揮棒は音楽の力を何倍にも増幅させる。バイオリン姫と出会い、その才能を見抜いて修行をつける。',
      instrument: '魔法の指揮棒（マエストロの杖）', ability: '音楽の増幅・万能の指揮・時の旋律を読む',
      mainImgSrc: 'images/characters/main/master-tact.png',
      detailImgSrc: 'images/characters/details/master-tact-detail.png',
    },
    castanet: {
      name: 'カスタネット', nameSub: 'Castanet',
      role: 'ダガク国の子供', country: 'ダガク国', avatar: '🪘', color: '#87ceeb',
      appearance: '大きな前歯が特徴的な愛らしい子供',
      personality: '無邪気で愛らしい。大きな前歯でカタカタと音を鳴らす。',
      desc: 'ダガク国に暮らす小さな子供。大きな前歯でカスタネットのようにカタカタと音を鳴らす独特の特技を持つ。ダガク国の奥地を知り尽くした案内役として活躍する。その無邪気な笑顔と純粋な心で、疲れた仲間たちを明るく照らす存在。',
      instrument: 'カスタネット（大きな前歯と手のひら）', ability: 'リズムの魔法・地の道案内・笑顔の癒し',
      detailImgSrc: 'images/characters/details/castanet-detail.png',
    },
    harp: {
      name: 'ハープ女王', nameSub: 'Harp Queen',
      role: 'ゲンガク国 女王 / 姫の母', country: 'ゲンガク国', avatar: '👑', color: '#ffb7c5',
      appearance: '白銀のドレスに黄金の冠、気品あふれる美しい女性',
      personality: '気品に満ちた優雅な女王。民への深い愛と強い意志を持つ。',
      desc: 'ゲンガク国の女王であり、バイオリン姫の母。美しいハープの音色で国民を魅了し、国に平和をもたらしてきた。ケンバンガク国の侵攻によって囚われの身となるが、その気品と意志は折れることなく、娘の帰還を信じ続ける。',
      instrument: 'ハープ（女王の平和の楽器）', ability: '心の安定・癒しの旋律・魔法の障壁',
      mainImgSrc: 'images/characters/main/harp-queen.png',
      detailImgSrc: 'images/characters/details/harp-queen-detail.png',
    },
    viola: {
      name: 'ヴィオラ王子', nameSub: 'Viola Prince',
      role: 'ゲンガク国 王子 / 姫の兄', country: 'ゲンガク国', avatar: '🎻', color: '#ffb7c5',
      appearance: '深い青の正装に赤いマント、凛々しい若き王子',
      personality: '妹思いで正義感が強い。冷静で的確な判断力を持つ。',
      desc: 'ゲンガク国の王子であり、バイオリン姫の兄。妹の才能を誰より信じ、いつも陰で支えてきた。ケンバンガク国の侵攻に果敢に立ち向かい、民を守るために奮戦するも、捕らわれてしまう。',
      instrument: 'ヴィオラ（深く豊かな中音の弦）', ability: '音の盾・共鳴の守護・深音の轟き',
      mainImgSrc: 'images/characters/main/viola-prince.png',
      detailImgSrc: 'images/characters/details/viola-prince-detail.png',
    },
    cello: {
      name: 'チェロ執事', nameSub: 'Cello Butler',
      role: 'ゲンガク国 執事', country: 'ゲンガク国', avatar: '🎻', color: '#ffb7c5',
      appearance: '黒の正装に白手袋、姿勢の良い壮年の執事',
      personality: '生真面目で几帳面。王家への忠誠心が深い。ときに茶目っ気を見せる。',
      desc: 'ゲンガク国の王宮に仕える執事。幼い頃のバイオリン姫の面倒を見てきた古参のしもべ。チェロの深い音色は聴く者の心を落ち着かせ、仲間の動揺を鎮める効果がある。',
      instrument: 'チェロ（深みある低弦の鳴響）', ability: '心の鎮静・共鳴の守り・低音の結界',
      mainImgSrc: 'images/characters/main/cello-butler.png',
      detailImgSrc: 'images/characters/details/cello-butler-detail.png',
    },
    contrabass: {
      name: 'コントラバス伯爵', nameSub: 'Contrabass Count',
      role: 'ゲンガク国 伯爵', country: 'ゲンガク国', avatar: '🎻', color: '#ffb7c5',
      appearance: '重厚な体格、黒の礼服、白いウィッグ',
      personality: '低く重厚な存在感。寡黙だが頼りになる大物。',
      desc: 'ゲンガク国の重鎮伯爵。コントラバスの低く重厚な音色のように、どっしりとした存在感を放つ。長年にわたりゲンガク国を支えてきた実力者であり、危機に際しては誰よりも力強く国民を鼓舞する。',
      instrument: 'コントラバス（大地を揺るがす最低音）', ability: '大地振動・重低音の衝撃・威圧の轟き',
      mainImgSrc: 'images/characters/main/contrabass-count.png',
      detailImgSrc: 'images/characters/details/contrabass-count.png',
    },
    clarinet: {
      name: 'クラリネット姫', nameSub: 'Clarinet Princess',
      role: 'カンガク国 姫', country: 'カンガク国', avatar: '🎵', color: '#ffd700',
      appearance: '軽やかで明るい装い。澄んだ目が印象的な聡明な姫',
      personality: '優しく聡明。人の心を読む感受性の高さが持ち味。',
      desc: 'カンガク国の姫。サックスが密かに想いを寄せる相手。優しく聡明で、周囲の人の感情を敏感に察知する力を持つ。裏では仲間たちに情報を送り、内側から状況を変えようと尽力する。',
      instrument: 'クラリネット（澄み渡る管の音色）', ability: '心の声を聴く・音の探知・癒しの調べ',
      mainImgSrc: 'images/characters/main/clarinet-princess.png',
      detailImgSrc: 'images/characters/details/clarinet-princess-detail.png',
    },
    trombone: {
      name: 'トロンボーン兵士', nameSub: 'Trombone Soldier',
      role: 'カンガク国 門番兵士', country: 'カンガク国', avatar: '🎺', color: '#ffd700',
      appearance: '頑丈な鎧に身を包んだ屈強な兵士、鋭い目つきと整えられた髭',
      personality: '実直で規律を重んじる。職務に忠実で手を抜くことを知らない。',
      desc: 'カンガク国の城門や要所を守る門番兵士。トロンボーンのように伸びる音波で遠くまで異変を知らせる連絡役でもある。サックス大将を心から尊敬し、どんな過酷な任務もやり遂げる真面目な実力者。寡黙ながらも仲間思いで、いざというときに頼りになる存在。',
      instrument: 'トロンボーン（伸縮するスライドの管楽器）', ability: '遠距離音波伝達・音壁の形成・士気鼓舞の咆哮',
      mainImgSrc: 'images/characters/main/trombone-soldier.png',
      detailImgSrc: 'images/characters/details/trombone-soldier-detail.png',
    },
    accordion: {
      name: 'アコーディオン騎士団', nameSub: 'Accordion Knights',
      role: 'ケンバンガク国 巡回騎士団', country: 'ケンバンガク国', avatar: '🪗', color: '#c890ff',
      appearance: '鍵盤模様が刻まれた蛇腹の鎧をまとった複数の騎士。整然とした隊列で行動する',
      personality: '仲間との絆を最も重んじる。単独行動より連携が信条。声を合わせることで真の力を発揮する。',
      desc: 'ケンバンガク国各地を巡回する精鋭騎士団。蛇腹の鎧に刻まれた鍵盤模様こそ白と黒の秩序への誓いの証。アコーディオンの鍵盤はれっきとした鍵盤楽器の証であり、ケンバンガク国の誇りを胸に城塞から辺境の村まで守り続ける。単体では中堅だが、複数人で音を重ねると爆発的な力を発揮する頼もしい存在。',
      instrument: 'アコーディオン（鍵盤を持つ蛇腹式鍵盤楽器）',
      ability: '連携音波・蛇腹の盾・和音爆発',
      mainImgSrc: 'images/characters/main/accordion-knights.png',
      detailImgSrc: 'images/characters/details/accordion-knights-detail.png',
    },
    tuba: {
      name: 'チューバ副大将', nameSub: 'Tuba Vice-General',
      role: 'カンガク国 騎士団副大将', country: 'カンガク国', avatar: '🎺', color: '#ffd700',
      appearance: '大きな体格に温かみのある表情、重厚な鎧',
      personality: '巨体だが心優しい。サックスを尊敬し、忠実に従う。',
      desc: 'カンガク国騎士団の副大将。チューバのような大きな体格だが、内心は誰より優しく温かい人物。戦場では圧倒的な存在感で敵を威圧するが、仲間には常に穏やかに接する。',
      instrument: 'チューバ（最大の管楽器・大音量）', ability: '音圧の壁・大音量の衝撃波・士気向上',
      mainImgSrc: 'images/characters/main/tuba-vice-general.png',
      detailImgSrc: 'images/characters/details/tuba-vice-general-detail.png',
    },
    marimba: {
      name: 'マリンバ', nameSub: 'Marimba',
      role: 'ダガク国 木琴兄妹の兄', country: 'ダガク国', avatar: '🪘', color: '#87ceeb',
      appearance: '陽気な笑顔と軽快な身のこなし、ダガク族の色鮮やかな衣装',
      personality: '陽気で楽天的。語尾に「ンバ」をつけて話す。',
      desc: 'ダガク国に暮らす木琴兄妹の兄。「ンバ」が口癖の陽気な青年で、どんな状況でも笑顔を忘れない。妹のシロフォンと息の合ったコンビプレーで仲間を支える。',
      instrument: 'マリンバ（木製鍵盤打楽器）', ability: '音の温かみ・雰囲気の調和・打撃の連打',
      mainImgSrc: 'images/characters/main/marimba.png',
      detailImgSrc: 'images/characters/details/marimba-detail.png',
    },
    xylophone: {
      name: 'シロフォン', nameSub: 'Xylophone',
      role: 'ダガク国 木琴兄妹の妹', country: 'ダガク国', avatar: '🎵', color: '#87ceeb',
      appearance: '元気はつらつとした少女、おさげ髪と活発な瞳',
      personality: '元気いっぱいで行動派。語尾に「フォン」をつけて話す。',
      desc: 'ダガク国に暮らす木琴兄妹の妹。「フォン」が口癖の元気な少女。行動力は兄のマリンバ以上で、危険を顧みず飛び込む勇気が周囲を驚かせる。',
      instrument: 'シロフォン（澄んだ高音の木琴）', ability: '高音の衝撃・速攻の連打・音の切り裂き',
      mainImgSrc: 'images/characters/main/xylophone.png',
      detailImgSrc: 'images/characters/details/xylophone-detail.png',
    },
    glocken: {
      name: 'グロッケン', nameSub: 'Glocken',
      role: 'ダガク国神殿の門番', country: 'ダガク国', avatar: '🔔', color: '#87ceeb',
      appearance: '頭に鐘のような形のヘルメット、頑固そうな表情',
      personality: '頭が硬く融通が利かない。語尾に「ケン」をつけて話す。',
      desc: 'ダガク国の神殿を守る門番。規則を絶対視する頑固者で「ケン」が口癖。しかし真剣な言葉に心を動かされると、誰よりも忠実な仲間に変わる。',
      instrument: 'グロッケンシュピール（鉄琴）', ability: '鉄の音波・結界の鐘・硬度の鎧',
      mainImgSrc: 'images/characters/main/glockenspiel.png',
      detailImgSrc: 'images/characters/details/glockenspiel-detail.png',
    },
    timpani: {
      name: 'ティンパニー大王', nameSub: 'King Timpani',
      role: 'ダガク国 大王', country: 'ダガク国', avatar: '🥁', color: '#87ceeb',
      appearance: '巨大な体格、ダガク族の伝統的な王の装束に大きな羽飾り',
      personality: '威厳があり豪快。ダガク国の民を深く愛する大王。',
      desc: 'ダガク国の王。ティンパニーのような巨大な体格を持ち、大地を揺るがすような声で話す豪快な大王。バイオリン姫の演奏に心を動かされ、ダガク国の力を貸すことを決意する。',
      instrument: 'ティンパニー（太鼓の王・大地の鼓動）', ability: '大地震動・轟音の鬨・鉄壁の守護',
      mainImgSrc: 'images/characters/main/timpani-king.png',
      detailImgSrc: 'images/characters/details/timpani-king-detail.png',
    },
    organ: {
      name: 'オルガン兵士', nameSub: 'Organ Soldier',
      role: 'ケンバンガク国 兵士', country: 'ケンバンガク国', avatar: '🎹', color: '#c890ff',
      appearance: '紫の制服に少しよれた帽子、いつもどこかだるそうな表情',
      personality: '「めんどくさい」が口癖。サボる機会を常に狙っているが、いざとなると仕事はこなす。',
      desc: 'ケンバンガク国の下級兵士。「めんどくさい」という言葉を一日百回は口にするめんどくさがりの達人。パトロールをサボって昼寝、報告書は最低限、命令には必ず一言ぼやく。しかし根は真面目で、本当の危機には誰より先に動く不思議な兵士。チェンバロ皇帝が魔女に操られていることにも「なんか様子がおかしいんだよなあ…めんどくさいけど調べるか」とぼやきながら誰より早く気づいていた。',
      instrument: 'リードオルガン（くたびれた足踏み式オルガン）', ability: '怠惰の旋律・手抜きの和音・めんどくさいが最速の一撃',
      mainImgSrc: 'images/characters/main/organ-soldier.png',
      detailImgSrc: 'images/characters/details/organ-soldier-detail.png',
    },
    cembalo: {
      name: 'チェンバロ皇帝', nameSub: 'Emperor Cembalo',
      role: 'ケンバンガク国 皇帝', country: 'ケンバンガク国', avatar: '🎹', color: '#c890ff',
      appearance: '白と黒の皇帝衣装、白銀の王冠。厳かな老人',
      personality: '本来は穏やかで音楽を愛する皇帝。しかし魔女の呪いに操られている。',
      desc: 'ケンバンガク国の皇帝。かつては音楽を愛し、隣国との平和を願う穏やかな老人だった。しかしパイプオルガン魔女の呪いに操られ、侵略を命じる恐怖の支配者となってしまっている。',
      instrument: 'チェンバロ（古き鍵盤の王）', ability: '（本来）平和の旋律・歴史の調べ・時の記憶',
    },
    pipeorgan: {
      name: 'パイプオルガン魔女', nameSub: 'Pipe Organ Witch',
      role: '黒幕 / 世界征服を企む魔女', country: '不明', avatar: '🧙', color: '#8a00b0',
      appearance: '漆黒のローブ、鋭い目、底知れぬ闇の気配を纏う',
      personality: '冷酷で計算高い。権力への執着が強く、音楽を支配の道具と見る。',
      desc: '本作の真の黒幕。ケンバンガク国の皇帝を魔法で操り、世界征服を企む闇の魔女。パイプオルガンのような圧倒的な音圧と支配力を持ち、その力の真の深さは誰にも計り知れない。純粋な音楽の力と真っ向から対立する存在。',
      instrument: 'パイプオルガン（支配の大楽器）', ability: '魔音支配・闇の結界・音の呪縛・深淵の和音',
      mainImgSrc: 'images/characters/main/pipe-organ-witch.png',
      detailImgSrc: 'images/characters/details/pipe-organ-witch-detail.png',
    },
    dragon: {
      name: '謎ドラゴン', nameSub: 'Mysterious Dragon',
      role: '正体不明の魔竜', country: '不明', avatar: '🐉', color: '#6a0080',
      appearance: '漆黒の巨大ドラゴン。圧倒的な存在感と底知れぬ闇の力を持つ',
      personality: '破壊の化身。言葉を持たず、ただ力と恐怖で全てを圧倒する。',
      desc: '最終決戦の地に突如として現れた謎の巨大ドラゴン。漆黒の体躯から放たれる闇の音圧は全てのシンフォニーを打ち消し、世界を覆い尽くす。その正体も、どこから来たかも一切不明。バイオリン姫たちが紡ぎ出す四国合奏のハーモニーのみが唯一の対抗手段となる。',
      instrument: '魔竜の咆哮（究極の破壊音）', ability: '闇の音圧爆撃・音の結界破壊・終焉の咆哮',
      mainImgSrc: 'images/characters/main/pipe-organ-dragon.png',
      detailImgSrc: 'images/characters/details/pipe-organ-dragon-detail.png',
    },
    daspalla: {
      name: 'ダ・スパッラ兵士', nameSub: 'Violoncello da Spalla',
      role: 'ゲンガク国 王族護衛兵', country: 'ゲンガク国', avatar: '🎻', color: '#ffb7c5',
      appearance: '背中に小さなチェロを背負った引き締まった体格、無骨で寡黙な面持ち',
      personality: '寡黙で忠実。言葉よりも行動で語る。王族への献身が全て。',
      desc: 'ゲンガク国王族を影から守り続ける護衛兵。古楽器「ヴィオロンチェロ・ダ・スパッラ」を背中に背負い、音と剣の両方を武器に戦う。ほとんど言葉を発しないが、その献身は誰より深く、ケンバンガク国の侵攻時にバイオリン姫の逃亡を命がけで切り開いた一人。',
      instrument: 'ヴィオロンチェロ・ダ・スパッラ（肩掛けの古い小型チェロ）',
      ability: '旋律の護盾・斬音の一撃・献身の共鳴',
      mainImgSrc: 'images/characters/main/violoncello-da-spalla-soldier.png',
      detailImgSrc: 'images/characters/details/violoncello-da-spalla-soldier-detail.png',
    },
  };

  /* ── キャラアイコン → ポップアップ ── */
  const charIcons = document.querySelectorAll('.char-icon');
  if (charIcons.length) {
    charIcons.forEach(icon => {
      icon.addEventListener('click', e => {
        e.stopPropagation();
        const id = icon.dataset.char;
        const _lang = localStorage.getItem(LANG_KEY) || 'ja';
        const _base = charData[id];
        let d = _base;
        if (_lang === 'en' && charDataEn[id]) d = { ..._base, ...charDataEn[id] };
        else if (_lang === 'zh' && charDataZh[id]) d = { ..._base, ...charDataZh[id] };
        if (!d) return;
        // 同じアイコンを再クリック → 閉じる
        if (icon.classList.contains('active') && document.getElementById('charPopup')) {
          _closeCharPopup();
          return;
        }
        _openCharPopup(icon, d);
      });
    });
  }

  /* ── Gallery filter ── */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        galleryItems.forEach(item => {
          item.style.display = (cat === 'all' || item.dataset.category === cat) ? '' : 'none';
        });
      });
    });
  }

  /* ── Lightbox ── */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    document.querySelectorAll('.gallery-item:not(.gallery-item--video)').forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.dataset.img;
        const title  = item.querySelector('.art-title')?.textContent || '';
        if (imgSrc) {
          // 現在表示中のギャラリー画像を収集（フィルターで非表示のものを除く）
          const visible = Array.from(
            document.querySelectorAll('.gallery-item--img')
          ).filter(el => el.style.display !== 'none');
          const imgs = visible.map(el => ({
            src:   el.dataset.img,
            title: el.querySelector('.art-title')?.textContent || ''
          }));
          const idx = visible.indexOf(item);
          _openGalleryLightbox(imgs, idx >= 0 ? idx : 0);
          return;
        }
        const icon = item.querySelector('.art-icon')?.textContent || '🖼️';
        const desc = item.dataset.desc || 'ギャラリー画像';
        lightbox.querySelector('.lightbox-icon').textContent  = icon;
        lightbox.querySelector('.lightbox-title').textContent = title;
        lightbox.querySelector('.lightbox-desc').textContent  = desc;
        lightbox.classList.add('open');
      });
    });
    lightbox.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox.classList.remove('open'));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') lightbox.classList.remove('open'); });
  }

  /* ── Gallery Video Modal ── */
  const gvm = document.getElementById('gallery-video-modal');
  if (gvm) {
    const gvideo      = document.getElementById('gallery-video');
    const gvMute      = document.getElementById('gvm-mute-btn');
    const gvVol       = document.getElementById('gvm-vol');
    const gvSeek      = document.getElementById('gvm-seek');
    const gvCur       = document.getElementById('gvm-current');
    const gvDur       = document.getElementById('gvm-duration');
    const gvCloseBtn  = document.getElementById('gvm-close');
    const gvPipBtn    = document.getElementById('gvm-pip-btn');
    const gvFsBtn     = document.getElementById('gvm-fullscreen-btn');
    const gvPPBtn     = document.getElementById('gvm-playpause-btn');
    const gvSpinner   = document.getElementById('gvm-spinner');
    const gvSubEl      = document.getElementById('gvm-subtitle');
    const gvTelopEl    = document.getElementById('gvm-subtitle-telop');
    const gvCCBtn      = document.getElementById('gvm-cc-btn');
    let _bgmWasPlaying = false;
    let _isSeeking     = false;
    let _gvLastMain    = null;
    let _gvLastTelop   = null;

    function _gvSyncSub() {
      const subLang = _getSubLang();
      const telopSubs = (subLang !== 'off' && subLang !== 'ja') ? (_OVC_SUBS[subLang]      || []) : [];
      const mainSubs  = subLang !== 'off'                       ? (_OVC_SUBS_MAIN[subLang] || []) : [];
      const t = gvideo.currentTime;

      // テロップ（独立）
      if (gvTelopEl) {
        let ti = -1;
        for (let i = 0; i < telopSubs.length; i++) {
          if (t >= telopSubs[i].s && t <= telopSubs[i].e) ti = i;
        }
        if (ti !== _gvLastTelop) {
          _gvLastTelop = ti;
          if (ti < 0) {
            gvTelopEl.classList.remove('visible');
          } else {
            _applyTelopPos(gvTelopEl, telopSubs[ti]);
            gvTelopEl.innerHTML = telopSubs[ti].t.replace(/\n/g, '<br>');
            gvTelopEl.classList.add('visible');
          }
        }
      }

      // セリフ字幕（常に下中央）
      if (gvSubEl) {
        let mi = -1;
        for (let i = 0; i < mainSubs.length; i++) {
          if (t >= mainSubs[i].s && t <= mainSubs[i].e) mi = i;
        }
        if (mi !== _gvLastMain) {
          _gvLastMain = mi;
          if (mi < 0) {
            gvSubEl.classList.remove('visible');
          } else {
            gvSubEl.innerHTML = mainSubs[mi].t.replace(/\n/g, '<br>');
            gvSubEl.classList.add('visible');
          }
        }
      }
    }

    _initCCMenu('gvm-cc-btn', 'gvm-cc-menu', lang => {
      if (lang === 'off') {
        if (gvSubEl)   gvSubEl.classList.remove('visible');
        if (gvTelopEl) gvTelopEl.classList.remove('visible');
      }
      _gvLastMain = null; _gvLastTelop = null;
    });

    /* PiP非対応ブラウザではボタン非表示 */
    if (!document.pictureInPictureEnabled) gvPipBtn.style.display = 'none';

    /* iOS Safariは video.volume の変更を許可しない → 音量スライダーを非表示 */
    const _isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (_isIOS && gvVol) gvVol.style.display = 'none';

    function _bgmPause() {
      /* 「最初のクリックで自動再生」リスナーが残っていたらキャンセル */
      if (window._bgmCancelAutoStart) window._bgmCancelAutoStart();
      const bgm = document.getElementById('bgm-audio');
      if (bgm && !bgm.paused) { _bgmWasPlaying = true; bgm.pause(); }
      else { _bgmWasPlaying = false; }
    }
    function _bgmResume() {
      if (!_bgmWasPlaying) return;
      _bgmWasPlaying = false;
      const bgm = document.getElementById('bgm-audio');
      if (bgm) bgm.play().catch(() => {});
    }

    function _updatePPBtn() {
      gvPPBtn.textContent = gvideo.paused ? '▶ 再生' : '❚❚ 停止';
    }

    function gvCloseModal() {
      gvm.classList.remove('is-open');
      gvm.setAttribute('aria-hidden', 'true');
      gvideo.pause();
      gvideo.innerHTML = '';          // <source>要素をクリア
      gvideo.removeAttribute('src');
      gvideo.load();                  // リセット
      gvSpinner.classList.remove('is-active');
      if (gvSubEl) gvSubEl.classList.remove('visible');
      _gvLastKey = null;
      document.body.style.overflow = '';
      _bgmResume();
    }

    /* 再生/停止 */
    function _togglePlay() {
      if (gvideo.paused) { gvideo.play().catch(() => {}); }
      else               { gvideo.pause(); }
    }
    gvPPBtn.addEventListener('click', _togglePlay);
    gvideo.addEventListener('click', _togglePlay);

    /* 再生状態の同期 */
    gvideo.addEventListener('play',  _updatePPBtn);
    gvideo.addEventListener('pause', _updatePPBtn);

    /* バッファリングスピナー */
    gvideo.addEventListener('waiting',  () => gvSpinner.classList.add('is-active'));
    gvideo.addEventListener('playing',  () => gvSpinner.classList.remove('is-active'));
    gvideo.addEventListener('canplay',  () => gvSpinner.classList.remove('is-active'));

    gvCloseBtn.addEventListener('click', gvCloseModal);
    gvm.addEventListener('click', e => { if (e.target === gvm) gvCloseModal(); });
    document.addEventListener('keydown', e => {
      if (!gvm.classList.contains('is-open')) return;
      if (e.key === 'Escape') gvCloseModal();
      if (e.key === ' ' || e.key === 'k') { e.preventDefault(); _togglePlay(); }
    });

    gvideo.addEventListener('loadedmetadata', () => {
      gvDur.textContent = formatTime(gvideo.duration);
      gvSeek.max = gvideo.duration;
    });
    /* durationchange で長い動画の途中でdurationが確定した場合にも対応 */
    gvideo.addEventListener('durationchange', () => {
      if (gvideo.duration && isFinite(gvideo.duration)) {
        gvDur.textContent = formatTime(gvideo.duration);
        gvSeek.max = gvideo.duration;
      }
    });
    gvideo.addEventListener('timeupdate', () => {
      gvCur.textContent = formatTime(gvideo.currentTime);
      if (!_isSeeking && gvideo.duration) gvSeek.value = gvideo.currentTime;
      _gvSyncSub();
    });

    /* 終了時はリセットして停止（モーダルは閉じない） */
    gvideo.addEventListener('ended', () => {
      gvideo.currentTime = 0;
      gvSeek.value = 0;
      gvCur.textContent = '0:00';
      _updatePPBtn();
    });

    /* シークバー — ドラッグ中はtimeupdateに上書きさせない */
    gvSeek.addEventListener('mousedown',  () => { _isSeeking = true; });
    gvSeek.addEventListener('touchstart', () => { _isSeeking = true; }, { passive: true });
    gvSeek.addEventListener('input', () => {
      gvCur.textContent = formatTime(parseFloat(gvSeek.value));
      gvideo.currentTime = parseFloat(gvSeek.value);
    });
    gvSeek.addEventListener('mouseup',  () => { _isSeeking = false; });
    gvSeek.addEventListener('touchend', () => { _isSeeking = false; });

    gvMute.addEventListener('click', () => {
      gvideo.muted = !gvideo.muted;
      gvMute.textContent = gvideo.muted ? '🔇' : '🔊';
    });
    gvVol.addEventListener('input', () => { gvideo.volume = parseFloat(gvVol.value); });

    /* PiP */
    gvPipBtn.addEventListener('click', () => {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch(() => {});
      } else {
        gvideo.requestPictureInPicture().catch(() => {});
      }
    });
    gvideo.addEventListener('enterpictureinpicture', () => { gvPipBtn.textContent = 'PiP ✓'; });
    gvideo.addEventListener('leavepictureinpicture', () => { gvPipBtn.textContent = 'PiP'; });

    /* 全画面 */
    gvFsBtn.addEventListener('click', () => {
      const el = gvideo;
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        // iOS Safariは webkitEnterFullscreen()（video専用API）
        const reqFs = el.requestFullscreen || el.webkitEnterFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen;
        if (reqFs) reqFs.call(el).catch(() => {});
      } else {
        const exitFs = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen;
        if (exitFs) exitFs.call(document).catch(() => {});
      }
    });
    function _onFsChange() {
      const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
      gvFsBtn.textContent = isFs ? '縮小' : '全画面';
      if (isFs) {
        document.body.classList.remove('has-custom-cursor');
      } else {
        if (!window.matchMedia('(pointer: coarse)').matches) {
          document.body.classList.add('has-custom-cursor');
        }
      }
    }
    document.addEventListener('fullscreenchange', _onFsChange);
    document.addEventListener('webkitfullscreenchange', _onFsChange);

    document.querySelectorAll('.gallery-item--video').forEach(item => {
      item.addEventListener('click', () => {
        const src    = item.dataset.videoSrc;
        const poster = item.dataset.videoPoster || '';
        if (!src) return;
        gvideo.poster = poster;
        // iOS Safari対応: <source>要素方式（video.src直接代入より動作が安定）
        gvideo.innerHTML = '';
        const _srcEl = document.createElement('source');
        _srcEl.src  = src;
        _srcEl.type = 'video/mp4';
        gvideo.appendChild(_srcEl);
        gvideo.load();
        gvSeek.value  = 0;
        gvSeek.max    = 100;
        gvCur.textContent = '0:00';
        gvDur.textContent = '--:--';
        gvVol.value   = 1;
        gvideo.volume = 1;
        gvideo.muted  = false;
        gvMute.textContent = '🔊';
        gvPipBtn.textContent = 'PiP';
        gvFsBtn.textContent  = '全画面';
        gvPPBtn.textContent  = '▶ 再生';
        if (gvCCBtn) { _setCCBtn(gvCCBtn, _getSubLang()); _updateCCMenuActive(document.getElementById('gvm-cc-menu'), _getSubLang()); }
        _gvLastKey = null;
        gvm.classList.add('is-open');
        gvm.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        _bgmPause();
        gvideo.play().catch(() => {});
      });
    });
  }
}

/* ══════════════════════════════════════════════════════════
   CHARACTER POPUP
   アイコン近くにフローティング表示、外側で消える
   ══════════════════════════════════════════════════════════ */

let _charCloseTimer  = null;
let _charOutsideFn   = null;
let _charEscFn       = null;

function _openCharPopup(icon, d) {
  _closeCharPopup(true); // 既存ポップアップを即座に閉じる

  document.querySelectorAll('.char-icon').forEach(i => i.classList.remove('active'));
  icon.classList.add('active');

  /* トップ画像：mainImgSrc があれば横幅フルの元比率表示、なければ絵文字アバター */
  const topAreaHtml = d.mainImgSrc
    ? `<div class="char-popup-main-img-area">
         <img src="${d.mainImgSrc}" alt="${d.name}" class="char-popup-main-img-full"
              onerror="this.closest('.char-popup-main-img-area').outerHTML='<div class=\\'char-popup-avatar-only\\'><div class=\\'char-popup-avatar\\'style=\\'border-color:${d.color};box-shadow:0 0 22px ${d.color}55;\\'>${d.avatar}</div></div>'">
       </div>`
    : `<div class="char-popup-avatar-only">
         <div class="char-popup-avatar" style="border-color:${d.color};box-shadow:0 0 22px ${d.color}55;">${d.avatar}</div>
       </div>`;

  /* 詳細画像：detailImgSrc があれば本文最下部に配置 */
  const detailImgHtml = d.detailImgSrc
    ? `<div class="char-popup-detail-img-wrap">
         <div class="char-popup-detail-divider"></div>
         <img src="${d.detailImgSrc}" alt="${d.name} キャラクター詳細" class="char-popup-detail-img"
              loading="lazy"
              onerror="this.closest('.char-popup-detail-img-wrap').style.display='none'">
       </div>`
    : '';

  const popup = document.createElement('div');
  popup.id = 'charPopup';
  popup.className = 'char-popup';
  popup.setAttribute('role', 'dialog');
  popup.setAttribute('aria-label', d.name + ' 詳細');
  popup.innerHTML = `
    <div class="char-popup-topbar">
      <button class="char-popup-close" aria-label="閉じる">✕</button>
    </div>
    ${topAreaHtml}
    <div class="char-popup-body">
      <div class="char-popup-name">${d.name}</div>
      <div class="char-popup-namesub">${d.nameSub}</div>
      <div class="char-popup-badges">
        <span class="role-badge" style="margin:0;">${d.role}</span>
        <span class="country-badge" style="border-color:${d.color};color:${d.color};margin:0;">◆ ${d.country}</span>
      </div>
      <div class="char-attr-row"><span class="char-attr-label">外見</span>${d.appearance}</div>
      <div class="char-attr-row"><span class="char-attr-label">性格</span>${d.personality}</div>
      <p class="char-popup-desc">${d.desc}</p>
      <dl class="char-stats">
        <div class="char-stat"><dt>楽器</dt><dd>${d.instrument}</dd></div>
        <div class="char-stat"><dt>能力</dt><dd>${d.ability}</dd></div>
      </dl>
      ${detailImgHtml}
    </div>`;

  document.body.appendChild(popup);

  /* ── メイン画像クリック → ライトボックス ── */
  const mainImg = popup.querySelector('.char-popup-main-img-full');
  if (mainImg && d.mainImgSrc) {
    mainImg.style.cursor = 'zoom-in';
    mainImg.addEventListener('click', e => {
      e.stopPropagation();
      _openDetailLightbox(d.name, d.mainImgSrc);
    });
  }

  /* ── 詳細画像クリック → ライトボックス ── */
  const detailImg = popup.querySelector('.char-popup-detail-img');
  if (detailImg && d.detailImgSrc) {
    detailImg.addEventListener('click', e => {
      e.stopPropagation();
      _openDetailLightbox(d.name, d.detailImgSrc);
    });
  }

  _positionPopup(popup, icon);

  // アニメーション（2フレーム待ってクラス追加）
  requestAnimationFrame(() => requestAnimationFrame(() => popup.classList.add('show')));

  /* ── モバイル用背景暗幕 ── */
  let backdrop = document.getElementById('charBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'charBackdrop';
    backdrop.className = 'char-popup-backdrop';
    document.body.appendChild(backdrop);
  }
  requestAnimationFrame(() => backdrop.classList.add('active'));
  backdrop.onclick = () => _closeCharPopup();

  /* ── 閉じるボタン ── */
  popup.querySelector('.char-popup-close').addEventListener('click', e => {
    e.stopPropagation();
    _closeCharPopup();
  });

  /* ── ポップアップ外をホバー → 1000ms後に閉じる ── */
  popup.addEventListener('mouseleave', () => {
    _charCloseTimer = setTimeout(() => _closeCharPopup(), 1000);
  });
  popup.addEventListener('mouseenter', () => {
    if (_charCloseTimer) { clearTimeout(_charCloseTimer); _charCloseTimer = null; }
  });

  /* ── ポップアップ外クリック → 即座に閉じる ── */
  _charOutsideFn = e => {
    const p = document.getElementById('charPopup');
    if (!p) { document.removeEventListener('click', _charOutsideFn); return; }
    if (p.contains(e.target)) return;
    if (e.target.closest('.char-icon')) return; // アイコンクリックは別処理
    _closeCharPopup();
  };
  setTimeout(() => document.addEventListener('click', _charOutsideFn), 60);

  /* ── ESC キー ── */
  _charEscFn = e => { if (e.key === 'Escape') _closeCharPopup(); };
  document.addEventListener('keydown', _charEscFn);
}

function _closeCharPopup(immediate = false) {
  if (_charCloseTimer) { clearTimeout(_charCloseTimer); _charCloseTimer = null; }
  if (_charOutsideFn)  { document.removeEventListener('click', _charOutsideFn); _charOutsideFn = null; }
  if (_charEscFn)      { document.removeEventListener('keydown', _charEscFn);   _charEscFn = null; }

  document.querySelectorAll('.char-icon').forEach(i => i.classList.remove('active'));

  // 暗幕を消す
  const backdrop = document.getElementById('charBackdrop');
  if (backdrop) backdrop.classList.remove('active');

  const popup = document.getElementById('charPopup');
  if (!popup) return;

  if (immediate) { popup.remove(); return; }

  popup.classList.remove('show');
  popup.classList.add('hiding');
  setTimeout(() => popup?.remove(), 280);
}

function _positionPopup(popup, icon) {
  const r   = icon.getBoundingClientRect();
  const vw  = window.innerWidth;
  const vh  = window.innerHeight;
  const gap = 14;
  const popW = Math.min(460, vw - 32);

  popup.style.width = popW + 'px';

  /* ── モバイル（640px未満）: 画面中央・高さ90vh固定 ── */
  if (vw < 640) {
    popup.style.left      = Math.max(16, Math.round((vw - popW) / 2)) + 'px';
    popup.style.top       = Math.round(vh * 0.05) + 'px';
    popup.style.maxHeight = Math.round(vh * 0.90) + 'px';
    return;
  }

  /* ── デスクトップ: 右→左→中央 の優先順で配置 ── */
  let left = r.right + gap;
  if (left + popW > vw - 16)  left = r.left - popW - gap;  // 右に入らなければ左
  if (left < 16)               left = Math.max(16, Math.round((vw - popW) / 2)); // それでも無理なら中央

  // 縦方向：アイコン上端に合わせて、はみ出ないようにクランプ
  let top = r.top;
  const estHeight = Math.min(560, vh - 100);
  if (top + estHeight > vh - 20) top = Math.max(80, vh - estHeight - 20);
  if (top < 80) top = 80;

  popup.style.left = Math.round(left) + 'px';
  popup.style.top  = Math.round(top) + 'px';
  popup.style.maxHeight = Math.round(vh - top - 20) + 'px';
}

/* ══════════════════════════════════════════════════════════
   DETAIL IMAGE LIGHTBOX
   ══════════════════════════════════════════════════════════ */
function _openDetailLightbox(name, imgSrc) {
  const existing = document.getElementById('detailLightbox');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'detailLightbox';
  overlay.className = 'detail-lightbox';
  overlay.innerHTML = `
    <div class="detail-lightbox-inner">
      <button class="detail-lightbox-close" aria-label="閉じる">✕ CLOSE</button>
      <img src="${imgSrc}" alt="${name} キャラクター詳細" class="detail-lightbox-img" loading="lazy">
    </div>`;
  document.body.appendChild(overlay);

  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('open')));

  function closeLightbox() {
    overlay.classList.remove('open');
    setTimeout(() => overlay?.remove(), 320);
    document.removeEventListener('keydown', onKeyDown);
  }
  function onKeyDown(e) { if (e.key === 'Escape') closeLightbox(); }

  overlay.addEventListener('click', e => {
    if (e.target === overlay) { closeLightbox(); return; }
    if (e.target.classList.contains('detail-lightbox-img')) { closeLightbox(); return; }
    if (e.target.closest('.detail-lightbox-close')) { closeLightbox(); return; }
  });
  document.addEventListener('keydown', onKeyDown);
}

function _openGalleryLightbox(images, startIdx) {
  const existing = document.getElementById('galleryLightbox');
  if (existing) existing.remove();

  let idx = startIdx || 0;

  const arrowStyle = 'position:absolute;top:50%;transform:translateY(-50%);' +
    'background:rgba(20,5,40,0.6);border:1px solid rgba(201,162,39,0.5);' +
    'color:#e8c96a;font-size:2rem;width:2.8rem;height:2.8rem;border-radius:50%;' +
    'cursor:pointer;display:flex;align-items:center;justify-content:center;' +
    'transition:background 0.2s;line-height:1;z-index:1;';

  const overlay = document.createElement('div');
  overlay.id = 'galleryLightbox';
  overlay.className = 'detail-lightbox';
  overlay.innerHTML =
    '<div class="detail-lightbox-inner" style="position:relative;">' +
      '<button class="detail-lightbox-close" id="glb-close">✕ CLOSE</button>' +
      '<img id="glb-img" class="detail-lightbox-img" src="" alt="" style="transition:opacity 0.15s ease;">' +
      '<div id="glb-label" style="text-align:center;color:rgba(255,255,255,0.65);font-size:0.8rem;' +
        'margin-top:0.5rem;letter-spacing:0.12em;font-family:var(--font-heading);"></div>' +
      '<button id="glb-prev" aria-label="前の画像" style="' + arrowStyle + 'left:-3.4rem;">&#8249;</button>' +
      '<button id="glb-next" aria-label="次の画像" style="' + arrowStyle + 'right:-3.4rem;">&#8250;</button>' +
    '</div>';
  document.body.appendChild(overlay);

  const glbImg   = document.getElementById('glb-img');
  const glbLabel = document.getElementById('glb-label');

  function showSlide(i) {
    idx = (i + images.length) % images.length;
    glbImg.style.opacity = '0';
    setTimeout(() => {
      glbImg.src = images[idx].src;
      glbImg.alt = images[idx].title;
      glbLabel.textContent = (idx + 1) + ' / ' + images.length + '　' + images[idx].title;
      glbImg.style.opacity = '1';
    }, 150);
  }

  showSlide(idx);

  document.getElementById('glb-prev').addEventListener('click', e => { e.stopPropagation(); showSlide(idx - 1); });
  document.getElementById('glb-next').addEventListener('click', e => { e.stopPropagation(); showSlide(idx + 1); });

  function closeLightbox() {
    overlay.classList.remove('open');
    setTimeout(() => overlay?.remove(), 320);
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e) {
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  { e.preventDefault(); showSlide(idx - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); showSlide(idx + 1); }
  }

  document.getElementById('glb-close').addEventListener('click', e => { e.stopPropagation(); closeLightbox(); });
  overlay.addEventListener('click', e => { if (e.target === overlay) closeLightbox(); });
  document.addEventListener('keydown', onKey);

  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('open')));
}

/* ══════════════════════════════════════════════════════════
   LANGUAGE / i18n
   data-i18n="key" を持つ要素を setLanguage() で切り替え
   英訳は i18n_en に集約。日本語は HTML の初期テキストを data-ja に自動保存。
   ══════════════════════════════════════════════════════════ */

const LANG_KEY = 'siteLanguage';

/* ── CC字幕言語設定（グローバル共有） ── */
const SUBS_KEY  = 'subtitle_lang';                          // 'ja'|'en'|'zh'|'off'
const _CC_LABEL = { off: 'CC', ja: 'JP', en: 'EN', zh: '中' };
function _getSubLang() {
  const stored = localStorage.getItem(SUBS_KEY);
  if (stored !== null) return stored;
  // 初回アクセス：ブラウザ言語が日本語ならJP字幕ON、それ以外はOFF
  const bl = (navigator.language || navigator.userLanguage || '').toLowerCase();
  return bl.startsWith('ja') ? 'ja' : 'off';
}
function _setCCBtn(btn, lang) {
  if (!btn) return;
  btn.textContent = _CC_LABEL[lang] || 'CC';
  btn.setAttribute('aria-pressed', lang !== 'off' ? 'true' : 'false');
}
function _updateCCMenuActive(menu, lang) {
  if (!menu) return;
  menu.querySelectorAll('.cc-menu__item').forEach(item => {
    item.classList.toggle('active', item.dataset.lang === lang);
  });
}
function _applySubLang(lang) {
  localStorage.setItem(SUBS_KEY, lang);
  ['ovc-cc-btn', 'gvm-cc-btn'].forEach(id => _setCCBtn(document.getElementById(id), lang));
  ['ovc-cc-menu', 'gvm-cc-menu'].forEach(id => _updateCCMenuActive(document.getElementById(id), lang));
}
function _applyTelopPos(el, entry) {
  ['pos-bl','pos-br','pos-tl','pos-tr'].forEach(c => el.classList.remove(c));
  if (entry && entry.p) el.classList.add('pos-' + entry.p);
}
function _initCCMenu(btnId, menuId, onSelect) {
  const btn  = document.getElementById(btnId);
  const menu = document.getElementById(menuId);
  if (!btn || !menu) return;
  _setCCBtn(btn, _getSubLang());
  _updateCCMenuActive(menu, _getSubLang());
  btn.addEventListener('click', e => {
    e.stopPropagation();
    ['ovc-cc-menu', 'gvm-cc-menu'].forEach(id => {
      const m = document.getElementById(id);
      if (m && id !== menuId) m.hidden = true;
    });
    _updateCCMenuActive(menu, _getSubLang());
    menu.hidden = !menu.hidden;
  });
  menu.querySelectorAll('.cc-menu__item').forEach(item => {
    item.addEventListener('click', e => {
      e.stopPropagation();
      _applySubLang(item.dataset.lang);
      menu.hidden = true;
      if (onSelect) onSelect(item.dataset.lang);
    });
  });
}

/* ── 字幕データ（テロップ＋セリフ）opening.mp4 共通 ── */
const _OVC_SUBS = {
  ja: [
    { s:  0.067, e:  4.633, t: '原作　アルス・ダ・ヴィンチ\n『ミュージックワールド』～バイオリン姫と魔法のシンフォニー～　文芸社' },
    { s: 20.200, e: 23.467, t: 'ゲンガク国のお姫様\nバイオリン姫',                                                              p: 'bl' },
    { s: 22.733, e: 26.033, t: 'ケンバンガク国の王子様\nピアノ王子',                                                            p: 'tr' },
    { s: 27.700, e: 31.000, t: 'カンガク国の騎士\nアルト・サクソフォーン',                                                      p: 'tr' },
    { s: 32.733, e: 36.033, t: 'ゲンガク国の女王\nハープ女王',                                                                  p: 'bl' },
    { s: 57.133, e: 61.433, t: 'ケンバンガク国の魔女\nパイプオルガン',                                                          p: 'br' },
    { s: 63.300, e: 66.233, t: 'ダ国の木琴兄妹\nマリンバ＆シロフォン' },
    { s: 66.233, e: 69.667, t: 'ダガク国の民\nカスタネット坊や',                                                                p: 'tr' },
    { s: 77.267, e: 80.700, t: 'ダガク国の王様\nティンパニー大王',                                                              p: 'tl' },
    { s: 83.233, e: 86.400, t: 'ドレミの森の指揮者\nタクト・マエストロ',                                                        p: 'bl' },
    { s:102.300, e:106.300, t: '日本語版エンドソング\n「シンフォニー・オブ・ワンワールド」  performed by DJ らむね' },
  ],
  en: [
    { s:  0.067, e:  4.633, t: 'Original Work: Ars Da Vinci\n"MUSIC WORLD" ~The Violin Princess and the Magic Symphony~  Bungeisha' },
    { s: 20.200, e: 23.467, t: 'Princess of the String Kingdom\nViolin Princess',          p: 'bl' },
    { s: 22.733, e: 26.033, t: 'Prince of the Keyboard Kingdom\nPiano Prince',             p: 'tr' },
    { s: 27.700, e: 31.000, t: 'Knight of the Wind Kingdom\nAlto Saxophone',               p: 'tr' },
    { s: 32.733, e: 36.033, t: 'Queen of the String Kingdom\nHarp Queen',                  p: 'bl' },
    { s: 57.133, e: 61.433, t: 'Witch of the Keyboard Kingdom\nPipe Organ',                p: 'br' },
    { s: 63.300, e: 66.233, t: 'Xylophone Siblings of Da Kingdom\nMarimba & Xylophone' },
    { s: 66.233, e: 69.667, t: 'Child of the Percussion Kingdom\nCastanets Boy',           p: 'tr' },
    { s: 77.267, e: 80.700, t: 'King of the Percussion Kingdom\nTympani the Great',        p: 'tl' },
    { s: 83.233, e: 86.400, t: 'Conductor of the Do-Re-Mi Forest\nTact Maestro',           p: 'bl' },
    { s:102.300, e:106.300, t: 'End Song (Japanese Ver.)\n"Symphony of One World"  performed by DJ Ramune' },
  ],
  zh: [
    { s:  0.067, e:  4.633, t: '原著：阿尔斯·达·芬奇\n《音乐世界》～小提琴公主与魔法交响乐～　文艺社' },
    { s: 20.200, e: 23.467, t: '弦乐国的公主\n小提琴公主',       p: 'bl' },
    { s: 22.733, e: 26.033, t: '键盘乐国的王子\n钢琴王子',       p: 'tr' },
    { s: 27.700, e: 31.000, t: '管乐国的骑士\n中音萨克斯',       p: 'tr' },
    { s: 32.733, e: 36.033, t: '弦乐国的女王\n竖琴女王',         p: 'bl' },
    { s: 57.133, e: 61.433, t: '键盘乐国的魔女\n管风琴',         p: 'br' },
    { s: 63.300, e: 66.233, t: '打乐国的木琴兄妹\n马林巴＆木琴' },
    { s: 66.233, e: 69.667, t: '打乐国的孩子\n响板小弟',         p: 'tr' },
    { s: 77.267, e: 80.700, t: '打乐国的国王\n定音鼓大王',       p: 'tl' },
    { s: 83.233, e: 86.400, t: '多来咪森林的指挥家\n塔克特·大师', p: 'bl' },
    { s:102.300, e:106.300, t: '日语版片尾曲\n《一个世界的交响乐》  演唱：DJ Ramune' },
  ],
};
const _OVC_SUBS_MAIN = {
  ja: [
    { s:  4.667, e:  9.367, t: 'あるところに音楽で会話をする4つの国がありました' },
    { s:  9.367, e: 12.033, t: '管楽器のカンガク国' },
    { s: 12.033, e: 14.300, t: '打楽器のダガク国' },
    { s: 14.300, e: 16.700, t: '鍵盤楽器のケンバンガク国' },
    { s: 16.700, e: 20.200, t: 'そして弦楽器のゲンガク国' },
    { s: 20.200, e: 24.000, t: 'それぞれの音色と文化を育みながら平和に暮らしていました' },
    { s: 24.000, e: 25.600, t: 'ここはゲン族の土地だったのか' },
    { s: 25.600, e: 27.700, t: 'すまない。ある人を探していただけだ' },
    { s: 27.700, e: 29.267, t: '俺はカンガク国、吹奏楽騎士団大将' },
    { s: 29.533, e: 30.400, t: 'アルト・サクソフォーン' },
    { s: 30.467, e: 33.067, t: '我々に協力しないとこの国も滅びるぞ' },
    { s: 33.067, e: 34.000, t: 'どんな理由があろうと' },
    { s: 34.000, e: 35.567, t: '我らゲン族は戦争には協力しません' },
    { s: 35.567, e: 37.000, t: 'お引き取り願おう' },
    { s: 37.000, e: 38.000, t: 'ならば仕方あるまい' },
    { s: 38.000, e: 40.367, t: '誰も傷つけずにどうやって世界を支配しようというの！' },
    { s: 40.400, e: 42.100, t: 'ダガク国、カンガク国' },
    { s: 42.100, e: 44.000, t: '次はここが襲われるんだぞ！' },
    { s: 44.267, e: 46.267, t: 'おんぷ橋を渡り、そこに住んでいる' },
    { s: 46.267, e: 48.167, t: 'マスタータクトという老人に会いなさい。' },
    { s: 48.167, e: 49.700, t: '必ず知恵を与えてくれるはず' },
    { s: 50.300, e: 52.100, t: 'あなたのことは嫌いだけど...' },
    { s: 52.200, e: 54.400, t: '...家族と私の民を救うためにも' },
    { s: 54.433, e: 56.000, t: '行け！みんなのもの！' },
    { s: 57.033, e: 58.700, t: '音色が違う異種族同士では' },
    { s: 58.700, e: 60.567, t: '美しい音楽を奏でることなど' },
    { s: 61.133, e: 62.700, t: '到底無理なのだ' },
    { s: 66.167, e: 67.500, t: 'ダ族の民だ' },
    { s: 67.667, e: 70.033, t: '関わるとろくなことがないぞ' },
    { s: 77.033, e: 80.700, t: 'なんとも美しいハーモニーじゃったわい！' },
    { s: 80.700, e: 83.567, t: 'あ、邪魔しちゃったかのう、続けて！続けて！' },
    { s: 83.567, e: 86.733, t: 'この譜面を演奏できるように修行しなさい' },
    { s: 86.733, e: 89.067, t: 'シンフォニー・オブ・ワンワールド' },
    { s: 91.533, e: 93.600, t: '今のメロディーは私が主役でしょ！？' },
    { s: 93.600, e: 95.200, t: 'は？流れを引っ張ってたのは俺だろ！' },
    { s: 95.200, e: 96.067, t: 'ですよね！？' },
    { s: 99.200, e:100.667, t: '勝手に走り出しやがって！' },
    { s:101.033, e:102.133, t: 'バカヤロー！！' },
    { s:106.333, e:108.400, t: '異なる音色が重なり合うとき' },
    { s:108.567, e:110.233, t: '新たなハーモニーが生まれる' },
    { s:110.733, e:115.600, t: '果たしてバイオリン姫は世界を救うことができるのか' },
    { s:116.267, e:117.667, t: 'スタッカート！！' },
    { s:117.667, e:119.433, t: 'おいばか！やめろ！' },
    { s:119.433, e:121.767, t: 'これで借り一つ返したから！あと一つね！' },
    { s:121.767, e:123.467, t: 'いや！もう返さなくていい！！' },
    { s:126.767, e:128.467, t: 'ミュージックワールド' },
    { s:128.633, e:131.567, t: 'バイオリン姫と魔法のシンフォニー' },
  ],
  en: [
    { s:  4.667, e:  9.367, t: 'Once upon a time, there were four kingdoms that communicated through music.' },
    { s:  9.367, e: 12.033, t: 'The wind instrument kingdom — Kangaku' },
    { s: 12.033, e: 14.300, t: 'The percussion kingdom — Dagaku' },
    { s: 14.300, e: 16.700, t: 'The keyboard kingdom — Kenbangaku' },
    { s: 16.700, e: 20.200, t: 'And the string instrument kingdom — Gengaku' },
    { s: 20.200, e: 24.000, t: 'Each nurtured its own culture and sound, living in peace.' },
    { s: 24.000, e: 25.600, t: 'So this was Geng clan territory.' },
    { s: 25.600, e: 27.700, t: 'My apologies. I was only searching for someone.' },
    { s: 27.700, e: 29.267, t: 'I am the Grand Commander of the Wind Knight Order of Kangaku—' },
    { s: 29.533, e: 30.400, t: 'Alto Saxophone.' },
    { s: 30.467, e: 33.067, t: 'Cooperate with us, or this kingdom will fall.' },
    { s: 33.067, e: 34.000, t: 'No matter the reason—' },
    { s: 34.000, e: 35.567, t: 'We of the Geng clan will not take part in war.' },
    { s: 35.567, e: 37.000, t: 'I must ask you to leave.' },
    { s: 37.000, e: 38.000, t: 'Then so be it.' },
    { s: 38.000, e: 40.367, t: 'How do you intend to rule the world without hurting anyone?!' },
    { s: 40.400, e: 42.100, t: 'Dagaku, Kangaku—' },
    { s: 42.100, e: 44.000, t: 'This place will be next!' },
    { s: 44.267, e: 46.267, t: 'Cross the Onpu Bridge and find the elder who lives there—' },
    { s: 46.267, e: 48.167, t: 'An old man named Master Tact.' },
    { s: 48.167, e: 49.700, t: 'He will surely grant you wisdom.' },
    { s: 50.300, e: 52.100, t: "I don't like you, but..." },
    { s: 52.200, e: 54.400, t: '...to save my family and my people—' },
    { s: 54.433, e: 56.000, t: 'Go! All of you!' },
    { s: 57.033, e: 58.700, t: 'For beings of different tones—' },
    { s: 58.700, e: 60.567, t: 'To perform beautiful music together...' },
    { s: 61.133, e: 62.700, t: 'Is simply impossible.' },
    { s: 66.167, e: 67.500, t: 'A member of the Dah clan.' },
    { s: 67.667, e: 70.033, t: 'Getting involved will only bring trouble.' },
    { s: 77.033, e: 80.700, t: 'What a beautiful harmony!' },
    { s: 80.700, e: 83.567, t: 'Oh, have I interrupted? Please continue! Continue!' },
    { s: 83.567, e: 86.733, t: 'Train until you can perform this score.' },
    { s: 86.733, e: 89.067, t: 'Symphony of One World' },
    { s: 91.533, e: 93.600, t: 'That melody just now — I was the lead, right?!' },
    { s: 93.600, e: 95.200, t: 'What? I was carrying the whole flow!' },
    { s: 95.200, e: 96.067, t: 'Right?!' },
    { s: 99.200, e:100.667, t: 'You went off on your own!' },
    { s:101.033, e:102.133, t: 'You idiot!!' },
    { s:106.333, e:108.400, t: 'When different sounds come together—' },
    { s:108.567, e:110.233, t: 'A new harmony is born.' },
    { s:110.733, e:115.600, t: 'Can Violin Princess save the world?' },
    { s:116.267, e:117.667, t: 'Staccato!!' },
    { s:117.667, e:119.433, t: 'Hey, you fool! Stop!' },
    { s:119.433, e:121.767, t: "Now we're even — one debt paid! One more to go!" },
    { s:121.767, e:123.467, t: "No! You don't have to pay it back!!" },
    { s:126.767, e:128.467, t: 'Music World' },
    { s:128.633, e:131.567, t: 'Violin Princess and the Magic Symphony' },
  ],
  zh: [
    { s:  4.667, e:  9.367, t: '从前，有四个用音乐交流的王国。' },
    { s:  9.367, e: 12.033, t: '管乐器王国——管乐国' },
    { s: 12.033, e: 14.300, t: '打击乐器王国——打乐国' },
    { s: 14.300, e: 16.700, t: '键盘乐器王国——键盘乐国' },
    { s: 16.700, e: 20.200, t: '还有弦乐器王国——弦乐国' },
    { s: 20.200, e: 24.000, t: '各国孕育着独特的音色与文化，和平共处。' },
    { s: 24.000, e: 25.600, t: '原来这是弦族的领地。' },
    { s: 25.600, e: 27.700, t: '抱歉，我只是在寻找一个人。' },
    { s: 27.700, e: 29.267, t: '我是管乐国吹奏骑士团大将——' },
    { s: 29.533, e: 30.400, t: '中音萨克斯风。' },
    { s: 30.467, e: 33.067, t: '若不合作，这个国家也将灭亡。' },
    { s: 33.067, e: 34.000, t: '不管什么理由——' },
    { s: 34.000, e: 35.567, t: '我们弦族不参与战争。' },
    { s: 35.567, e: 37.000, t: '请你离开。' },
    { s: 37.000, e: 38.000, t: '那就没办法了。' },
    { s: 38.000, e: 40.367, t: '你打算不伤害任何人就统治世界？！' },
    { s: 40.400, e: 42.100, t: '打乐国、管乐国——' },
    { s: 42.100, e: 44.000, t: '下一个就是这里了！' },
    { s: 44.267, e: 46.267, t: '渡过音符桥，去拜访那里住的——' },
    { s: 46.267, e: 48.167, t: '一位叫做塔克特大师的老人。' },
    { s: 48.167, e: 49.700, t: '他一定会赐予你智慧。' },
    { s: 50.300, e: 52.100, t: '我不喜欢你，但是……' },
    { s: 52.200, e: 54.400, t: '……为了我的家人和族人——' },
    { s: 54.433, e: 56.000, t: '去吧！大家一起！' },
    { s: 57.033, e: 58.700, t: '不同音色的异族之间——' },
    { s: 58.700, e: 60.567, t: '想要演奏出美丽的音乐……' },
    { s: 61.133, e: 62.700, t: '根本是不可能的事。' },
    { s: 66.167, e: 67.500, t: '是打族的人。' },
    { s: 67.667, e: 70.033, t: '跟他们扯上关系只会惹麻烦。' },
    { s: 77.033, e: 80.700, t: '真是美妙的和声！' },
    { s: 80.700, e: 83.567, t: '啊，我打扰了吗？请继续！继续！' },
    { s: 83.567, e: 86.733, t: '修行直到你能演奏这份乐谱。' },
    { s: 86.733, e: 89.067, t: '一个世界的交响乐' },
    { s: 91.533, e: 93.600, t: '刚才的旋律我才是主角吧！？' },
    { s: 93.600, e: 95.200, t: '什么？引领旋律走向的是我！' },
    { s: 95.200, e: 96.067, t: '对吧！？' },
    { s: 99.200, e:100.667, t: '你擅自冲出去！' },
    { s:101.033, e:102.133, t: '笨蛋！！' },
    { s:106.333, e:108.400, t: '当不同的音色交汇——' },
    { s:108.567, e:110.233, t: '新的和声便诞生了。' },
    { s:110.733, e:115.600, t: '小提琴公主究竟能否拯救世界？' },
    { s:116.267, e:117.667, t: '断奏！！' },
    { s:117.667, e:119.433, t: '喂，蠢货！停下！' },
    { s:119.433, e:121.767, t: '这样我就还了一个人情！还剩一个！' },
    { s:121.767, e:123.467, t: '不！不用还了！！' },
    { s:126.767, e:128.467, t: '音乐世界' },
    { s:128.633, e:131.567, t: '小提琴公主与魔法交响乐' },
  ],
};

/* ── 英語翻訳辞書 ── */
const i18n_en = {
  /* ─ ナビ共通 ─ */
  'nav-logo-title':'Music World',
  'nav-logo-sub':'Violin Princess & the Magic Symphony',
  'nav-top':'Top','nav-story':'Story','nav-characters':'Characters',
  'nav-world':'World','nav-gallery':'Gallery','nav-lyrics':'Lyrics','nav-book':'Book',
  'book-title':'Get the Picture Book | Music World',
  'book-eyebrow':'Original Picture Book',
  'book-hero-title':'Get the Book',
  'book-hero-sub':'The original picture book behind this website — available now',
  'book-meta-author':'Author','book-meta-pub':'Publisher',
  'book-meta-date':'Release','book-meta-date-val':'February 2024',
  'book-meta-pages':'Pages','book-price-note':'(tax incl.)',
  'book-stores-heading':'Where to Buy',
  'book-btn-buy':'Buy Now →','book-btn-preview':'Preview →',
  'book-amazon-detail':'Fast delivery. Free shipping for Prime members.<br>Review: 5.0 ★★★★★',
  'book-rakuten-detail':'Earn Rakuten Points.<br>Free shipping on orders ¥3,000+. In stock.',
  'book-tower-detail':'20% point reward (280pt).<br>Books & picture books available.',
  'book-yodobashi-detail':'278 Gold Points reward (20% equivalent).<br>E-book version available (Doly app).',
  'book-google-detail':'Preview available on Google Books.<br>Readable in your browser instantly.',
  'book-google-free':'Free preview available',
  'book-yahoo-detail':'Earn PayPay points.<br>Great deals for SoftBank / Y! Mobile users.',
  'book-affiliate-note':'※ Some links above are affiliate links. Purchases made through these links provide a small commission to the production team. Your support helps make the next story possible.',
  'modal-opening-title':'Open the doors to Music World?',
  'modal-btn-watch':'Watch Opening',
  'modal-btn-skip':'Go to Story Now',
  'bgm-sub':'Violin Princess & the Magic Symphony BGM',
  'lyrics-title':'Lyrics — Symphony of One World | Music World',
  'lyrics-eyebrow':'Theme Song · Lyrics',
  'lyrics-sub':'Music World Main Theme',
  'lyrics-credits':'Music & Lyrics: PYONPY  /  Vocal: DJ RAMUNE',
  'lyrics-player-label':'♪ Now Playing',
  'lyrics-sec-verse1':'Verse 1','lyrics-sec-verse2':'Verse 2',
  'lyrics-sec-pre':'Pre-Chorus','lyrics-sec-chorus':'Chorus',
  'lyrics-sec-bridge':'Bridge','lyrics-sec-final':'Final Chorus',
  /* ─ 歌詞本文 ─ */
  'lyrics-v1-1':'When strings are calling, the winds start dancing',
  'lyrics-v1-2':'When reeds are rising, walls fall away',
  'lyrics-v1-3':'When drums are beating, the earth starts trembling',
  'lyrics-v1-4':'When keys awaken, tomorrow will change',
  'lyrics-v2-1':'Even the songs of distant nations',
  'lyrics-v2-2':'Can become one when they meet in the air',
  'lyrics-v2-3':'Though we may not understand at first',
  'lyrics-v2-4':'A day will come when hearts align',
  'lyrics-v2-5':'Different melodies, different rhythms',
  'lyrics-v2-6':'Woven together, they shine',
  'lyrics-pre-1':'Let the noise of anger fade now',
  'lyrics-pre-2':'Come and join your heart with mine',
  'lyrics-cho-2':'Rise into the sky',
  'lyrics-cho-3':'Different voices, joined together',
  'lyrics-cho-4':'Become a single light',
  'lyrics-cho-6':'Carry far and wide',
  'lyrics-cho-7':'Every land and every soul',
  'lyrics-cho-8':'Singing side by side',
  'lyrics-br-1':'When different colors of sound are meeting',
  'lyrics-br-2':'The world becomes a brand new song',
  'lyrics-br-3':'Melodies from far-off places',
  'lyrics-br-4':'Now resound where all belong',
  'lyrics-br-5':'Your rhythm and my own heartbeat',
  'lyrics-br-6':'Find each other in the dark',
  'lyrics-br-7':'Reaching far beyond the horizon',
  'lyrics-br-8':'A symphony of peace begins',
  'lyrics-fc-2':'Echo endlessly',
  'lyrics-fc-3':'Different dreams, when joined together',
  'lyrics-fc-4':'Shape tomorrow\'s melody',
  'lyrics-fc-6':'Spread across the sky',
  'lyrics-fc-7':'Every land and every soul',
  'lyrics-fc-8':'Bound in harmony',
  'footer-logo':'Music World',
  'footer-sub':'Violin Princess and the Magic Symphony',
  'footer-link-top':'Top','footer-link-story':'Story',
  'footer-link-characters':'Characters','footer-link-world':'World',
  'footer-link-gallery':'Gallery','footer-link-lyrics':'Lyrics','footer-link-book':'Book',
  'footer-copy2':'This site is the official site of a fictional work.',
  /* ─ ボタン共通 ─ */
  'btn-view-story':'View Story','btn-meet-characters':'Meet the Characters',
  'btn-view-characters':'View Characters','btn-to-worldmap':'World Map',
  'btn-to-gallery':'To Gallery','btn-to-story':'To Story',
  'btn-press-kit':'Request Press Kit',
  /* ─ index.html ─ */
  'index-title':'Music World ~ Violin Princess and the Magic Symphony ~ | Official Site',
  'index-tagline':'A symphony that saves the world, woven from different tones——<br>When the music of four kingdoms becomes one, a miracle is born.',
  'index-announce':'✦ &nbsp; 24 Chapters Complete &nbsp;&nbsp;|&nbsp;&nbsp; Four Kingdoms · 19 Characters &nbsp;&nbsp;|&nbsp;&nbsp; BGM "Symphony of One World" &nbsp; ✦',
  'index-section-title':'A Story of Different Tones Saving the World',
  'index-card1-h':'Music is Magic',
  'index-card1-p':'Strings, winds, percussion, keys—each kingdom\'s instrument carries its own magical power. The delicate melody of Violin Princess holds the power to move hearts and change the world.',
  'index-card2-h':'Four Rival Kingdoms',
  'index-card2-p':'Gengaku, Kangaku, Dagaku, Kenbangaku—each with unique culture and musical magic, the story of four kingdoms caught between conflict and friendship.',
  'index-card3-h':'A Moving Symphony',
  'index-card3-p':'Teaming up with former enemies, deepening bonds with allies, learning from a master—all journeys converge into one symphony whose climax will forever stir the hearts of all who witness it.',
  'index-card4-h':'An Epic Story of 24 Chapters',
  'index-card4-p':'From a princess\'s escape after her family is taken, training with a master, bonds with allies, to a Grand Symphony that saves the world—a deep, moving story spanning 24 chapters.',
  'index-nav-story-sub':'World, synopsis & chapter list',
  'index-nav-char-sub':'19 colorful characters',
  'index-nav-world-sub':'The four musical kingdoms',
  'index-nav-gallery-sub':'Stills, artwork & design sheets',
  /* ─ story.html ─ */
  'story-title':'Story | Music World ~ Violin Princess and the Magic Symphony ~',
  'story-hero-h1':'Story',
  'story-h2':'A Symphony Woven from Different Tones to Save the World',
  'story-p1':'In a world where music becomes magic—the Musica Continent is home to four kingdoms, each with distinct music: strings, winds, percussion, and keys. The long-held balance is shattered one day by a sudden invasion from the Kenbangaku Kingdom.',
  'story-p2':'Violin Princess, royal daughter of the Gengaku Kingdom, loses her family in the attack and is driven from her homeland alone. In despair, she encounters Sax, the general of the enemy Kangaku Kingdom, and reluctantly chooses to fight alongside him.',
  'story-quote':'"Music is—the cry of the heart.<br>More honest than any words, it reaches the world."',
  'story-quote-attr':'— Master Takt Maestro',
  'story-p3':'Training under legendary musician Master Takt, the group deepens bonds with allies from the Dagaku Kingdom. When they learn of the true mastermind—the Pipe Organ Witch—they head to Kenbangaku castle to save their captured families and people.',
  'story-p4':'Strings, winds, percussion, keys—can a symphony played by those of different tones truly hold the power to save the world?',
  'story-chapters-title':'24 Chapters — Chapter List',
  'story-visual-label':'Violin Princess and the Magic Symphony',
  'story-gallery-h':'STORY VISUAL GALLERY',
  'ch1-title':'"The World of Music"','ch1-desc':'Four kingdoms spread across the music star. Each nation\'s unique tone is their pride — and the beginning of their division.',
  'ch2-title':'"Violin Princess\'s Morning"','ch2-desc':'A mysterious melody interrupts her peaceful morning practice. Led by the sound, the Princess begins to run.',
  'ch3-title':'"Encounter with a Mysterious Man"','ch3-desc':'Deep in the forest, a man in a black cloak. His beautiful music is etched deep into the Violin Princess\'s heart.',
  'ch4-title':'"Visitor from Kangaku"','ch4-desc':'A sudden visitor forces a cruel choice. A peaceful daily life is turned upside down.',
  'ch5-title':'"Forced Alliance"','ch5-desc':'Two who should be enemies exchange words for the first time beneath the moonlight.',
  'ch6-title':'"The Invasion"','ch6-desc':'A giant shadow covers the sky. The overwhelming power of the mightiest military nation swallows everything.',
  'ch7-title':'"A Narrow Escape"','ch7-desc':'Supported by their companions\' desperate resolve, a single thread of hope is grasped from the depths of despair.',
  'ch8-title':'"Escape into the Forest"','ch8-desc':'Watching their loved ones from afar, the two make a solemn vow.',
  'ch9-title':'"Meeting Castanet"','ch9-desc':'A small guide appears in the forest. The clicking sound begins to move fate.',
  'ch10-title':'"Master Tact\'s Story"','ch10-desc':'A legendary old musician reveals the truth of the world. The father the Princess never knew is brought to light.',
  'ch11-title':'"The Path to Harmony"','ch11-desc':'Clashing yet slowly changing — the days of training nurture a bond between them.',
  'ch12-title':'"First Ensemble"','ch12-desc':'The moment two separate melodies overlap for the first time. A brief, miraculous instant is born.',
  'ch13-title':'"Synchronized Tones"','ch13-desc':'Eyes closed, feeling each other only through sound. Through music, heart draws closer to heart.',
  'ch14-title':'"The Symphony\'s Melody"','ch14-desc':'Hidden within the final trial, the true meaning of music. The answer the two arrive at.',
  'ch15-title':'"New Companions"','ch15-desc':'Training complete, a journey toward new lands begins. Ancient history becomes the key to the future.',
  'ch16-title':'"Percussion Village"','ch16-desc':'An unknown land ruled by rhythm. Unseen cultures and a warm welcome await.',
  'ch17-title':'"Meeting the Xylophone Siblings"','ch17-desc':'Bright and reliable new companions appear. Farewells and meetings intersect.',
  'ch18-title':'"Temple Infiltration"','ch18-desc':'They risk danger to enter the temple and meet the Great King. An unexpected incident decides fate.',
  'ch19-title':'"Time to March"','ch19-desc':'The plan is set, and the march begins. The battle to reclaim everything starts now.',
  'ch20-title':'"Storming Kenban Kingdom"','ch20-desc':'Into the enemy\'s stronghold. A reunion with a familiar face — and a shocking new truth awaits.',
  'ch21-title':'"Showdown with the Witch"','ch21-desc':'A powerful enemy stands in their way. In the midst of desperation, an unexpected ally appears.',
  'ch22-title':'"Miracle of the Quartet"','ch22-desc':'Companions arrive one after another. Overlapping tones cut through the darkness.',
  'ch23-title':'"The Final Battle"','ch23-desc':'When all sounds become one, a melody no one has ever heard resonates through the world.',
  'ch24-title':'"The Beginning of a New World"','ch24-desc':'Waiting beyond the battle — a hopeful new melody. The story reaches its grand finale.',
  /* ─ characters.html ─ */
  'chars-title':'Characters | Music World ~ Violin Princess and the Magic Symphony ~',
  'chars-hero-h1':'Characters',
  'chars-instruction':'Click a character icon to view details',
  'chars-gengaku-label':'GENGAKU KINGDOM — STRING INSTRUMENTS',
  'chars-kangaku-label':'KANGAKU KINGDOM — WIND INSTRUMENTS',
  'chars-dagaku-label':'DAGAKU KINGDOM — PERCUSSION',
  'chars-kenban-label':'KENBANGAKU KINGDOM — KEYBOARD INSTRUMENTS',
  'chars-other-label':'OTHER KEY CHARACTERS',
  'char-violin-name':'Violin Princess','char-violin-role':'Protagonist',
  'char-harp-name':'Harp Queen','char-harp-role':'Queen / Mother',
  'char-viola-name':'Viola Prince','char-viola-role':'Prince / Brother',
  'char-cello-name':'Cello Butler','char-cello-role':'Royal Butler',
  'char-contrabass-name':'Contrabass Count','char-contrabass-role':'Count of Gengaku',
  'char-sax-name':'Sax','char-sax-role':'Knight General',
  'char-clarinet-name':'Princess Clarinet','char-clarinet-role':'Princess of Kangaku',
  'char-trombone-name':'Trombone Soldier','char-trombone-role':'Guard Soldier',
  'char-accordion-name':'Accordion Knights','char-accordion-role':'Patrol Knights',
  'char-tuba-name':'Tuba Vice-General','char-tuba-role':'Vice-General',
  'char-castanet-name':'Castanet','char-castanet-role':'Child of Dagaku',
  'char-marimba-name':'Marimba','char-marimba-role':'Elder Sibling',
  'char-xylophone-name':'Xylophone','char-xylophone-role':'Younger Sibling',
  'char-glocken-name':'Glocken','char-glocken-role':'Temple Guardian',
  'char-timpani-name':'King Timpani','char-timpani-role':'Great King of Dagaku',
  'char-piano-name':'Piano Prince','char-piano-role':'Prince of Kenban',
  'char-cembalo-name':'Emperor Cembalo','char-cembalo-role':'Emperor of Kenban',
  'char-organ-name':'Organ Soldier','char-organ-role':'Kenban Soldier',
  'char-pipeorgan-name':'Pipe Organ Witch','char-pipeorgan-role':'Mastermind',
  'char-dragon-name':'Mysterious Dragon','char-dragon-role':'Unidentified Dark Dragon',
  'char-maestro-name':'Master Tact','char-maestro-role':'Legendary Musician',
  'char-daspalla-name':'Da Spalla Soldier','char-daspalla-role':'Royal Guard',
  /* ─ world.html ─ */
  'world-title':'World | Music World ~ Violin Princess and the Magic Symphony ~',
  'world-hero-h1':'The World of Music',
  'world-intro':'Across the "Music World" spread four musical kingdoms.<br>Strings, winds, percussion, keys——<br>Each with unique musical power, building their own cultures and histories.<br>For a long time, the four kingdoms kept peace in their own lands.<br>But one day, a mastermind\'s schemes shattered the balance,<br>escalating into a great conflict engulfing the whole world.',
  'world-kingdoms-title':'The Four Musical Kingdoms',
  'world-gengaku-name':'Gengaku Kingdom','world-gengaku-sub':'Kingdom of Strings / Gengaku Kingdom',
  'world-gengaku-desc':'A land filled with beautiful string melodies. Pale cherry-blossom castles tower over canal cityscapes where tradition-loving people live quietly. The home of Violin Princess and the starting point of the story.',
  'world-gengaku-tag1':'Theme Color: Pink','world-gengaku-tag2':'Tradition & Grace','world-gengaku-tag3':'Canal Cityscape',
  'world-kangaku-name':'Kangaku Kingdom','world-kangaku-sub':'Kingdom of Winds / Kangaku Kingdom',
  'world-kangaku-desc':'A vibrant kingdom with gleaming brass structures and advanced steam and steel technology. The freewheeling citizens enjoy improvisation, and jazz-like music drifts from street corners. Also a fortified city of wind cavalry knights.',
  'world-kangaku-tag1':'Theme Color: Gold','world-kangaku-tag2':'Steam & Steel','world-kangaku-tag3':'Spirit of Improvisation',
  'world-dagaku-name':'Dagaku Kingdom','world-dagaku-sub':'Kingdom of Percussion / Dagaku Kingdom',
  'world-dagaku-desc':'Spreading deep in a vast forest, villages of circular percussion-inspired homes dot the land. Multiple tribes coexist, living rhythmically to steady drumbeats. Beyond many settlements stands an ancient stone temple carved from massive rocks.',
  'world-dagaku-tag1':'Theme Color: Sky Blue','world-dagaku-tag2':'Multi-Tribe Coexistence','world-dagaku-tag3':'Stone Temple',
  'world-kenban-name':'Kenbangaku Kingdom','world-kenban-sub':'Kingdom of Keys / Kenbangaku Kingdom',
  'world-kenban-desc':'A stately kingdom where soaring spires like giant pipe organs pierce the sky. White and black buildings lined in order resemble piano keys in darkness. The Emperor\'s castle looms above, and rumors of a dragon\'s shadow never cease.',
  'world-kenban-tag1':'Theme Color: Purple','world-kenban-tag2':'Clifftop Fortress','world-kenban-tag3':'Black & White Order',
  'world-bg-title':'World Background',
  'world-bg-card1-h':'Music is Magic',
  'world-bg-card1-p':'On the Musica Continent, music itself holds magical power. The sounds from each kingdom\'s unique instruments create distinct magical effects.',
  'world-bg-card2-h':'Conflict of Four Kingdoms',
  'world-bg-card2-p':'Once in harmony, the mastermind\'s schemes intensified rivalries. A war of invasion centered on Kenbangaku toppled the world\'s balance.',
  'world-bg-card3-h':'The Grand Symphony',
  'world-bg-card3-p':'The legendary power born when the music of four kingdoms unites. Reclaiming it is said to be the only way to bring peace to the world.',
  'world-bg-card4-h':'World Imagery',
  /* ─ gallery.html ─ */
  'gallery-title':'Gallery | Music World ~ Violin Princess and the Magic Symphony ~',
  'gallery-hero-h1':'Gallery',
  'gallery-instruction':'Click an image to view details',
  'gallery-filter-all':'All','gallery-filter-video':'Video',
  'gallery-filter-scene':'Scene Stills',
  'gallery-filter-artwork':'Artwork','gallery-filter-design':'Design Sheets',
  'gallery-filter-other':'Other',
  'gal-scene1-title':'Violin Princess Playing','gal-scene1-cat':'Scene Still',
  'gal-scene2-title':'Kenban Invasion','gal-scene2-cat':'Scene Still',
  'gal-scene3-title':'Fateful Encounter','gal-scene3-cat':'Scene Still',
  'gal-scene4-title':'Training with the Master','gal-scene4-cat':'Scene Still',
  'gal-scene5-title':'Symphony That Echoes','gal-scene5-cat':'Scene Still',
  'gal-art1-title':'Main Visual','gal-art1-cat':'Artwork',
  'gal-art2-title':'Musica Continent Overview','gal-art2-cat':'Artwork',
  'gal-art3-title':'Kenban Castle Background','gal-art3-cat':'Artwork',
  'gal-design1-title':'Violin Princess Design','gal-design1-cat':'Design Sheet',
  'gal-design2-title':'Pipe Organ Witch Design','gal-design2-cat':'Design Sheet',
  'gal-design3-title':'Musica Continent Map','gal-design3-cat':'Design Sheet',
  'gal-other1-title':'Soundtrack','gal-other1-cat':'Other',
  'gal-video1-title':'Opening Movie','gal-video1-cat':'Video',
  'gallery-overlay':'View Details',
  'gallery-overlay-video':'▶ Play',
  'gallery-info-h':'About the Images',
  'gallery-info-p':'Each gallery frame is a placeholder for image replacement.<br>When your image files are ready, replace each <code style="color:var(--gold);font-size:0.85em;">.img-placeholder</code> element with an <code style="color:var(--gold);font-size:0.85em;">&lt;img src="..."&gt;</code> tag.',
};

/* ── 英語キャラクターデータ（ポップアップ用） ── */
const charDataEn = {
  violin:{ name:'Violin Princess',nameSub:'Violin Princess',role:'Protagonist / Princess of Gengaku',country:'Gengaku Kingdom',appearance:'Pale pink dress, long lustrous hair, resolute eyes',personality:'Brave and spirited. Strong-willed with delicate sensibility.',desc:'Princess of the Gengaku Kingdom. Has loved the violin since childhood, healing people with her beautiful melodies. After losing her family to the Kenban invasion, she reluctantly teams up with Sax, a knight from the enemy kingdom, and sets out to save her family and people. Under Master Tact\'s guidance, she awakens to the true power of music.',instrument:'Violin (Magical Bow String)',ability:'Magical melody · Healing tune · Sound barrier'},
  sax:{ name:'Sax',nameSub:'Sax / Alto Saxophone',role:'General of Kangaku Knights',country:'Kangaku Kingdom',appearance:'Golden armor, powerful build, fierce eyes',personality:'Strong and passionate. Secretly in love with Princess Clarinet.',desc:'General of the Kangaku Knight Order. A bold warrior in golden armor. Originally at odds with Violin Princess, he learns of their common enemy—the Pipe Organ Witch—and reluctantly cooperates. His burning sense of justice and bonds with comrades are his greatest weapons.',instrument:'Alto Saxophone (Sound-wave magic weapon)',ability:'Sonic blast · Metal reinforcement · Battle cry'},
  piano:{ name:'Piano Prince',nameSub:'Piano Prince',role:'Prince of Kenban Kingdom',country:'Kenban Kingdom',appearance:'Black cape, large black hat, golden hair, blue eyes. Rides white horse Fortissimo',personality:'Elegant and mysterious. Calm on the surface, yet harbors inner fire.',desc:'Prince of the Kenban Kingdom. A mysterious young man who rides quietly across the battlefield on his white horse "Fortissimo." Knowing his father Emperor Cembalo is under the witch\'s spell, he works from within to save his country.',instrument:'Grand Piano (Space-time controlling keyboard)',ability:'Temporal tuning · Spatial arpeggio · Fortissimo charge'},
  maestro:{ name:'Master Tact',nameSub:'Master Tact / Takt Maestro',role:'Legendary Musician / Mentor',country:'Wandering',appearance:'White pointy hat, long white beard, carries a magical baton',personality:'Boisterous yet deeply wise. Strict but loving with students.',desc:'The legendary conductor Takt Maestro, once at the pinnacle of world music. Now a wandering old man, his magical baton amplifies music\'s power many times over. He encounters Violin Princess, recognizes her talent, and takes her as his student.',instrument:'Magic Baton (Maestro\'s Staff)',ability:'Music amplification · Omnidirectional conducting · Reading the melody of time'},
  castanet:{ name:'Castanet',nameSub:'Castanet',role:'Child of Dagaku',country:'Dagaku Kingdom',appearance:'Lovable child with distinctive large front teeth',personality:'Innocent and adorable. Makes a clattering sound with big front teeth.',desc:'A small child living in the Dagaku Kingdom with the unique talent of clattering like castanets with their large front teeth. Serves as a guide who knows the deep recesses of Dagaku. Their innocent smile and pure heart brighten weary travelers.',instrument:'Castanet (Big front teeth and palms)',ability:'Rhythm magic · Ground navigation · Healing smile'},
  harp:{ name:'Harp Queen',nameSub:'Harp Queen',role:'Queen of Gengaku / Violin Princess\'s Mother',country:'Gengaku Kingdom',appearance:'Silver-white dress with golden crown, graceful and beautiful',personality:'Full of grace and elegance. Deep love for the people and strong will.',desc:'Queen of the Gengaku Kingdom and mother of Violin Princess. Her beautiful harp melodies have enchanted the people and brought peace to the land. Taken captive during the Kenban invasion, her grace and resolve never waver as she awaits her daughter\'s return.',instrument:'Harp (Queen\'s instrument of peace)',ability:'Mental stability · Healing melody · Magical barrier'},
  viola:{ name:'Viola Prince',nameSub:'Viola Prince',role:'Prince of Gengaku / Violin Princess\'s Brother',country:'Gengaku Kingdom',appearance:'Deep blue formal wear with red cape, gallant young prince',personality:'Protective of his sister, strong sense of justice. Calm and decisive.',desc:'Prince of the Gengaku Kingdom and older brother of Violin Princess. He believed in his sister\'s talent more than anyone and always supported her from the shadows. He bravely faced the Kenban invasion to protect the people but was captured.',instrument:'Viola (Deep, rich middle-range string)',ability:'Sound shield · Resonance protection · Deep tone rumble'},
  cello:{ name:'Cello Butler',nameSub:'Cello Butler',role:'Butler of Gengaku Kingdom',country:'Gengaku Kingdom',appearance:'Black formal wear with white gloves, upright middle-aged butler',personality:'Earnest and meticulous. Deep loyalty to the royal family. Occasionally shows playfulness.',desc:'The butler serving the Gengaku royal palace, a long-standing servant who cared for Violin Princess since childhood. The deep tones of his cello calm listeners and suppress the agitation of allies.',instrument:'Cello (Deep resonating low string)',ability:'Emotional calming · Resonance protection · Low-tone barrier'},
  contrabass:{ name:'Contrabass Count',nameSub:'Contrabass Count',role:'Count of Gengaku Kingdom',country:'Gengaku Kingdom',appearance:'Imposing build, black formal wear, white wig',personality:'A low, imposing presence. Taciturn but reliable.',desc:'A distinguished count of the Gengaku Kingdom. Like the weighty sound of a contrabass, he commands a solid presence. A veteran who has supported Gengaku for many years, he rallies the people with unmatched strength in times of crisis.',instrument:'Contrabass (The lowest of all instruments)',ability:'Ground tremor · Deep shock wave · Intimidating roar'},
  clarinet:{ name:'Princess Clarinet',nameSub:'Clarinet Princess',role:'Princess of Kangaku',country:'Kangaku Kingdom',appearance:'Light and bright attire, clear eyes of an intelligent princess',personality:'Kind and intelligent. Highly sensitive to the feelings of those around her.',desc:'Princess of the Kangaku Kingdom. The one Sax secretly admires. Gentle and intelligent, she can sensitively perceive the emotions of those around her. She secretly sends information to allies, working to change the situation from within.',instrument:'Clarinet (Clear-toned woodwind)',ability:'Hearing hearts · Sound detection · Healing melody'},
  accordion:{ name:'Accordion Knights',nameSub:'Accordion Knights',role:'Patrol Knights of Kenban',country:'Kenban Kingdom',appearance:'Multiple knights clad in keyboard-engraved bellows armor, always moving in tight formation',personality:'Teamwork above all. Their true strength shines when their voices and sounds align.',desc:'An elite patrol unit that guards the towns and borders of the Kenban Kingdom. The keyboard markings on their bellows armor prove their allegiance to the black-and-white order — for the accordion\'s keys make it a true keyboard instrument and a proud symbol of Kenban. Individually solid fighters, but when they layer their sounds together they unleash explosive power. No matter how remote or dangerous the post, they answer the call without hesitation.',instrument:'Accordion (Keyboard instrument with bellows)',ability:'Synchronized sound wave · Bellows shield · Chord detonation'},
  trombone:{ name:'Trombone Soldier',nameSub:'Trombone Soldier',role:'Guard Soldier of Kangaku',country:'Kangaku Kingdom',appearance:'Sturdy armor-clad soldier with sharp eyes and a well-kept beard',personality:'Straightforward and disciplined. Unwavering in duty.',desc:'A gate guard protecting the key posts of the Kangaku Kingdom. Also serves as a messenger, alerting allies to danger with far-reaching trombone-like sound waves. A deeply devoted soldier who idolizes General Sax and never fails a mission. Quiet but loyal—someone who always shows up when it counts.',instrument:'Trombone (Slide brass instrument)',ability:'Long-range sonic signal · Sound wall formation · Rallying battle roar'},
  tuba:{ name:'Tuba Vice-General',nameSub:'Tuba Vice-General',role:'Vice-General of Kangaku Knights',country:'Kangaku Kingdom',appearance:'Large build with warm expression, heavy armor',personality:'Giant but kind-hearted. Respects Sax and follows him loyally.',desc:'Vice-General of the Kangaku Knight Order. Despite his tuba-like build, he is the gentlest inside. On the battlefield he overwhelms enemies with sheer presence, but always treats his comrades with gentleness.',instrument:'Tuba (The largest brass instrument)',ability:'Pressure wall · High-volume shock wave · Morale boost'},
  marimba:{ name:'Marimba',nameSub:'Marimba',role:'Elder brother of the Xylophone Siblings',country:'Dagaku Kingdom',appearance:'Cheerful smile and light movement, colorful Dagaku tribal attire',personality:'Cheerful and optimistic. Ends sentences with "nba".',desc:'Elder brother of the xylophone sibling duo of Dagaku. A cheerful young man whose "nba" catchphrase and ever-present smile never falter. He supports his companions with his sister Xylophone through well-coordinated teamplay.',instrument:'Marimba (Wooden keyed percussion)',ability:'Warm tone · Atmosphere harmony · Rapid strike combo'},
  xylophone:{ name:'Xylophone',nameSub:'Xylophone',role:'Younger sister of the Xylophone Siblings',country:'Dagaku Kingdom',appearance:'Energetic girl, braided hair and lively eyes',personality:'Full of energy and action-oriented. Ends sentences with "fon".',desc:'Younger sister of the xylophone sibling duo of Dagaku. An energetic girl whose bravery surpasses even her brother\'s. Her courage to leap into danger without hesitation constantly surprises those around her.',instrument:'Xylophone (Clear high-pitched wooden instrument)',ability:'High-tone impact · Rapid combo strike · Sound slash'},
  glocken:{ name:'Glocken',nameSub:'Glocken',role:'Gate Guardian of Dagaku Temple',country:'Dagaku Kingdom',appearance:'Bell-shaped helmet, stubborn expression',personality:'Rigid and inflexible. Ends sentences with "ken".',desc:'The gate guardian of the Dagaku temple. A stubborn stickler for the rules. However, when moved by sincere words, he transforms into the most loyal of allies.',instrument:'Glockenspiel (Iron bells)',ability:'Iron soundwave · Barrier bell · Hardness armor'},
  timpani:{ name:'King Timpani',nameSub:'King Timpani',role:'Great King of Dagaku',country:'Dagaku Kingdom',appearance:'Giant build, traditional royal Dagaku attire with large feathered headdress',personality:'Dignified and boisterous. A great king who deeply loves the people of Dagaku.',desc:'King of the Dagaku Kingdom. With a massive build like timpani drums, he speaks with a voice that could shake the earth. He is moved by Violin Princess\'s performance and decides to lend Dagaku\'s strength.',instrument:'Timpani (King of drums / pulse of the earth)',ability:'Earthquake · Thunderous battle cry · Iron-wall defense'},
  organ:{ name:'Organ Soldier',nameSub:'Organ Soldier',role:'Soldier of Kenban Kingdom',country:'Kenban Kingdom',appearance:'Purple uniform with a slightly rumpled hat, always looking a little worn-out',personality:'Grumbles "what a pain" at everything. Always angling for shortcuts, but gets it done when it counts.',desc:'A low-ranking soldier of the Kenban Kingdom, who utters "what a pain" at least a hundred times a day. He skips patrols for naps, files the bare minimum reports, and grumbles at every order. Beneath it all he\'s surprisingly dependable—when real danger strikes, he moves faster than anyone. He was the first to notice the Emperor acting strangely, muttering "Something\'s off... what a pain, I guess I\'ll look into it."',instrument:'Reed Organ (worn-out foot-pedal organ)',ability:'Lazy melody · Shortcut chord · Grudging lightning strike'},
  cembalo:{ name:'Emperor Cembalo',nameSub:'Emperor Cembalo',role:'Emperor of Kenban Kingdom',country:'Kenban Kingdom',appearance:'White and black imperial robes, silver crown. A solemn old man',personality:'Originally gentle and music-loving. But now under the witch\'s spell.',desc:'Emperor of the Kenban Kingdom. Once a gentle old man who loved music and wished for peace. But under the Pipe Organ Witch\'s curse, he commands invasion as a fearsome ruler.',instrument:'Harpsichord (The ancient keyboard king)',ability:'(Original) Peace melody · Historic tune · Memory of time'},
  pipeorgan:{ name:'Pipe Organ Witch',nameSub:'Pipe Organ Witch',role:'Mastermind / World-conquering witch',country:'Unknown',appearance:'Jet-black robes, sharp eyes, an aura of unfathomable darkness',personality:'Cold and calculating. Obsessed with power, treats music as a tool of domination.',desc:'The true villain of this story. A dark witch who manipulates the Emperor of Kenban Kingdom to conquer the world. She possesses overwhelming sound pressure like a pipe organ, and the true depth of her power remains unknown to all. She stands in direct opposition to the pure power of music.',instrument:'Pipe Organ (The instrument of domination)',ability:'Magic sound control · Dark barrier · Sound curse · Abyss chord'},
  dragon:{ name:'Mysterious Dragon',nameSub:'Mysterious Dragon',role:'Unidentified Dark Dragon',country:'Unknown',appearance:'Massive jet-black dragon radiating overwhelming power and unfathomable darkness',personality:'The embodiment of destruction. Without words, it overwhelms all with power and terror.',desc:'A mysterious giant dragon that appears suddenly at the site of the final battle. The dark sound pressure it unleashes from its jet-black body cancels all Symphonies and threatens to engulf the world. Its true identity and origins are completely unknown. Only the four-kingdom harmony woven by Violin Princess and her companions can stand against it.',instrument:'Dragon Roar (Ultimate destructive sound)',ability:'Dark sonic bombardment · Sound barrier destruction · Roar of oblivion'},
  daspalla:{ name:'Da Spalla Soldier',nameSub:'Violoncello da Spalla Soldier',role:'Royal Guard of Gengaku',country:'Gengaku Kingdom',appearance:'Lean build with a small cello strapped to the shoulder, a stoic and silent face',personality:'Silent and loyal. Speaks through action, not words. Total devotion to the royal family.',desc:'A royal guard who has protected the Gengaku royal family from the shadows. He fights with both sound and blade, his violoncello da spalla—an ancient shoulder-worn cello—always at his side. Rarely speaks, but his devotion runs deeper than anyone\'s. During the Kenban invasion, he was one of those who carved a path for Violin Princess\'s escape with his life on the line.',instrument:'Violoncello da Spalla (ancient small shoulder cello)',ability:'Melody shield · Blade-sound strike · Resonance of devotion'},
};

/* ── 中国語翻訳辞書 ── */
const i18n_zh = {
  /* ─ ナビ共通 ─ */
  'nav-logo-title':'音乐世界',
  'nav-logo-sub':'小提琴公主与魔法交响乐',
  'nav-top':'首页','nav-story':'故事','nav-characters':'人物',
  'nav-world':'世界观','nav-gallery':'图册','nav-lyrics':'歌词','nav-book':'绘本',
  'book-title':'购买绘本 | 音乐世界',
  'book-eyebrow':'原作绘本',
  'book-hero-title':'购买绘本',
  'book-hero-sub':'本网站的原作绘本，现已在各大书店发售',
  'book-meta-author':'作者','book-meta-pub':'出版社',
  'book-meta-date':'发售日','book-meta-date-val':'2024年2月',
  'book-meta-pages':'页数','book-price-note':'（含税）',
  'book-stores-heading':'购买渠道',
  'book-btn-buy':'立即购买 →','book-btn-preview':'预览 →',
  'book-amazon-detail':'快速配送，Prime会员免运费。<br>评分：5.0 ★★★★★',
  'book-rakuten-detail':'可获得乐天积分。<br>满¥3,000免运费。有库存。',
  'book-tower-detail':'积分20%返还（280pt）。<br>提供书籍及绘本。',
  'book-yodobashi-detail':'278黄金积分返还（相当于20%）。<br>提供电子书版本（Doly应用）。',
  'book-google-detail':'可在Google Books上预览。<br>直接在浏览器中阅读。',
  'book-google-free':'提供免费预览',
  'book-yahoo-detail':'可获得PayPay积分。<br>SoftBank / Y! Mobile用户更优惠。',
  'book-affiliate-note':'※ 上述部分链接为联盟营销链接。通过这些链接购买，制作团队将获得少量佣金。您的支持将帮助我们创作下一个故事。',
  'modal-opening-title':'要打开音乐世界的大门吗？',
  'modal-btn-watch':'观看开场动画',
  'modal-btn-skip':'直接进入故事',
  'bgm-sub':'小提琴公主与魔法交响乐 BGM',
  'lyrics-title':'歌词 — Symphony of One World | 音乐世界',
  'lyrics-eyebrow':'主题曲 · 歌词',
  'lyrics-sub':'音乐世界 主题曲',
  'lyrics-credits':'词曲：PYONPY　／　演唱：DJ RAMUNE',
  'lyrics-player-label':'♪ 正在播放',
  'lyrics-sec-verse1':'第一节','lyrics-sec-verse2':'第二节',
  'lyrics-sec-pre':'副歌前段','lyrics-sec-chorus':'副歌',
  'lyrics-sec-bridge':'间奏','lyrics-sec-final':'最终副歌',
  /* ─ 歌詞本文 ─ */
  'lyrics-v1-1':'轻抚琴弦时 清风起舞',
  'lyrics-v1-2':'微扬簧声时 越过高墙',
  'lyrics-v1-3':'鼓声回响时 大地震动',
  'lyrics-v1-4':'轻触琴键时 未来苏醒',
  'lyrics-v2-1':'遥远国度的声音',
  'lyrics-v2-2':'若彼此相逢 终将合一',
  'lyrics-v2-3':'纵然最初还无法懂得彼此',
  'lyrics-v2-4':'终有一天 我们会心意相通',
  'lyrics-v2-5':'不同的旋律 不同的节奏',
  'lyrics-v2-6':'交汇之时 便成和声',
  'lyrics-pre-1':'让纷争的回声 渐渐平息',
  'lyrics-pre-2':'此刻 让心与心相连',
  'lyrics-cho-2':'响彻这世界',
  'lyrics-cho-3':'不同的声音交织相映',
  'lyrics-cho-4':'化作一束光辉',
  'lyrics-cho-6':'向天空奏响',
  'lyrics-cho-7':'所有国度 所有人们',
  'lyrics-cho-8':'同唱和谐之歌',
  'lyrics-br-1':'当不同的音色彼此相遇',
  'lyrics-br-2':'世界便化作崭新的歌',
  'lyrics-br-3':'遥远国度的旋律',
  'lyrics-br-4':'也在此刻融汇共鸣',
  'lyrics-br-5':'你的节奏 我的旋律',
  'lyrics-br-6':'在那瞬间彼此相映',
  'lyrics-br-7':'一直传向天空彼岸',
  'lyrics-br-8':'化作和平的交响曲',
  'lyrics-fc-2':'永远回响',
  'lyrics-fc-3':'不同的梦想彼此交汇',
  'lyrics-fc-4':'化作未来之歌',
  'lyrics-fc-6':'向天空伸展',
  'lyrics-fc-7':'所有国度 所有人们',
  'lyrics-fc-8':'融成同一片和声',
  'footer-logo':'音乐世界',
  'footer-sub':'小提琴公主与魔法交响乐',
  'footer-link-top':'首页','footer-link-story':'故事',
  'footer-link-characters':'人物','footer-link-world':'世界观',
  'footer-link-gallery':'图册','footer-link-lyrics':'歌词','footer-link-book':'绘本',
  'footer-copy2':'本站为虚构作品官方网站。',
  /* ─ ボタン共通 ─ */
  'btn-view-story':'查看故事','btn-meet-characters':'认识角色',
  'btn-view-characters':'查看角色','btn-to-worldmap':'世界地图',
  'btn-to-gallery':'前往图册','btn-to-story':'前往故事',
  'btn-press-kit':'索取新闻资料包',
  /* ─ index.html ─ */
  'index-title':'音乐世界 ～小提琴公主与魔法交响乐～ | 官方网站',
  'index-tagline':'不同音色交织出拯救世界的交响乐——<br>当四个王国的音乐合而为一，奇迹便会诞生。',
  'index-announce':'✦ &nbsp; 全24章 完结 &nbsp;&nbsp;|&nbsp;&nbsp; 四个王国・19位角色 &nbsp;&nbsp;|&nbsp;&nbsp; BGM「Symphony of One World」 &nbsp; ✦',
  'index-section-title':'不同音色交织出的拯救世界之故事',
  'index-card1-h':'音乐即魔法',
  'index-card1-p':'弦・管・打・键——四个王国各自的乐器拥有独特的魔法力量。小提琴公主演奏的细腻旋律，蕴藏着感动人心、改变世界的力量。',
  'index-card2-h':'四个对立的王国',
  'index-card2-p':'弦乐国・管乐国・打击乐国・键盘乐国——各自拥有独特文化与音乐魔法，在对立与友谊之间摇摆的四国故事。',
  'index-card3-h':'感人的交响乐',
  'index-card3-p':'与昔日之敌并肩作战，与伙伴深化羁绊，向师傅学习——所有旅途汇聚成一首交响乐，那震撼人心的高潮将永远留存于观者心中。',
  'index-card4-h':'全24章的壮阔故事',
  'index-card4-p':'从家人被夺走的公主出逃，到师傅的修行、伙伴间的羁绊，直至拯救世界的大交响乐——跨越24章的深刻感人故事。',
  'index-nav-story-sub':'世界观・剧情・章节列表',
  'index-nav-char-sub':'19位个性鲜明的角色',
  'index-nav-world-sub':'四个音乐王国',
  'index-nav-gallery-sub':'剧照・艺术图・设定资料',
  /* ─ story.html ─ */
  'story-title':'故事 | 音乐世界 ～小提琴公主与魔法交响乐～',
  'story-hero-h1':'故事',
  'story-h2':'不同音色交织出拯救世界的交响乐',
  'story-p1':'在音乐化为魔法的世界——穆吉卡大陆居住着弦乐、管乐、打击乐、键盘乐四个各具特色的王国。这维持已久的平衡，在某日被键盘乐国的突然入侵所打破。',
  'story-p2':'弦乐国王女小提琴公主在那次攻击中失去了家人，被迫独自离开故土。在绝望中，她遇到了敌国管乐国的大将萨克斯，并不情愿地选择与他并肩而战。',
  'story-quote':'"音乐——是心灵的呐喊。<br>比任何语言都更真诚，它能直达整个世界。"',
  'story-quote-attr':'——塔克特大师',
  'story-p3':'在传说级音乐家塔克特大师的指导下，一行人与打击乐国的伙伴们加深了羁绊。当他们得知幕后主使是管风琴魔女时，便前往键盘乐国城堡，去拯救被囚禁的家人和人民。',
  'story-p4':'弦・管・打・键——不同音色共同演奏的交响乐，真的拥有拯救世界的力量吗？',
  'story-chapters-title':'全24章 — 章节列表',
  'story-visual-label':'小提琴公主与魔法交响乐',
  'story-gallery-h':'故事视觉图册',
  'ch1-title':'"音乐之世界"','ch1-desc':'音符之星上扩展着四个国家。各自的音色是骄傲，也是分裂的开始。',
  'ch2-title':'"小提琴公主的早晨"','ch2-desc':'打断宁静晨练的神秘旋律。被音乐引导，公主奔跑起来。',
  'ch3-title':'"与神秘男子的相遇"','ch3-desc':'在森林深处遇见了身披黑斗篷的男子。他美丽的音色深深刻入小提琴公主的心。',
  'ch4-title':'"来自管乐国的访客"','ch4-desc':'突然到访的访客逼出残酷的抉择。平静的日常一变而异。',
  'ch5-title':'"强制同盟"','ch5-desc':'本应是敌人的两人，在月光下第一次交谈的夜晚。',
  'ch6-title':'"袭来"','ch6-desc':'遮天蔽日的巨大阴影。最强军事国家压倒性的力量，将一切吞噬。',
  'ch7-title':'"千钧一发的逃脱"','ch7-desc':'在同伴们拼死的觉悟支撑下，从绝望中抓住的一线希望。',
  'ch8-title':'"逃往森林"','ch8-desc':'遥望着珍重之人的身影，两人立下了坚定的誓言。',
  'ch9-title':'"与响板的相遇"','ch9-desc':'在森林中出现的小小向导。"咔哒咔哒"的声音开始拨动命运。',
  'ch10-title':'"指挥大师的故事"','ch10-desc':'传说中的老音乐家讲述世界的真相。公主所不知道的父亲的面貌被揭晓。',
  'ch11-title':'"走向和谐之路"','ch11-desc':'虽然碰撞，却在慢慢改变的两人。修行的日子培育着羁绊。',
  'ch12-title':'"首次合奏"','ch12-desc':'两段各自的音符，第一次重叠的瞬间。诞生了短暂的奇迹。',
  'ch13-title':'"同步的音色"','ch13-desc':'闭上眼睛，只用耳朵感受对方。通过音乐，心与心逐渐靠近。',
  'ch14-title':'"交响乐的旋律"','ch14-desc':'隐藏在最后课题中的，音乐真正的意义。两人找到的答案是什么。',
  'ch15-title':'"新的伙伴"','ch15-desc':'修行结束，前往新土地的旅途开始。古老的历史成为通向未来的钥匙。',
  'ch16-title':'"打击乐村"','ch16-desc':'节奏支配的未知国度。从未见过的文化和温暖的款待在等待着。',
  'ch17-title':'"与木琴兄妹的相遇"','ch17-desc':'开朗可靠的新伙伴登场。离别与相遇交织。',
  'ch18-title':'"潜入神殿"','ch18-desc':'为了见大王，冒险前往神殿。意想不到的变故左右命运。',
  'ch19-title':'"出征之时"','ch19-desc':'作战计划确定，终于到了进军之时。夺回一切的战斗开始。',
  'ch20-title':'"突入键盘国"','ch20-desc':'进入敌人的大本营。与熟悉的面孔重逢，以及新的震惊事实在等待。',
  'ch21-title':'"与魔女的对决"','ch21-desc':'强大的敌人横亘在前。在绝体绝命之中，意想不到的盟友现身。',
  'ch22-title':'"四重奏的奇迹"','ch22-desc':'伙伴们接连赶到。交织的音色划破黑暗。',
  'ch23-title':'"最终决战"','ch23-desc':'当所有的音合而为一，响彻从未有人听过的旋律。',
  'ch24-title':'"新世界的开始"','ch24-desc':'战斗之后等待着的，是充满希望的新旋律。故事迎来壮大的终章。',
  /* ─ characters.html ─ */
  'chars-title':'人物 | 音乐世界 ～小提琴公主与魔法交响乐～',
  'chars-hero-h1':'人物',
  'chars-instruction':'点击角色图标查看详细信息',
  'chars-gengaku-label':'弦乐国 — 弦乐器',
  'chars-kangaku-label':'管乐国 — 管乐器',
  'chars-dagaku-label':'打击乐国 — 打击乐器',
  'chars-kenban-label':'键盘乐国 — 键盘乐器',
  'chars-other-label':'其他重要角色',
  'char-violin-name':'小提琴公主','char-violin-role':'主角',
  'char-harp-name':'竖琴王后','char-harp-role':'王后・母亲',
  'char-viola-name':'中提琴王子','char-viola-role':'王子・哥哥',
  'char-cello-name':'大提琴管家','char-cello-role':'王室管家',
  'char-contrabass-name':'低音提琴伯爵','char-contrabass-role':'弦乐国伯爵',
  'char-sax-name':'萨克斯','char-sax-role':'骑士团大将',
  'char-clarinet-name':'单簧管公主','char-clarinet-role':'管乐国公主',
  'char-trombone-name':'长号士兵','char-trombone-role':'守卫士兵',
  'char-accordion-name':'手风琴骑士团','char-accordion-role':'巡逻骑士团',
  'char-tuba-name':'大号副将','char-tuba-role':'副将',
  'char-castanet-name':'卡斯塔内特','char-castanet-role':'打击乐国的孩子',
  'char-marimba-name':'马林巴','char-marimba-role':'兄长',
  'char-xylophone-name':'木琴','char-xylophone-role':'妹妹',
  'char-glocken-name':'钟琴','char-glocken-role':'神殿守卫',
  'char-timpani-name':'定音鼓王','char-timpani-role':'打击乐国大王',
  'char-piano-name':'钢琴王子','char-piano-role':'键盘乐国王子',
  'char-cembalo-name':'羽管键琴皇帝','char-cembalo-role':'键盘乐国皇帝',
  'char-organ-name':'风琴士兵','char-organ-role':'键盘乐国士兵',
  'char-pipeorgan-name':'管风琴魔女','char-pipeorgan-role':'幕后主使',
  'char-dragon-name':'神秘巨龙','char-dragon-role':'身份不明的暗黑巨龙',
  'char-maestro-name':'塔克特大师','char-maestro-role':'传奇音乐家',
  'char-daspalla-name':'肩挂大提琴士兵','char-daspalla-role':'王族护卫',
  /* ─ world.html ─ */
  'world-title':'世界观 | 音乐世界 ～小提琴公主与魔法交响乐～',
  'world-hero-h1':'音乐世界',
  'world-intro':'在「音乐世界」中，分布着四个音乐王国。<br>弦・管・打・键——<br>各自拥有独特的音乐力量，构筑起自身的文化与历史。<br>长久以来，四国各自维持着本国的和平。<br>然而某天，幕后黑手的阴谋打破了这一平衡，<br>演变成席卷整个世界的大纷争。',
  'world-kingdoms-title':'四个音乐王国',
  'world-gengaku-name':'弦乐国','world-gengaku-sub':'弦之国 / 弦乐国',
  'world-gengaku-desc':'充满美丽弦乐旋律的土地。粉樱色的城堡矗立于运河城市风景之中，崇尚传统的人们安静生活。这里是小提琴公主的故乡，也是故事的起点。',
  'world-gengaku-tag1':'主题色：粉色','world-gengaku-tag2':'传统与优雅','world-gengaku-tag3':'运河城市风貌',
  'world-kangaku-name':'管乐国','world-kangaku-sub':'管之国 / 管乐国',
  'world-kangaku-desc':'闪耀着黄铜光芒的建筑与先进的蒸汽钢铁技术交相辉映的活力王国。崇尚自由的市民享受着即兴演奏，街角飘荡着爵士风格的音乐。同时也是一座风骑士团的要塞之城。',
  'world-kangaku-tag1':'主题色：金色','world-kangaku-tag2':'蒸汽与钢铁','world-kangaku-tag3':'即兴演奏精神',
  'world-dagaku-name':'打击乐国','world-dagaku-sub':'打之国 / 打击乐国',
  'world-dagaku-desc':'深入广阔森林之中，散布着以打击乐为灵感的圆形住宅村落。多个部族共存，随着稳定的鼓点节奏生活。众多聚落之外，矗立着以巨岩雕凿而成的古老石造神殿。',
  'world-dagaku-tag1':'主题色：天蓝色','world-dagaku-tag2':'多部族共存','world-dagaku-tag3':'石造神殿',
  'world-kenban-name':'键盘乐国','world-kenban-sub':'键之国 / 键盘乐国',
  'world-kenban-desc':'如同巨型管风琴一般高耸的尖塔直插云霄的庄严王国。按秩序排列的黑白建筑，在黑暗中宛如钢琴琴键。皇帝的城堡居高临下，龙影的传闻从未停歇。',
  'world-kenban-tag1':'主题色：紫色','world-kenban-tag2':'悬崖要塞','world-kenban-tag3':'黑白秩序',
  'world-bg-title':'世界背景',
  'world-bg-card1-h':'音乐即魔法',
  'world-bg-card1-p':'在穆吉卡大陆上，音乐本身拥有魔法力量。各王国独特乐器所发出的声音会产生各自不同的魔法效果。',
  'world-bg-card2-h':'四国的纷争',
  'world-bg-card2-p':'曾经和谐共处的四国，因幕后黑手的阴谋而纷争加剧。以键盘乐国为中心的侵略战争打破了世界的平衡。',
  'world-bg-card3-h':'大交响乐',
  'world-bg-card3-p':'四国音乐合而为一时诞生的传说力量。据说只有重新找回它，才能为世界带来和平。',
  'world-bg-card4-h':'世界意象',
  /* ─ gallery.html ─ */
  'gallery-title':'图册 | 音乐世界 ～小提琴公主与魔法交响乐～',
  'gallery-hero-h1':'图册',
  'gallery-instruction':'点击图片查看详细信息',
  'gallery-filter-all':'全部','gallery-filter-video':'视频',
  'gallery-filter-scene':'场景截图',
  'gallery-filter-artwork':'艺术图','gallery-filter-design':'设定资料',
  'gallery-filter-other':'其他',
  'gal-scene1-title':'小提琴公主演奏','gal-scene1-cat':'场景截图',
  'gal-scene2-title':'键盘乐国的入侵','gal-scene2-cat':'场景截图',
  'gal-scene3-title':'命运的相遇','gal-scene3-cat':'场景截图',
  'gal-scene4-title':'与师傅的修行','gal-scene4-cat':'场景截图',
  'gal-scene5-title':'响彻世界的交响乐','gal-scene5-cat':'场景截图',
  'gal-art1-title':'主视觉图','gal-art1-cat':'艺术图',
  'gal-art2-title':'穆吉卡大陆全景','gal-art2-cat':'艺术图',
  'gal-art3-title':'键盘乐城背景美术','gal-art3-cat':'艺术图',
  'gal-design1-title':'小提琴公主角色设计','gal-design1-cat':'设定资料',
  'gal-design2-title':'管风琴魔女设计','gal-design2-cat':'设定资料',
  'gal-design3-title':'穆吉卡大陆设定地图','gal-design3-cat':'设定资料',
  'gal-other1-title':'原声带','gal-other1-cat':'其他',
  'gal-video1-title':'开场动画','gal-video1-cat':'视频',
  'gallery-overlay':'查看详情',
  'gallery-overlay-video':'▶ 播放',
  'gallery-info-h':'关于图像素材',
  'gallery-info-p':'各图册框为图像替换占位符。<br>当图像文件准备好后，请将各 <code style="color:var(--gold);font-size:0.85em;">.img-placeholder</code> 元素替换为 <code style="color:var(--gold);font-size:0.85em;">&lt;img src="..."&gt;</code> 标签。',
};

/* ── 中国語キャラクターデータ（ポップアップ用） ── */
const charDataZh = {
  violin:{ name:'小提琴公主',nameSub:'小提琴公主',role:'主角 / 弦乐国王女',country:'弦乐国',appearance:'浅粉色礼服，秀丽长发，坚毅的眼神',personality:'勇敢而活泼。意志坚强，感性细腻。',desc:'弦乐国王女。自幼热爱小提琴，美丽细腻的音色曾抚慰无数人心。键盘乐国入侵后，她失去了家人，被迫孤身离国。在绝望中与敌国骑士萨克斯不情愿地联手，踏上了拯救家人与人民的旅途。在塔克特大师的指导下，她逐渐觉醒，领悟音乐的真正力量。',instrument:'小提琴（魔法弓弦）',ability:'魔法音色・治愈旋律・音之结界'},
  sax:{ name:'萨克斯',nameSub:'萨克斯 / 中音萨克斯',role:'管乐国骑士团大将',country:'管乐国',appearance:'金色铠甲，健硕体格，坚毅的眼神',personality:'豪迈热血。暗中倾心于单簧管公主。',desc:'管乐国骑士团大将。身着金色铠甲的豪勇武人。本与小提琴公主敌对，因得知共同的敌人——管风琴魔女的存在，不情愿地选择合作。燃烧的正义感与对伙伴深厚的情谊是他最大的武器。',instrument:'中音萨克斯（音波魔法武器）',ability:'音波冲击・金属强化・冲锋呐喊'},
  piano:{ name:'钢琴王子',nameSub:'钢琴王子',role:'键盘乐国王子',country:'键盘乐国',appearance:'黑色斗篷，宽檐黑帽，金发碧眼。骑白马"福蒂西莫"',personality:'优雅而神秘。表面沉稳，内心燃烧着热情。',desc:'键盘乐国王子。骑着白马"福蒂西莫"静静穿梭于战场的神秘青年。深知父皇被魔女操控，他在内部默默行动，誓要拯救自己的国家。',instrument:'三角钢琴（操控时空的琴键）',ability:'时间调音・空间琶音・强音冲锋'},
  maestro:{ name:'塔克特大师',nameSub:'塔克特大师',role:'传奇音乐家 / 师傅',country:'游历中',appearance:'白色尖顶帽，长白胡须，手持魔法指挥棒',personality:'豪爽而深沉睿智。对学生严格而充满爱。',desc:'曾站在世界音乐巅峰的传奇指挥家塔克特大师。如今成为流浪老人，他的魔法指挥棒能将音乐的力量放大数倍。与小提琴公主相遇后，他识出她的才华，收其为弟子。',instrument:'魔法指挥棒（大师之杖）',ability:'音乐增幅・全方位指挥・感应时间旋律'},
  castanet:{ name:'卡斯塔内特',nameSub:'卡斯塔内特',role:'打击乐国的孩子',country:'打击乐国',appearance:'可爱的孩子，有一口与众不同的大门牙',personality:'天真可爱。用大门牙发出咔哒声。',desc:'居住在打击乐国的小孩，能用大门牙发出如卡斯塔内特般的咔哒声，天赋异禀。身为熟知打击乐国深处的向导，天真的微笑和纯洁的内心为疲惫的旅人带来光亮。',instrument:'卡斯塔内特（大门牙与手掌）',ability:'节奏魔法・地形向导・治愈微笑'},
  harp:{ name:'竖琴王后',nameSub:'竖琴王后',role:'弦乐国王后 / 小提琴公主之母',country:'弦乐国',appearance:'银白色礼服，金色王冠，雍容华贵',personality:'满溢优雅与从容。深爱人民，意志坚强。',desc:'弦乐国王后，小提琴公主之母。美丽的竖琴旋律曾令人民着迷，为大地带来和平。在键盘乐国入侵中被俘，她的雍容与坚定从未动摇，静静等待女儿归来。',instrument:'竖琴（王后的和平之器）',ability:'精神安定・治愈旋律・魔法结界'},
  viola:{ name:'中提琴王子',nameSub:'中提琴王子',role:'弦乐国王子 / 小提琴公主之兄',country:'弦乐国',appearance:'深蓝色礼服，红色披风，英姿飒爽的年轻王子',personality:'保护妹妹，正义感强。冷静果断。',desc:'弦乐国王子，小提琴公主的哥哥。比任何人都相信妹妹的才华，始终在暗中支持她。在键盘乐国入侵时，他勇敢地面对敌人，保护人民，却不幸被俘。',instrument:'中提琴（深沉丰润的中音弦乐）',ability:'音之盾・共鸣护卫・低音震荡'},
  cello:{ name:'大提琴管家',nameSub:'大提琴管家',role:'弦乐国王室管家',country:'弦乐国',appearance:'黑色礼服，白色手套，身姿挺拔的中年管家',personality:'认真细致。对王室忠诚至深。偶尔流露俏皮。',desc:'侍奉弦乐国王宫的管家，自小提琴公主幼年起便悉心照料她的忠厚老仆。大提琴深沉的音色能抚慰听者内心，压制同伴的躁动。',instrument:'大提琴（深沉共鸣的低音弦乐）',ability:'情绪安抚・共鸣护卫・低音结界'},
  contrabass:{ name:'低音提琴伯爵',nameSub:'低音提琴伯爵',role:'弦乐国伯爵',country:'弦乐国',appearance:'魁梧体格，黑色礼服，白色假发',personality:'低沉而威严的存在。寡言却可靠。',desc:'弦乐国的显赫伯爵。如同低音提琴厚重的音色，他散发着坚实的存在感。多年来支撑弦乐国的老将，危机时刻以无与伦比的力量鼓舞人民。',instrument:'低音提琴（最低音的乐器）',ability:'大地震动・深沉冲击波・威慑咆哮'},
  clarinet:{ name:'单簧管公主',nameSub:'单簧管公主',role:'管乐国公主',country:'管乐国',appearance:'轻盈明亮的装束，聪慧公主般清澈的眼神',personality:'善良而聪慧。对周围人的情感极为敏锐。',desc:'管乐国公主，萨克斯暗中倾心之人。温柔聪慧，能敏锐感知周围人的情绪。她秘密向盟友传递情报，从内部推动局势改变。',instrument:'单簧管（音色清亮的木管乐器）',ability:'倾听心声・声音探测・治愈旋律'},
  accordion:{ name:'手风琴骑士团',nameSub:'手风琴骑士团',role:'键盘乐国巡逻骑士团',country:'键盘乐国',appearance:'身着刻有琴键纹样风箱铠甲的多名骑士，总是以整齐队列行动',personality:'最重视同伴间的羁绊。单独行动不如联合作战是他们的信条。',desc:'守护键盘乐国各地城镇与边境的精锐骑士团。风箱铠甲上刻有琴键纹样，是效忠黑白秩序的誓言——手风琴的键盘证明它是真正的键盘乐器，是键盘乐国的骄傲象征。单体战力中等，但多人合奏时爆发出压倒性力量。无论多偏远危险的据点，他们都会毫不犹豫地赶赴。',instrument:'手风琴（带键盘的风箱式键盘乐器）',ability:'协同音波・风箱盾牌・和弦爆发'},
  trombone:{ name:'长号士兵',nameSub:'长号士兵',role:'管乐国守卫士兵',country:'管乐国',appearance:'身着坚实铠甲，目光锐利，胡须整洁的士兵',personality:'正直守纪。对职责坚守不移。',desc:'守护管乐国要地的城门卫兵，同时担任传令兵，以远及之处的长号音波警示同伴危险。深深崇拜萨克斯大将，从不误事的忠诚士兵。沉默却忠实，关键时刻总会出现。',instrument:'长号（滑管铜管乐器）',ability:'远距离音波信号・音墙构建・振奋战吼'},
  tuba:{ name:'大号副将',nameSub:'大号副将',role:'管乐国骑士团副将',country:'管乐国',appearance:'高大体格，温和表情，厚重铠甲',personality:'体型魁梧却心地善良。尊重萨克斯，忠心追随。',desc:'管乐国骑士团副将。虽有大号般的魁梧体型，内心却是最温柔的。战场上以压倒性的存在感击溃敌人，对同伴始终温柔相待。',instrument:'大号（最大的铜管乐器）',ability:'压力之墙・高音量冲击波・提振士气'},
  marimba:{ name:'马林巴',nameSub:'马林巴',role:'木琴兄妹的哥哥',country:'打击乐国',appearance:'开朗的微笑，轻盈的动作，色彩鲜艳的打击乐国部落服饰',personality:'开朗乐观。口头禅是"nba"。',desc:'打击乐国木琴兄妹二人组的哥哥。"nba"的口头禅与永不消失的笑容是他的招牌。与妹妹木琴默契配合，支持同伴们。',instrument:'马林巴（木制键盘打击乐器）',ability:'温暖音色・气氛调和・快速连击'},
  xylophone:{ name:'木琴',nameSub:'木琴',role:'木琴兄妹的妹妹',country:'打击乐国',appearance:'精力充沛的少女，编发，双眼炯炯有神',personality:'活力四射，行动派。口头禅是"fon"。',desc:'打击乐国木琴兄妹二人组的妹妹。胆量甚至超过哥哥的元气少女。毫不犹豫扑向危险的勇气，总让周围人大吃一惊。',instrument:'木琴（音色清亮的高音木制乐器）',ability:'高音冲击・快速连击・音之斩击'},
  glocken:{ name:'钟琴',nameSub:'钟琴',role:'打击乐国神殿守卫',country:'打击乐国',appearance:'钟形头盔，固执的表情',personality:'固执守旧。口头禅是"ken"。',desc:'打击乐国神殿的门卫。极其固守规则的顽固者。然而，一旦被真诚的话语所打动，便会化身最忠实的盟友。',instrument:'钟琴（铁制铃铛）',ability:'铁音波・结界之铃・硬化铠甲'},
  timpani:{ name:'定音鼓王',nameSub:'定音鼓王',role:'打击乐国大王',country:'打击乐国',appearance:'魁梧体型，打击乐国传统王服，头戴大型羽毛头冠',personality:'威严而豪爽。深爱打击乐国人民的伟大君王。',desc:'打击乐国大王。有着如定音鼓般魁梧的体型，声音足以震动大地。被小提琴公主的演奏所打动，决定借出打击乐国的力量。',instrument:'定音鼓（鼓之王 / 大地的脉搏）',ability:'大地震动・震天战吼・铁壁防守'},
  organ:{ name:'风琴士兵',nameSub:'风琴士兵',role:'键盘乐国士兵',country:'键盘乐国',appearance:'紫色制服，帽子略显歪斜，总是一副疲倦的神情',personality:'对什么都嘟囔"真麻烦"。总想走捷径，关键时刻却能搞定。',desc:'键盘乐国的下级士兵，每天至少说一百遍"真麻烦"。巡逻时打盹，报告只写最低限度，对每个命令都嘟嘟囔囔。但骨子里出乎意料地靠谱——真正遇到危险时，他比任何人都冲得快。他也是第一个察觉皇帝行为异常的人，嘀咕着"感觉不对劲……真麻烦，我去查一查。"',instrument:'簧风琴（破旧的脚踏风琴）',ability:'慵懒旋律・捷径和弦・不情愿闪电一击'},
  cembalo:{ name:'羽管键琴皇帝',nameSub:'羽管键琴皇帝',role:'键盘乐国皇帝',country:'键盘乐国',appearance:'白黑帝袍，银色王冠。庄严的老人',personality:'本为温柔的爱乐者。但如今被魔女操控。',desc:'键盘乐国皇帝。原本是一位爱好音乐、渴望和平的温柔老人。但在管风琴魔女的诅咒下，他如今以威严的统治者身份指挥着入侵。',instrument:'羽管键琴（古老的键盘之王）',ability:'（本来）和平旋律・历史曲调・时间的记忆'},
  pipeorgan:{ name:'管风琴魔女',nameSub:'管风琴魔女',role:'幕后主使 / 征服世界的魔女',country:'不明',appearance:'漆黑长袍，锐利双眸，散发着深不可测的黑暗气息',personality:'冷酷而精于算计。执着于权力，将音乐视为支配的工具。',desc:'本作的真正反派。操控键盘乐国皇帝以征服世界的暗黑魔女。她拥有如管风琴般压倒一切的音压，其力量的真正深度无人能够估量。她与音乐纯粹力量的对立象征着整个故事的核心矛盾。',instrument:'管风琴（支配之器）',ability:'魔法音控・暗黑结界・音之诅咒・深渊和弦'},
  dragon:{ name:'神秘巨龙',nameSub:'神秘巨龙',role:'身份不明的暗黑巨龙',country:'不明',appearance:'漆黑的巨大龙躯，散发着压倒性的力量与深不可测的黑暗',personality:'破坏的化身。无需言语，以压倒一切的力量与恐惧征服一切。',desc:'突然出现在最终决战之地的神秘巨龙。它从漆黑龙躯中释放的暗黑音压能消除一切交响乐，将整个世界笼罩其中。其真实身份与来历完全不明。唯有小提琴公主与同伴们编织而成的四国和谐，才能与之抗衡。',instrument:'龙之咆哮（究极破坏音）',ability:'暗黑音波轰炸・音之结界破坏・毁灭咆哮'},
  daspalla:{ name:'肩挂大提琴士兵',nameSub:'肩挂大提琴士兵',role:'弦乐国王族护卫',country:'弦乐国',appearance:'肩背小型大提琴的精壮体格，沉默而严峻的面容',personality:'沉默而忠诚。以行动代言，将对王族的奉献视为一切。',desc:'从暗处守护弦乐国王族的护卫兵。身背古乐器「肩挂大提琴」（Violoncello da Spalla），以音乐与剑为武器战斗。几乎不发一言，但他的奉献比任何人都深沉。键盘乐国入侵时，他是拼死为小提琴公主开辟逃路的人之一。',instrument:'肩挂大提琴（古老的肩背小型大提琴）',ability:'旋律护盾・斩音一击・奉献共鸣'},
};

/* ── 言語切替関数 ── */
function setLanguage(lang) {
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;
  // 字幕言語をサイト言語に同期（CCボタンも更新）
  _applySubLang(lang);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key    = el.dataset.i18n;
    const isHtml = el.hasAttribute('data-i18n-html');

    if (lang === 'en' || lang === 'zh') {
      // 日本語テキストを data-ja に保存（初回のみ）
      if (!el.hasAttribute('data-ja')) {
        el.setAttribute('data-ja', isHtml ? el.innerHTML : el.textContent.trim());
      }
      const dict = lang === 'en' ? i18n_en : i18n_zh;
      const val = dict[key];
      if (val != null) el[isHtml ? 'innerHTML' : 'textContent'] = val;
    } else {
      // 日本語へ復元
      const ja = el.getAttribute('data-ja');
      if (ja != null) el[isHtml ? 'innerHTML' : 'textContent'] = ja;
    }
  });

  // lang-btn の active 状態を更新
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // <title> を更新
  const titleEl = document.querySelector('title[data-i18n]');
  if (titleEl) {
    if (lang === 'en' || lang === 'zh') {
      if (!titleEl.hasAttribute('data-ja')) titleEl.setAttribute('data-ja', document.title);
      const dict = lang === 'en' ? i18n_en : i18n_zh;
      const t = dict[titleEl.dataset.i18n];
      if (t) document.title = t;
    } else {
      const jaTitle = titleEl.getAttribute('data-ja');
      if (jaTitle) document.title = jaTitle;
    }
  }

  // BGM音源を言語に合わせて切り替え
  const audio = document.getElementById('bgm-audio');
  if (audio) {
    const enSrc  = 'audio/Symphony of One World English version.wav';
    const zhSrc  = 'audio/Symphony of One World Chinese version.wav';
    const jaSrc  = 'audio/Symphony of One World.wav';
    const target = lang === 'en' ? enSrc : lang === 'zh' ? zhSrc : jaSrc;
    const source = audio.querySelector('source');
    const current = source ? source.getAttribute('src') : null;
    if (source && current !== target) {
      const wasPlaying = !audio.paused;
      const savedTime  = audio.currentTime;
      const savedVol   = audio.volume;
      if (wasPlaying) audio.pause();
      source.setAttribute('src', target);
      audio.load();
      audio.volume = savedVol;
      function _onReady() {
        audio.removeEventListener('canplay', _onReady);
        if (savedTime > 0) audio.currentTime = savedTime;
        if (wasPlaying) audio.play().catch(() => {});
      }
      audio.addEventListener('canplay', _onReady);
    }
  }
}

function initLanguage() {
  let lang = localStorage.getItem(LANG_KEY);
  if (!lang) {
    const bl = (navigator.language || navigator.userLanguage || 'ja').toLowerCase();
    if (bl.startsWith('zh')) lang = 'zh';
    else if (bl.startsWith('en')) lang = 'en';
    else lang = 'ja';
  }
  setLanguage(lang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
}

/* ══════════════════════════════════════════════════════════
   BGM PLAYER
   音源: audio/Symphony of One World.wav（プロジェクト内相対パス）

   ・ページ遷移前に currentTime / volume / playing を localStorage に保存
   ・次ページ読み込み時に復元して自動再生
   ・ページ間でシームレスに再生が続く（空白は最小限）
   ══════════════════════════════════════════════════════════ */

const BGM_KEY         = 'bgm_state';
const BGM_CONSENT_KEY = 'bgm_consent';

function saveBGMState(audio) {
  if (!audio) return;
  try {
    localStorage.setItem(BGM_KEY, JSON.stringify({
      time:    audio.currentTime,
      playing: !audio.paused,
      volume:  audio.volume,
    }));
  } catch(e) {}
}

function loadBGMState() {
  try { return JSON.parse(localStorage.getItem(BGM_KEY) || '{}'); }
  catch(e) { return {}; }
}

function formatTime(s) {
  if (!isFinite(s) || isNaN(s)) return '--:--';
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

/* ══════════════════════════════════════════════════════════
   BGM CONSENT DIALOG
   ══════════════════════════════════════════════════════════ */
function showMusicConsentDialog(callback) {
  const _cl = localStorage.getItem(LANG_KEY) || 'ja';
  const _ct = _cl === 'en'
    ? { title: 'Play the music of this world?',
        desc:  '"Symphony of One World" will play.<br>You can stop or adjust the volume anytime.',
        yes:   '♪ Play',
        no:    'Start quietly' }
    : _cl === 'zh'
    ? { title: '要播放这个世界的音乐吗？',
        desc:  '将播放「Symphony of One World」。<br>随时可以暂停或调节音量。',
        yes:   '♪ 播放',
        no:    '静静开始' }
    : { title: 'この世界の音楽を再生しますか？',
        desc:  '「Symphony of One World」が流れます。<br>いつでも停止・音量調節できます。',
        yes:   '♪ 再生する',
        no:    '静かに始める' };
  const overlay = document.createElement('div');
  overlay.id = 'bgm-consent-overlay';
  overlay.className = 'bgm-consent-overlay';
  overlay.innerHTML = `
    <div class="bgm-consent-dialog">
      <div class="bgm-consent-icon">🎵</div>
      <h2 class="bgm-consent-title">${_ct.title}</h2>
      <p class="bgm-consent-desc">${_ct.desc}</p>
      <div class="bgm-consent-buttons">
        <button id="bgm-consent-yes" class="bgm-consent-btn bgm-consent-yes">${_ct.yes}</button>
        <button id="bgm-consent-no"  class="bgm-consent-btn bgm-consent-no">${_ct.no}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('open')));

  function close(agreed) {
    overlay.classList.remove('open');
    setTimeout(() => overlay.remove(), 350);
    callback(agreed);
  }
  document.getElementById('bgm-consent-yes').addEventListener('click', () => close(true));
  document.getElementById('bgm-consent-no').addEventListener('click',  () => close(false));
}

function initBGMPlayer() {
  const saved = loadBGMState();
  // ユーザーが意図的に停止したかどうか（ブラウザの自動再生制限による paused とは別管理）
  window._bgmUserPaused = (saved.playing === false);
  const _initLang = localStorage.getItem(LANG_KEY) || 'ja';
  const _initSrc  = _initLang === 'en'
    ? 'audio/Symphony of One World English version.wav'
    : _initLang === 'zh'
      ? 'audio/Symphony of One World Chinese version.wav'
      : 'audio/Symphony of One World.wav';
  const _initSub  = _initLang === 'en'
    ? 'Violin Princess &amp; the Magic Symphony BGM'
    : _initLang === 'zh'
      ? '小提琴公主与魔法交响乐 BGM'
      : 'バイオリン姫と魔法のシンフォニー BGM';

  const playerHTML = `
    <div id="bgm-player" class="bgm-player">
      <audio id="bgm-audio" loop preload="auto">
        <source src="${_initSrc}" type="audio/wav">
      </audio>

      <div class="bgm-inner">
        <!-- Row 1: タイトル + ボタン -->
        <div class="bgm-row1">
          <div class="bgm-info">
            <span class="bgm-note-anim" id="bgm-note-icon">♪</span>
            <div class="bgm-text">
              <div class="bgm-title">Symphony of One World</div>
              <div class="bgm-sub" data-i18n="bgm-sub">${_initSub}</div>
            </div>
          </div>
          <div class="bgm-controls">
            <button id="bgm-play-btn" class="bgm-btn bgm-play-btn" title="再生 / 停止" aria-label="再生/停止">▶</button>
            <div class="bgm-vol-wrap" title="音量調節">
              <span class="bgm-vol-icon" id="bgm-vol-icon">🔊</span>
              <input type="range" id="bgm-vol" class="bgm-volume" min="0" max="1" step="0.05" value="${saved.volume ?? 0.4}" aria-label="音量">
            </div>
            <button id="bgm-min-btn" class="bgm-btn bgm-min-btn" title="最小化" aria-label="最小化">−</button>
          </div>
        </div>

        <!-- Row 2: シークバー -->
        <div class="bgm-row2">
          <span class="bgm-time" id="bgm-current">0:00</span>
          <input type="range" id="bgm-seek" class="bgm-seek" min="0" max="100" step="0.05" value="0" aria-label="再生位置">
          <span class="bgm-time" id="bgm-duration">--:--</span>
        </div>
      </div>
    </div>
    <button id="bgm-restore-btn" class="bgm-restore" style="display:none;" title="BGMプレイヤーを開く" aria-label="BGMプレイヤーを開く">♪</button>
  `;
  document.body.insertAdjacentHTML('beforeend', playerHTML);

  const audio      = document.getElementById('bgm-audio');
  const playBtn    = document.getElementById('bgm-play-btn');
  const volSlider  = document.getElementById('bgm-vol');
  const volIcon    = document.getElementById('bgm-vol-icon');
  const noteIcon   = document.getElementById('bgm-note-icon');
  const player     = document.getElementById('bgm-player');
  const restoreBtn = document.getElementById('bgm-restore-btn');
  const minBtn     = document.getElementById('bgm-min-btn');
  const seekBar    = document.getElementById('bgm-seek');
  const currentEl  = document.getElementById('bgm-current');
  const durationEl = document.getElementById('bgm-duration');

  /* ── 音量復元 ── */
  audio.volume = parseFloat(saved.volume ?? 0.4);
  updateVolIcon(audio.volume);
  updateVolSliderFill(audio.volume);

  /* ── 再生状態 UI 更新 ── */
  function setPlaying(playing) {
    playBtn.textContent = playing ? '⏸' : '▶';
    playBtn.title = playing ? '停止' : '再生';
    noteIcon.style.animationPlayState = playing ? 'running' : 'paused';
    noteIcon.style.opacity = playing ? '1' : '0.6';
    player.classList.toggle('bgm-playing', playing);
  }

  /* ── シークバー更新 ── */
  function updateSeek() {
    if (!audio.duration || isNaN(audio.duration)) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    seekBar.value = pct;
    currentEl.textContent = formatTime(audio.currentTime);
    // Fill gradient
    seekBar.style.background =
      `linear-gradient(to right, #d4af37 ${pct}%, rgba(212,175,55,0.22) ${pct}%)`;
  }

  /* ── ページ遷移前に状態保存 ── */
  function saveCurrent() {
    // audio.paused はブラウザ自動再生制限で true になる場合がある。
    // ユーザーが意図的に停止していなければ「再生中」として保存する。
    const consent = localStorage.getItem(BGM_CONSENT_KEY);
    if (consent === 'yes' && !window._bgmUserPaused) {
      try {
        localStorage.setItem(BGM_KEY, JSON.stringify({
          time:    audio.currentTime,
          playing: true,
          volume:  audio.volume,
        }));
      } catch(e) {}
    } else {
      saveBGMState(audio);
    }
  }
  window.addEventListener('beforeunload', saveCurrent);
  document.addEventListener('visibilitychange', () => { if (document.hidden) saveCurrent(); });

  /* ── audio イベント ── */
  audio.addEventListener('play',  () => setPlaying(true));
  audio.addEventListener('pause', () => setPlaying(false));
  audio.addEventListener('timeupdate', updateSeek);
  audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
    updateSeek();
  });

  /* ── ページ復元（currentTime をセット） ── */
  function applyRestoredTime() {
    if (saved.time && saved.time > 0) {
      audio.currentTime = Math.min(saved.time, audio.duration || saved.time);
    }
  }
  if (audio.readyState >= 1) {
    applyRestoredTime();
  } else {
    audio.addEventListener('loadedmetadata', applyRestoredTime, { once: true });
  }

  /* ── 再生ボタン ── */
  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      window._bgmUserPaused = false;
      // 手動再生した時点でコンセントを yes に昇格（「静かに始める」後に手動再生した場合も対応）
      localStorage.setItem(BGM_CONSENT_KEY, 'yes');
      audio.play().catch(() => {});
    } else {
      window._bgmUserPaused = true;
      audio.pause();
    }
  });

  /* ── シークバー操作 ── */
  let isSeeking = false;
  seekBar.addEventListener('mousedown',  () => { isSeeking = true; });
  seekBar.addEventListener('touchstart', () => { isSeeking = true; }, { passive: true });
  seekBar.addEventListener('input', () => {
    if (!audio.duration) return;
    const newTime = (parseFloat(seekBar.value) / 100) * audio.duration;
    currentEl.textContent = formatTime(newTime);
    seekBar.style.background =
      `linear-gradient(to right, #d4af37 ${seekBar.value}%, rgba(212,175,55,0.22) ${seekBar.value}%)`;
  });
  seekBar.addEventListener('change', () => {
    if (!audio.duration) return;
    audio.currentTime = (parseFloat(seekBar.value) / 100) * audio.duration;
    isSeeking = false;
  });

  /* ── 音量スライダー ── */
  volSlider.addEventListener('input', () => {
    const v = parseFloat(volSlider.value);
    audio.volume = v;
    updateVolIcon(v);
    updateVolSliderFill(v);
  });

  function updateVolIcon(v) {
    volIcon.textContent = v === 0 ? '🔇' : v < 0.4 ? '🔉' : '🔊';
  }
  function updateVolSliderFill(v) {
    const pct = v * 100;
    volSlider.style.background =
      `linear-gradient(to right, #d4af37 ${pct}%, rgba(212,175,55,0.22) ${pct}%)`;
  }

  /* ── 最小化 / 復元 ── */
  minBtn.addEventListener('click', () => {
    player.style.display = 'none';
    restoreBtn.style.display = 'flex';
  });
  restoreBtn.addEventListener('click', () => {
    player.style.display = '';
    restoreBtn.style.display = 'none';
  });

  /* ══════════════════════════════════════════
     自動再生ロジック
     ・初回訪問 → 確認ダイアログを表示
     ・「はい」→ 自動再生を試みる
     ・「いいえ」→ 音楽 off のまま（手動再生は可能）
     ・2回目以降 → consent の記録に従って再生/停止
     ══════════════════════════════════════════ */
  const consent = localStorage.getItem(BGM_CONSENT_KEY);

  function tryAutoPlay() {
    audio.play()
      .then(() => setPlaying(true))
      .catch(() => {
        playBtn.classList.add('bgm-pulse');
      });
  }

  function enableFirstInteraction() {
    function onFirstInteraction() {
      window._bgmCancelAutoStart = null;
      if (audio.paused) {
        audio.play()
          .then(() => {
            setPlaying(true);
            playBtn.classList.remove('bgm-pulse');
          })
          .catch(() => {});
      }
      document.removeEventListener('click',     onFirstInteraction);
      document.removeEventListener('touchstart', onFirstInteraction);
      document.removeEventListener('keydown',    onFirstInteraction);
    }
    document.addEventListener('click',     onFirstInteraction, { once: true });
    document.addEventListener('touchstart', onFirstInteraction, { once: true, passive: true });
    document.addEventListener('keydown',    onFirstInteraction, { once: true });

    /* 外部からキャンセルできるよう公開 */
    window._bgmCancelAutoStart = function() {
      document.removeEventListener('click',     onFirstInteraction);
      document.removeEventListener('touchstart', onFirstInteraction);
      document.removeEventListener('keydown',    onFirstInteraction);
      window._bgmCancelAutoStart = null;
    };
  }

  // index.html かどうかを判定
  const isTopPage = location.pathname.endsWith('index.html')
    || location.pathname === '/'
    || location.pathname.endsWith('/');

  if (isTopPage) {
    // オープニングフローが終わったあと呼ばれるトリガーを公開
    // initOpeningFlow() → showMusicConsentDialog() → _bgmStartIfAgreed(agreed) の順に呼ばれる
    window._bgmStartIfAgreed = function(agreed) {
      localStorage.setItem(BGM_CONSENT_KEY, agreed ? 'yes' : 'no');
      if (agreed) {
        window._bgmUserPaused = false;
        tryAutoPlay();
        enableFirstInteraction();
      }
    };
  } else if (consent === 'yes') {
    // 他ページ：前回の選択を引き継いで再生
    const shouldPlay = saved.playing !== false;
    if (shouldPlay) {
      tryAutoPlay();
      enableFirstInteraction();
    }
    // shouldPlay が false（ユーザーが一時停止済み）の場合は自動再生しない
  }
  // consent === 'no' → 何もしない（手動で再生ボタンを押せば再生可能）
}

/* ══════════════════════════════════════════════════════════
   OPENING FLOW（トップページ初回表示フロー）

   1. オープニング確認モーダルを表示
   2a.「オープニングを見る」→ 動画をフルスクリーンオーバーレイで再生
      → 動画終了 or スキップ → BGM確認モーダル表示
   2b.「いますぐ物語へ」→ 動画スキップ → BGM確認モーダル表示
   3. BGM確認後に window._bgmStartIfAgreed(agreed) を呼び出す
   ══════════════════════════════════════════════════════════ */
function initOpeningFlow() {
  const isTopPage = location.pathname.endsWith('index.html')
    || location.pathname === '/'
    || location.pathname.endsWith('/');
  if (!isTopPage) return;

  const modal      = document.getElementById('opening-modal');
  const overlay    = document.getElementById('opening-video-overlay');
  const video      = document.getElementById('opening-video');
  const flash      = document.getElementById('opening-video-flash');
  const btnWatch   = document.getElementById('btn-watch-opening');
  const btnSkip    = document.getElementById('btn-skip-opening');
  const btnVSkip   = document.getElementById('opening-video-skip');
  const seekBar    = document.getElementById('ovc-seek');
  const volSlider  = document.getElementById('ovc-vol');
  const muteBtn    = document.getElementById('ovc-mute-btn');
  const currentEl  = document.getElementById('ovc-current');
  const durationEl = document.getElementById('ovc-duration');

  if (!modal) return;

  /* ══ スクロールロック ══ */
  function lockScroll()   { document.body.style.overflow = 'hidden'; }
  function unlockScroll() { document.body.style.overflow = '';       }

  /* ══ タイムライン自動非表示（3秒操作なしで消える） ══ */
  const controls   = document.getElementById('opening-video-controls');
  let hideTimer    = null;
  let isIdle       = false;

  function showTimeline() {
    if (!controls) return;
    isIdle = false;
    controls.classList.add('is-visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      isIdle = true;
      controls.classList.remove('is-visible');
    }, 3000);
  }
  function bindTimelineActivity() {
    overlay.addEventListener('mousemove',  showTimeline);
    overlay.addEventListener('mousedown',  showTimeline);
    overlay.addEventListener('touchstart', showTimeline, { passive: true });
    overlay.addEventListener('touchmove',  showTimeline, { passive: true });
  }
  function unbindTimelineActivity() {
    clearTimeout(hideTimer);
    controls.classList.remove('is-visible');
  }

  /* ══ 音符パーティクル演出 ══
     ♪♫♩♬ が画面全体から舞い上がり、黄金の光に溶けてBGMモーダルへ */
  function playNoteParticles(cb) {
    const noteChars = ['♪', '♫', '♩', '♬', '𝄞', '♭', '♮', '♯'];
    const COUNT = window.innerWidth < 600 ? 18 : 28;

    // パーティクル生成
    const particles = [];
    for (let i = 0; i < COUNT; i++) {
      const el  = document.createElement('span');
      el.className = 'ovc-note-particle';
      el.textContent = noteChars[Math.floor(Math.random() * noteChars.length)];

      // 画面全体にランダム配置
      const sx   = 3 + Math.random() * 94;   // vw
      const sy   = 3 + Math.random() * 94;   // vh
      const size = 1.0 + Math.random() * 2.4; // rem
      // 散らばり方向：主に上方向 + ランダム横移動
      const tx   = (Math.random() - 0.5) * 220;
      const ty   = -(55 + Math.random() * 160);
      const rot  = (Math.random() - 0.5) * 600;
      const dur  = 0.85 + Math.random() * 0.55;  // s
      const del  = Math.random() * 0.30;           // s delay

      el.style.cssText = `
        left:${sx}vw; top:${sy}vh;
        font-size:${size}rem;
        opacity:1;
        transform:translate(0,0) rotate(0deg);
        transition:
          transform ${dur}s cubic-bezier(0.22,1,0.36,1) ${del}s,
          opacity   ${dur * 0.65}s ease-in               ${del + dur * 0.35}s;
      `;
      overlay.appendChild(el);
      particles.push({ el, tx, ty, rot });
    }

    // 1フレーム後にトランジション開始
    requestAnimationFrame(() => requestAnimationFrame(() => {
      particles.forEach(({ el, tx, ty, rot }) => {
        el.style.opacity   = '0';
        el.style.transform = `translate(${tx}px,${ty}px) rotate(${rot}deg)`;
      });
    }));

    // パーティクル終了後 → ゴールデンブルーム → 次へ
    const maxDur = 1350; // (0.85+0.30)*1000 + buffer
    setTimeout(() => {
      particles.forEach(({ el }) => el.remove());
      // ゴールデンブルーム（短く）
      if (flash) {
        flash.classList.add('flash-in');
        setTimeout(() => {
          flash.classList.remove('flash-in');
          flash.classList.add('flash-hold');
          setTimeout(() => {
            flash.classList.remove('flash-hold');
            flash.classList.add('flash-out');
            setTimeout(() => { flash.classList.remove('flash-out'); cb(); }, 550);
          }, 280);
        }, 450);
      } else {
        cb();
      }
    }, maxDur);
  }

  /* ══ 動画コントロールバー ══ */
  function ovcFmt(s) {
    if (!isFinite(s) || isNaN(s)) return '--:--';
    const m = Math.floor(s / 60);
    return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  }
  function ovcSeekFill(pct) {
    seekBar.style.background =
      `linear-gradient(to right, rgba(201,162,39,0.90) ${pct}%, rgba(255,255,255,0.28) ${pct}%)`;
  }
  /* 縦スライダーは rotate(-90deg) → fill は bottom→top 方向なので値を反転して計算 */
  function ovcVolFill(v) {
    const pct = v * 100;
    volSlider.style.background =
      `linear-gradient(to right, rgba(201,162,39,0.90) ${pct}%, rgba(255,255,255,0.28) ${pct}%)`;
  }

  /* ── Subtitles ── */
  // タイムコード HH:MM:SS:FF → 秒 (30fps)
  // テロップ（キャラクター名・作品情報）
  const _OVC_SUBS = {
    ja: [
      { s:  0.067, e:  4.633, t: '原作　アルス・ダ・ヴィンチ\n『ミュージックワールド』～バイオリン姫と魔法のシンフォニー～　文芸社' },
      { s: 20.200, e: 23.467, t: 'ゲンガク国のお姫様\nバイオリン姫',                                                              p: 'bl' },
      { s: 22.733, e: 26.033, t: 'ケンバンガク国の王子様\nピアノ王子',                                                            p: 'tr' },
      { s: 27.700, e: 31.000, t: 'カンガク国の騎士\nアルト・サクソフォーン',                                                      p: 'tr' },
      { s: 32.733, e: 36.033, t: 'ゲンガク国の女王\nハープ女王',                                                                  p: 'bl' },
      { s: 57.133, e: 61.433, t: 'ケンバンガク国の魔女\nパイプオルガン',                                                          p: 'br' },
      { s: 63.300, e: 66.233, t: 'ダ国の木琴兄妹\nマリンバ＆シロフォン' },
      { s: 66.233, e: 69.667, t: 'ダガク国の民\nカスタネット坊や',                                                                p: 'tr' },
      { s: 77.267, e: 80.700, t: 'ダガク国の王様\nティンパニー大王',                                                              p: 'tl' },
      { s: 83.233, e: 86.400, t: 'ドレミの森の指揮者\nタクト・マエストロ',                                                        p: 'bl' },
      { s:102.300, e:106.300, t: '日本語版エンドソング\n「シンフォニー・オブ・ワンワールド」  performed by DJ らむね' },
    ],
    en: [
      { s:  0.067, e:  4.633, t: 'Original Work: Ars Da Vinci\n"MUSIC WORLD" ~The Violin Princess and the Magic Symphony~  Bungeisha' },
      { s: 20.200, e: 23.467, t: 'Princess of the String Kingdom\nViolin Princess',          p: 'bl' },
      { s: 22.733, e: 26.033, t: 'Prince of the Keyboard Kingdom\nPiano Prince',             p: 'tr' },
      { s: 27.700, e: 31.000, t: 'Knight of the Wind Kingdom\nAlto Saxophone',               p: 'tr' },
      { s: 32.733, e: 36.033, t: 'Queen of the String Kingdom\nHarp Queen',                  p: 'bl' },
      { s: 57.133, e: 61.433, t: 'Witch of the Keyboard Kingdom\nPipe Organ',                p: 'br' },
      { s: 63.300, e: 66.233, t: 'Xylophone Siblings of Da Kingdom\nMarimba & Xylophone' },
      { s: 66.233, e: 69.667, t: 'Child of the Percussion Kingdom\nCastanets Boy',           p: 'tr' },
      { s: 77.267, e: 80.700, t: 'King of the Percussion Kingdom\nTympani the Great',        p: 'tl' },
      { s: 83.233, e: 86.400, t: 'Conductor of the Do-Re-Mi Forest\nTact Maestro',           p: 'bl' },
      { s:102.300, e:106.300, t: 'End Song (Japanese Ver.)\n"Symphony of One World"  performed by DJ Ramune' },
    ],
    zh: [
      { s:  0.067, e:  4.633, t: '原著：阿尔斯·达·芬奇\n《音乐世界》～小提琴公主与魔法交响乐～　文艺社' },
      { s: 20.200, e: 23.467, t: '弦乐国的公主\n小提琴公主',       p: 'bl' },
      { s: 22.733, e: 26.033, t: '键盘乐国的王子\n钢琴王子',       p: 'tr' },
      { s: 27.700, e: 31.000, t: '管乐国的骑士\n中音萨克斯',       p: 'tr' },
      { s: 32.733, e: 36.033, t: '弦乐国的女王\n竖琴女王',         p: 'bl' },
      { s: 57.133, e: 61.433, t: '键盘乐国的魔女\n管风琴',         p: 'br' },
      { s: 63.300, e: 66.233, t: '打乐国的木琴兄妹\n马林巴＆木琴' },
      { s: 66.233, e: 69.667, t: '打乐国的孩子\n响板小弟',         p: 'tr' },
      { s: 77.267, e: 80.700, t: '打乐国的国王\n定音鼓大王',       p: 'tl' },
      { s: 83.233, e: 86.400, t: '多来咪森林的指挥家\n塔克特·大师', p: 'bl' },
      { s:102.300, e:106.300, t: '日语版片尾曲\n《一个世界的交响乐》  演唱：DJ Ramune' },
    ],
  };
  // セリフ・ナレーション字幕
  const _OVC_SUBS_MAIN = {
    ja: [
      { s:  4.667, e:  9.367, t: 'あるところに音楽で会話をする4つの国がありました' },
      { s:  9.367, e: 12.033, t: '管楽器のカンガク国' },
      { s: 12.033, e: 14.300, t: '打楽器のダガク国' },
      { s: 14.300, e: 16.700, t: '鍵盤楽器のケンバンガク国' },
      { s: 16.700, e: 20.200, t: 'そして弦楽器のゲンガク国' },
      { s: 20.200, e: 24.000, t: 'それぞれの音色と文化を育みながら平和に暮らしていました' },
      { s: 24.000, e: 25.600, t: 'ここはゲン族の土地だったのか' },
      { s: 25.600, e: 27.700, t: 'すまない。ある人を探していただけだ' },
      { s: 27.700, e: 29.267, t: '俺はカンガク国、吹奏楽騎士団大将' },
      { s: 29.533, e: 30.400, t: 'アルト・サクソフォーン' },
      { s: 30.467, e: 33.067, t: '我々に協力しないとこの国も滅びるぞ' },
      { s: 33.067, e: 34.000, t: 'どんな理由があろうと' },
      { s: 34.000, e: 35.567, t: '我らゲン族は戦争には協力しません' },
      { s: 35.567, e: 37.000, t: 'お引き取り願おう' },
      { s: 37.000, e: 38.000, t: 'ならば仕方あるまい' },
      { s: 38.000, e: 40.367, t: '誰も傷つけずにどうやって世界を支配しようというの！' },
      { s: 40.400, e: 42.100, t: 'ダガク国、カンガク国' },
      { s: 42.100, e: 44.000, t: '次はここが襲われるんだぞ！' },
      { s: 44.267, e: 46.267, t: 'おんぷ橋を渡り、そこに住んでいる' },
      { s: 46.267, e: 48.167, t: 'マスタータクトという老人に会いなさい。' },
      { s: 48.167, e: 49.700, t: '必ず知恵を与えてくれるはず' },
      { s: 50.300, e: 52.100, t: 'あなたのことは嫌いだけど...' },
      { s: 52.200, e: 54.400, t: '...家族と私の民を救うためにも' },
      { s: 54.433, e: 56.000, t: '行け！みんなのもの！' },
      { s: 57.033, e: 58.700, t: '音色が違う異種族同士では' },
      { s: 58.700, e: 60.567, t: '美しい音楽を奏でることなど' },
      { s: 61.133, e: 62.700, t: '到底無理なのだ' },
      { s: 66.167, e: 67.500, t: 'ダ族の民だ' },
      { s: 67.667, e: 70.033, t: '関わるとろくなことがないぞ' },
      { s: 77.033, e: 80.700, t: 'なんとも美しいハーモニーじゃったわい！' },
      { s: 80.700, e: 83.567, t: 'あ、邪魔しちゃったかのう、続けて！続けて！' },
      { s: 83.567, e: 86.733, t: 'この譜面を演奏できるように修行しなさい' },
      { s: 86.733, e: 89.067, t: 'シンフォニー・オブ・ワンワールド' },
      { s: 91.533, e: 93.600, t: '今のメロディーは私が主役でしょ！？' },
      { s: 93.600, e: 95.200, t: 'は？流れを引っ張ってたのは俺だろ！' },
      { s: 95.200, e: 96.067, t: 'ですよね！？' },
      { s: 99.200, e:100.667, t: '勝手に走り出しやがって！' },
      { s:101.033, e:102.133, t: 'バカヤロー！！' },
      { s:106.333, e:108.400, t: '異なる音色が重なり合うとき' },
      { s:108.567, e:110.233, t: '新たなハーモニーが生まれる' },
      { s:110.733, e:115.600, t: '果たしてバイオリン姫は世界を救うことができるのか' },
      { s:116.267, e:117.667, t: 'スタッカート！！' },
      { s:117.667, e:119.433, t: 'おいばか！やめろ！' },
      { s:119.433, e:121.767, t: 'これで借り一つ返したから！あと一つね！' },
      { s:121.767, e:123.467, t: 'いや！もう返さなくていい！！' },
      { s:126.767, e:128.467, t: 'ミュージックワールド' },
      { s:128.633, e:131.567, t: 'バイオリン姫と魔法のシンフォニー' },
    ],
    en: [
      { s:  4.667, e:  9.367, t: 'Once upon a time, there were four kingdoms that communicated through music.' },
      { s:  9.367, e: 12.033, t: 'The wind instrument kingdom — Kangaku' },
      { s: 12.033, e: 14.300, t: 'The percussion kingdom — Dagaku' },
      { s: 14.300, e: 16.700, t: 'The keyboard kingdom — Kenbangaku' },
      { s: 16.700, e: 20.200, t: 'And the string instrument kingdom — Gengaku' },
      { s: 20.200, e: 24.000, t: 'Each nurtured its own culture and sound, living in peace.' },
      { s: 24.000, e: 25.600, t: 'So this was Geng clan territory.' },
      { s: 25.600, e: 27.700, t: 'My apologies. I was only searching for someone.' },
      { s: 27.700, e: 29.267, t: 'I am the Grand Commander of the Wind Knight Order of Kangaku—' },
      { s: 29.533, e: 30.400, t: 'Alto Saxophone.' },
      { s: 30.467, e: 33.067, t: 'Cooperate with us, or this kingdom will fall.' },
      { s: 33.067, e: 34.000, t: 'No matter the reason—' },
      { s: 34.000, e: 35.567, t: 'We of the Geng clan will not take part in war.' },
      { s: 35.567, e: 37.000, t: 'I must ask you to leave.' },
      { s: 37.000, e: 38.000, t: 'Then so be it.' },
      { s: 38.000, e: 40.367, t: 'How do you intend to rule the world without hurting anyone?!' },
      { s: 40.400, e: 42.100, t: 'Dagaku, Kangaku—' },
      { s: 42.100, e: 44.000, t: 'This place will be next!' },
      { s: 44.267, e: 46.267, t: 'Cross the Onpu Bridge and find the elder who lives there—' },
      { s: 46.267, e: 48.167, t: 'An old man named Master Tact.' },
      { s: 48.167, e: 49.700, t: 'He will surely grant you wisdom.' },
      { s: 50.300, e: 52.100, t: "I don't like you, but..." },
      { s: 52.200, e: 54.400, t: '...to save my family and my people—' },
      { s: 54.433, e: 56.000, t: 'Go! All of you!' },
      { s: 57.033, e: 58.700, t: 'For beings of different tones—' },
      { s: 58.700, e: 60.567, t: 'To perform beautiful music together...' },
      { s: 61.133, e: 62.700, t: 'Is simply impossible.' },
      { s: 66.167, e: 67.500, t: 'A member of the Dah clan.' },
      { s: 67.667, e: 70.033, t: 'Getting involved will only bring trouble.' },
      { s: 77.033, e: 80.700, t: 'What a beautiful harmony!' },
      { s: 80.700, e: 83.567, t: 'Oh, have I interrupted? Please continue! Continue!' },
      { s: 83.567, e: 86.733, t: 'Train until you can perform this score.' },
      { s: 86.733, e: 89.067, t: 'Symphony of One World' },
      { s: 91.533, e: 93.600, t: 'That melody just now — I was the lead, right?!' },
      { s: 93.600, e: 95.200, t: "What? I was carrying the whole flow!" },
      { s: 95.200, e: 96.067, t: 'Right?!' },
      { s: 99.200, e:100.667, t: 'You went off on your own!' },
      { s:101.033, e:102.133, t: 'You idiot!!' },
      { s:106.333, e:108.400, t: 'When different sounds come together—' },
      { s:108.567, e:110.233, t: 'A new harmony is born.' },
      { s:110.733, e:115.600, t: 'Can Violin Princess save the world?' },
      { s:116.267, e:117.667, t: 'Staccato!!' },
      { s:117.667, e:119.433, t: 'Hey, you fool! Stop!' },
      { s:119.433, e:121.767, t: "Now we're even — one debt paid! One more to go!" },
      { s:121.767, e:123.467, t: "No! You don't have to pay it back!!" },
      { s:126.767, e:128.467, t: 'Music World' },
      { s:128.633, e:131.567, t: 'Violin Princess and the Magic Symphony' },
    ],
    zh: [
      { s:  4.667, e:  9.367, t: '从前，有四个用音乐交流的王国。' },
      { s:  9.367, e: 12.033, t: '管乐器王国——管乐国' },
      { s: 12.033, e: 14.300, t: '打击乐器王国——打乐国' },
      { s: 14.300, e: 16.700, t: '键盘乐器王国——键盘乐国' },
      { s: 16.700, e: 20.200, t: '还有弦乐器王国——弦乐国' },
      { s: 20.200, e: 24.000, t: '各国孕育着独特的音色与文化，和平共处。' },
      { s: 24.000, e: 25.600, t: '原来这是弦族的领地。' },
      { s: 25.600, e: 27.700, t: '抱歉，我只是在寻找一个人。' },
      { s: 27.700, e: 29.267, t: '我是管乐国吹奏骑士团大将——' },
      { s: 29.533, e: 30.400, t: '中音萨克斯风。' },
      { s: 30.467, e: 33.067, t: '若不合作，这个国家也将灭亡。' },
      { s: 33.067, e: 34.000, t: '不管什么理由——' },
      { s: 34.000, e: 35.567, t: '我们弦族不参与战争。' },
      { s: 35.567, e: 37.000, t: '请你离开。' },
      { s: 37.000, e: 38.000, t: '那就没办法了。' },
      { s: 38.000, e: 40.367, t: '你打算不伤害任何人就统治世界？！' },
      { s: 40.400, e: 42.100, t: '打乐国、管乐国——' },
      { s: 42.100, e: 44.000, t: '下一个就是这里了！' },
      { s: 44.267, e: 46.267, t: '渡过音符桥，去拜访那里住的——' },
      { s: 46.267, e: 48.167, t: '一位叫做塔克特大师的老人。' },
      { s: 48.167, e: 49.700, t: '他一定会赐予你智慧。' },
      { s: 50.300, e: 52.100, t: '我不喜欢你，但是……' },
      { s: 52.200, e: 54.400, t: '……为了我的家人和族人——' },
      { s: 54.433, e: 56.000, t: '去吧！大家一起！' },
      { s: 57.033, e: 58.700, t: '不同音色的异族之间——' },
      { s: 58.700, e: 60.567, t: '想要演奏出美丽的音乐……' },
      { s: 61.133, e: 62.700, t: '根本是不可能的事。' },
      { s: 66.167, e: 67.500, t: '是打族的人。' },
      { s: 67.667, e: 70.033, t: '跟他们扯上关系只会惹麻烦。' },
      { s: 77.033, e: 80.700, t: '真是美妙的和声！' },
      { s: 80.700, e: 83.567, t: '啊，我打扰了吗？请继续！继续！' },
      { s: 83.567, e: 86.733, t: '修行直到你能演奏这份乐谱。' },
      { s: 86.733, e: 89.067, t: '一个世界的交响乐' },
      { s: 91.533, e: 93.600, t: '刚才的旋律我才是主角吧！？' },
      { s: 93.600, e: 95.200, t: '什么？引领旋律走向的是我！' },
      { s: 95.200, e: 96.067, t: '对吧！？' },
      { s: 99.200, e:100.667, t: '你擅自冲出去！' },
      { s:101.033, e:102.133, t: '笨蛋！！' },
      { s:106.333, e:108.400, t: '当不同的音色交汇——' },
      { s:108.567, e:110.233, t: '新的和声便诞生了。' },
      { s:110.733, e:115.600, t: '小提琴公主究竟能否拯救世界？' },
      { s:116.267, e:117.667, t: '断奏！！' },
      { s:117.667, e:119.433, t: '喂，蠢货！停下！' },
      { s:119.433, e:121.767, t: '这样我就还了一个人情！还剩一个！' },
      { s:121.767, e:123.467, t: '不！不用还了！！' },
      { s:126.767, e:128.467, t: '音乐世界' },
      { s:128.633, e:131.567, t: '小提琴公主与魔法交响乐' },
    ],
  };
  const _ovcSubEl    = document.getElementById('opening-subtitle');
  const _ovcTelopEl  = document.getElementById('opening-subtitle-telop');
  const _ovcCCBtn    = document.getElementById('ovc-cc-btn');
  let _ovcLastMain   = null;
  let _ovcLastTelop  = null;
  // CC button: popup menu
  _initCCMenu('ovc-cc-btn', 'ovc-cc-menu', lang => {
    if (lang === 'off') {
      if (_ovcSubEl)   _ovcSubEl.classList.remove('visible');
      if (_ovcTelopEl) _ovcTelopEl.classList.remove('visible');
    }
    _ovcLastMain = null; _ovcLastTelop = null;
  });

  // タップで一時停止／再開
  video.addEventListener('click', () => {
    if (video.paused) { video.play().catch(() => {}); }
    else { video.pause(); }
  });

  video.addEventListener('timeupdate', () => {
    if (!video.duration || isNaN(video.duration)) return;
    const pct = (video.currentTime / video.duration) * 100;
    seekBar.value = pct;
    ovcSeekFill(pct);
    currentEl.textContent = ovcFmt(video.currentTime);

    // 字幕同期 — テロップとセリフは完全独立
    const subLang   = _getSubLang();
    const telopSubs = (subLang !== 'off' && subLang !== 'ja') ? (_OVC_SUBS[subLang]      || []) : [];
    const mainSubs  = subLang !== 'off'                       ? (_OVC_SUBS_MAIN[subLang] || []) : [];
    const t = video.currentTime;

    // テロップ（キャラ名・クレジット）― 指定位置に独立表示
    if (_ovcTelopEl) {
      let ti = -1;
      for (let i = 0; i < telopSubs.length; i++) {
        if (t >= telopSubs[i].s && t <= telopSubs[i].e) ti = i;
      }
      if (ti !== _ovcLastTelop) {
        _ovcLastTelop = ti;
        if (ti < 0) {
          _ovcTelopEl.classList.remove('visible');
        } else {
          _applyTelopPos(_ovcTelopEl, telopSubs[ti]);
          _ovcTelopEl.innerHTML = telopSubs[ti].t.replace(/\n/g, '<br>');
          _ovcTelopEl.classList.add('visible');
        }
      }
    }

    // セリフ字幕 ― 常に下中央
    if (_ovcSubEl) {
      let mi = -1;
      for (let i = 0; i < mainSubs.length; i++) {
        if (t >= mainSubs[i].s && t <= mainSubs[i].e) mi = i;
      }
      if (mi !== _ovcLastMain) {
        _ovcLastMain = mi;
        if (mi < 0) {
          _ovcSubEl.classList.remove('visible');
        } else {
          _ovcSubEl.innerHTML = mainSubs[mi].t.replace(/\n/g, '<br>');
          _ovcSubEl.classList.add('visible');
        }
      }
    }
  });
  video.addEventListener('loadedmetadata', () => {
    durationEl.textContent = ovcFmt(video.duration);
  });

  // シーク
  seekBar.addEventListener('input', () => {
    if (!video.duration) return;
    currentEl.textContent = ovcFmt((parseFloat(seekBar.value) / 100) * video.duration);
    ovcSeekFill(parseFloat(seekBar.value));
  });
  seekBar.addEventListener('change', () => {
    if (!video.duration) return;
    video.currentTime = (parseFloat(seekBar.value) / 100) * video.duration;
  });

  // 音量スライダー
  volSlider.addEventListener('input', () => {
    const v = parseFloat(volSlider.value);
    video.volume = v;
    video.muted  = v === 0;
    muteBtn.textContent = v === 0 ? '🔇' : v < 0.4 ? '🔉' : '🔊';
    ovcVolFill(v);
  });
  ovcVolFill(1); // 初期フィル

  // ミュートボタン
  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    muteBtn.textContent = video.muted ? '🔇' : (video.volume < 0.4 ? '🔉' : '🔊');
    if (!video.muted && parseFloat(volSlider.value) === 0) {
      volSlider.value = '0.7';
      video.volume = 0.7;
      ovcVolFill(0.7);
    }
  });

  /* ══ オープニングモーダルを表示 ══ */
  requestAnimationFrame(() => requestAnimationFrame(() => {
    modal.removeAttribute('aria-hidden');
    modal.classList.add('is-visible');
  }));

  /* ══ モーダルを閉じる ══ */
  function closeModal(cb) {
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
    setTimeout(() => { modal.remove(); if (cb) cb(); }, 500);
  }

  /* ══ 動画オーバーレイを閉じる ══ */
  function closeVideoOverlay(cb) {
    unlockScroll();           // スクロールロック解除
    unbindTimelineActivity(); // タイムライン自動非表示も解除
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
    video.pause();
    setTimeout(() => {
      video.removeAttribute('src');
      video.load();
      overlay.remove();
      if (cb) cb();
    }, 450);
  }

  /* ══ BGM確認モーダルを表示 ══ */
  function showBGMChoice() {
    showMusicConsentDialog((agreed) => {
      if (window._bgmStartIfAgreed) window._bgmStartIfAgreed(agreed);
    });
  }

  /* ══ 動画終了 → 音符パーティクル → BGM確認 ══ */
  function finishVideo() {
    document.removeEventListener('keydown', onEsc);
    playNoteParticles(() => {
      closeVideoOverlay(() => setTimeout(showBGMChoice, 200));
    });
  }

  /* ══ Esc キー ══ */
  function onEsc(e) {
    if (e.key !== 'Escape') return;
    if (overlay.classList.contains('is-visible')) {
      document.removeEventListener('keydown', onEsc);
      closeVideoOverlay(() => setTimeout(showBGMChoice, 200));
    }
  }
  document.addEventListener('keydown', onEsc);

  /* ══ 「オープニングを見る」ボタン ══ */
  btnWatch.addEventListener('click', () => {
    closeModal(() => {
      overlay.removeAttribute('aria-hidden');
      overlay.classList.add('is-visible');
      lockScroll(); // 動画再生中はスクロール禁止
      bindTimelineActivity();
      showTimeline(); // 最初は表示しておく
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    });
  });

  /* ══ 「いますぐ物語へ」ボタン ══ */
  btnSkip.addEventListener('click', () => {
    closeModal(() => setTimeout(showBGMChoice, 200));
  });

  /* ══ 動画スキップボタン（右上）★ フラッシュなしで即クローズ ══ */
  btnVSkip.addEventListener('click', () => {
    document.removeEventListener('keydown', onEsc);
    closeVideoOverlay(() => setTimeout(showBGMChoice, 200));
  });

  /* ══ 動画終了 → フラッシュ演出 ══ */
  video.addEventListener('ended', finishVideo);
}
