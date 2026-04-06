/**
 * ミュージックワールド — Stripe Webhook レシーバー
 * Google Apps Script にそのまま貼り付けて使う
 *
 * 機能:
 *   1. Stripe の checkout.session.completed を受信
 *   2. info@arsdavinci.com に購入通知メールを送信
 *   3. "supporters-all" シートに購入データを記録
 *
 * セットアップ手順（下の README を参照）
 */

// ════════════════════════════════════════════════════════
// ★ ここだけ自分の値に書き換える
// ════════════════════════════════════════════════════════
const NOTIFY_EMAIL     = 'info@arsdavinci.com';       // 通知先メール
const SHEET_NAME       = 'supporters-all';             // シート名
const SPREADSHEET_ID   = 'YOUR_SPREADSHEET_ID_HERE';  // ★スプレッドシートのID
const STRIPE_WEBHOOK_SECRET = '';                      // ★Stripe Webhook署名シークレット（任意・後で設定可）

// プラン表示名マッピング
const PLAN_LABELS = {
  supporter:       'Supporter（3,000円）',
  story_supporter: 'Story Supporter（10,000円）',
  executive:       'Executive Supporter（30,000円）',
  producer:        'Producer（100,000円）',
};

const CHAR_LABELS = {
  violin_princess: 'バイオリン姫',
  harp_queen:      'ハープ女王',
  viola_prince:    'ヴィオラ王子',
  piano_prince:    'ピアノ王子',
  sax_knight:      'サックス',
  clarinet_princess: 'クラリネット姫',
  master_tact:     'マスタークト',
  castanet:        'カスタネット',
  cello_butler:    'チェロ執事',
  captain_guitar:  'キャプテンギター（レア！）',
};

// ════════════════════════════════════════════════════════
// Webhook エントリーポイント（GAS Web App の doPost）
// ════════════════════════════════════════════════════════
function doPost(e) {
  try {
    const body    = e.postData.contents;
    const payload = JSON.parse(body);

    // checkout.session.completed 以外は無視
    if (payload.type !== 'checkout.session.completed') {
      return ok('ignored');
    }

    const session = payload.data.object;

    // ── データ取得 ──
    const email   = (session.customer_details && session.customer_details.email) || '';
    const name    = (session.customer_details && session.customer_details.name)  || '';
    const addr    = session.customer_details && session.customer_details.address;
    const address = addr
      ? [addr.line1, addr.line2, addr.city, addr.state, addr.postal_code, addr.country]
          .filter(Boolean).join(' ')
      : '';

    const amountYen = Math.round((session.amount_total || 0) / 1);  // Stripeは円=1単位
    const sessionId = session.id || '';
    const createdAt = new Date((session.created || Date.now() / 1000) * 1000);
    const jst       = Utilities.formatDate(createdAt, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');

    // client_reference_id をデコード（plan|char|nick|display|anon|message）
    const refFields = decodeRefId(session.client_reference_id || '');
    const plan        = refFields[0] || '';
    const character   = refFields[1] || '';
    const nickname    = refFields[2] || '';
    const displayName = refFields[3] || '';
    const anonymous   = refFields[4] === '1' ? '匿名希望' : '掲載可';
    const message     = refFields[5] || '';

    const planLabel = PLAN_LABELS[plan]   || plan;
    const charLabel = CHAR_LABELS[character] || character;

    // ── 1. 通知メール送信 ──
    sendNotification({
      jst, email, name, address, amountYen,
      plan: planLabel, character: charLabel,
      nickname, displayName, anonymous, message, sessionId
    });

    // ── 2. Googleシートに記録 ──
    appendToSheet({
      jst, email, name, address, amountYen,
      plan: planLabel, character: charLabel,
      nickname, displayName, anonymous, message, sessionId
    });

    return ok('processed');

  } catch(err) {
    Logger.log('Error: ' + err.message);
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ════════════════════════════════════════════════════════
// 通知メール送信
// ════════════════════════════════════════════════════════
function sendNotification(d) {
  const subject = `【MW購入通知】${d.plan} — ${d.name || d.email}`;
  const body = [
    `日時: ${d.jst}`,
    `プラン: ${d.plan}  /  ¥${d.amountYen.toLocaleString()}`,
    '',
    '█ 支援者情報',
    `メール: ${d.email}`,
    `氏名: ${d.name || '（未記入）'}`,
    `ニックネーム: ${d.nickname || '（未記入）'}`,
    `掲載名: ${d.displayName || '（未記入）'}`,
    `匿名: ${d.anonymous === '匿名希望' ? '匿名希望 (1)' : '掲載可 (0=掲載希望 / 1=匿名)'}`,
    `キャラクター: ${d.character}`,
    `ひとこと: ${d.message || '（なし）'}`,
    '',
    '█ 対応内容',
    `☐ 住所確認メールを送付（ぬいぐるみ・直筆サインカード発送のため）`,
    `   住所: ${d.address || '※Stripeダッシュボードで確認 → https://dashboard.stripe.com/payments'}`,
    `☐ 匿名=0の場合 → supporters_publicシートに掲載名を記入`,
    '',
    `Stripe ID: ${d.sessionId}`,
  ].join('\n');

  GmailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}

// ════════════════════════════════════════════════════════
// Googleシートに追記
// ════════════════════════════════════════════════════════
function appendToSheet(d) {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  let   sheet = ss.getSheetByName(SHEET_NAME);

  // シートがなければ作成＋ヘッダー追加
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      '購入日時', 'プラン', '金額', '氏名', 'メール', '住所',
      'キャラクター', 'ニックネーム', '掲載名', '掲載', 'ひとこと', 'Stripe ID'
    ]);
    sheet.getRange(1, 1, 1, 12).setFontWeight('bold');
  }

  sheet.appendRow([
    d.jst, d.plan, d.amountYen, d.name, d.email, d.address,
    d.character, d.nickname, d.displayName, d.anonymous, d.message, d.sessionId
  ]);
}

// ════════════════════════════════════════════════════════
// ユーティリティ
// ════════════════════════════════════════════════════════
function decodeRefId(encoded) {
  if (!encoded) return [];
  try {
    // URL-safe base64 → 通常base64 → デコード
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padded  = base64 + '==='.slice((base64.length + 3) % 4);
    const decoded = Utilities.newBlob(Utilities.base64Decode(padded)).getDataAsString('UTF-8');
    return decoded.split('|');
  } catch(e) {
    return [];
  }
}

function ok(msg) {
  return ContentService.createTextOutput(JSON.stringify({ status: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ════════════════════════════════════════════════════════
 * README — セットアップ手順
 * ════════════════════════════════════════════════════════
 *
 * 1. https://script.google.com を開く
 * 2. 「新しいプロジェクト」を作成
 * 3. このファイルの内容を貼り付ける
 * 4. SPREADSHEET_ID を自分のスプレッドシートIDに書き換える
 *    （スプレッドシートのURLの /d/XXXXXXX/ の部分）
 * 5. 右上「デプロイ」→「新しいデプロイ」
 *    - 種類: ウェブアプリ
 *    - 実行ユーザー: 自分
 *    - アクセスできるユーザー: 全員
 *    → 「デプロイ」→ 表示されたURLをコピー
 * 6. Stripeダッシュボード → Developers → Webhooks → 「エンドポイントを追加」
 *    - URL: コピーしたGAS URL
 *    - イベント: checkout.session.completed を選択
 *    → 保存後、「署名シークレット」をコピーして STRIPE_WEBHOOK_SECRET に貼る
 *    → GASを再デプロイ
 *
 * 以上で完了。購入のたびにメール通知＋シート記録が動きます。
 * ════════════════════════════════════════════════════════
 */
