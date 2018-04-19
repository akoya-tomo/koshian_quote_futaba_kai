## KOSHIAN 引用メニュー 改
このFirefoxアドオンはふたば☆ちゃんねるでコンテキストメニューに引用メニューを追加する[Pachira](https://addons.mozilla.org/ja/firefox/user/anonymous-a0bba9187b568f98732d22d51c5955a6/)氏の[KOSHIAN 引用メニュー](https://addons.mozilla.org/ja/firefox/addon/koshian-quote-futaba/)アドオンを改変したものです。  
「画像ファイル名を引用する」オプションと「本文無しのときレスNo.を引用する」オプションをオリジナル版に追加しています。  

※このアドオンはWebExtensionアドオン対応のFirefox専用となります。  
※他のこしあんアドオン改変版やUserscriptは[こちら](https://github.com/akoya-tomo/futaba_auto_reloader_K/wiki/)の一覧からどうぞ。  

## 機能
* オリジナルの機能（KOSHIAN 引用メニュー）
  - ふたば☆ちゃんねるのレス送信モード画面でコンテキストメニューからレス本文を返信フォームへ引用できるようにします。
* 追加された機能（KOSHIAN 引用メニュー 改）
  - 「画像ファイル名を引用する」オプション（デフォルト：無効）  
    画像ファイルのリンクまたはサムネの上で右クリックすると画像ファイル名を引用できます。
  - 「本文無しのときレスNo.を引用する」オプション（デフォルト：無効）  
    本文無し（ｷﾀ━━━(ﾟ∀ﾟ)━━━!!など含む）のときに右クリックするとレスNo.を引用できます。

## インストール
[GitHub](https://github.com/akoya-tomo/koshian_quote_futaba_kai/releases/download/v1.0.3/koshian_quote_futaba_kai-1.0.3-an.fx.xpi)  

※「接続エラーのため、アドオンをダウンロードできませんでした。」と表示されてインストール出来ない時はリンクを右クリックしてxpiファイルをダウンロードし、メニューのツール→アドオン（またはCtrl+Shift+A）で表示されたアドオンマネージャーのページにxpiファイルをドラッグ＆ドロップして下さい。  

## 追加機能の補足
* 本文無しと判定されてもレスの文字列を選択して右クリックすると選択文字列が優先されます。
* WebMのサムネの上で右クリックすると映像が再生されます。  
  再生したくないときはWebMファイルのリンクの上で右クリックしてください。  

## 注意事項
* このアドオンはWebExtensionアドオン対応のFirefox専用です。  
* 本アドオンを有効化したときはオリジナル版を無効化または削除して下さい。  
* オリジナル版とは別アドオンなので設定は初期値に戻ります。  
  再度設定をお願い致します。  
* 変更したオプションの設定がスレ画面で反映されない時は一度スレをリロードしてください。  

## 更新履歴
* v1.0.3 2018-04-19
  - 引用ポップアップしたレスの本文以外の部分を右クリックして引用すると本文以外まで引用される不具合を修正
* v1.0.2 2018-03-31
  - アドオンの自動更新を有効化
* v1.0.1 2018-01-23
  - 本文無しの判定を修正
* v1.0.0 2017-12-20
  - KOSHIAN 引用メニュー v2.0.0ベース
  - 「画像ファイル名を引用する」オプションを追加
  - 「本文無しのときレスNo.を引用する」オプションを追加
