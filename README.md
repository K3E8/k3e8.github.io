# K3E8 Apps — 個人開発アプリの紹介サイト

静的なHTML/CSS/JSのみで構成。ビルド不要、GitHub Pagesにそのまま置けます。

## 公開手順(GitHub Pages)

1. GitHubで `<ユーザー名>.github.io` という名前のPublicリポジトリを作成
2. このフォルダの中身をpush
3. 数分後に `https://<ユーザー名>.github.io/` で公開される

## 公開前に置き換えるもの

- [x] サイトURL: `https://k3e8.github.io/` で確定(GitHubユーザー名をK3E8に変更)
- [x] GitHubリンク: `https://github.com/K3E8` に設定済み
- [ ] メールアドレス(Contactの `data-u` / `data-d` 属性)。公開用に専用アドレスを作るのも推奨

## 更新のしかた

- **アプリを追加**: 「つくったもの」の `.app-card` をコピーして編集。PICKUPに載せるなら `.pickup-card` を複製
- **お知らせを追加**: `.news-list` の先頭に `<li><time datetime="YYYY-MM-DD">YYYY.MM.DD</time><p>本文</p></li>` を追加
- **PICKUPの動くデモ**: HTML/CSSのみで実装(index.htmlの `.phone-demo` + style.cssの「チャット画面デモ」)。会話内容はHTMLの吹き出しテキストを編集、タイミングはCSSの `pd-m1〜m4` キーフレームで調整。実録画に差し替える場合は `.phone-demo` を `<video autoplay muted loop playsinline>` に置き換え

## 機能メモ

- ライト/ダークテーマ: OS設定に自動追従、ヘッダーのボタンで手動切替(localStorageに保存)
- Smart App Banner: iOSのSafariで開くとApp Store誘導バナーが自動表示(`apple-itunes-app` meta)
- QRコード: PICKUPカードの「QRコードで開く」。PCで見ている人向けのDL導線
- SEO: OGP / Twitterカード / JSON-LD / sitemap.xml / robots.txt 設定済み
- メールアドレスはボット対策のためJSで組み立て(HTMLに生アドレスを書かない)
