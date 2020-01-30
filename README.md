## <sub><img src="koshian_quote_futaba/icons/icon-48.png"></sub> KOSHIAN 引用メニュー 改
このFirefoxアドオンはふたば☆ちゃんねるでコンテキストメニューに引用メニューを追加する[Pachira](https://addons.mozilla.org/ja/firefox/user/anonymous-a0bba9187b568f98732d22d51c5955a6/)氏の[KOSHIAN 引用メニュー](https://addons.mozilla.org/ja/firefox/addon/koshian-quote-futaba/)の非公式改変版です。  
引用ボタンで引用したり、ID･IP・レスNo.や画像ファイル名を引用する機能をオリジナル版に追加しています。  

※このアドオンはWebExtensionアドオン対応のFirefox専用となります。  
※他のKOSHIAN改変版などのふたば支援ツール一覧は[こちら](https://github.com/akoya-tomo/futaba_auto_reloader_K/wiki/)。  

## 機能
* オリジナルの機能（KOSHIAN 引用メニュー）
  - コンテキストメニューに引用メニューを追加し、メニューからレス本文の引用やコピーができます。  
* 追加された機能（KOSHIAN 引用メニュー 改）
  - ![\(New\)](images/new.png "New") 「引用メニューを使用する」オプション（デフォルト：有効）  
    右クリックで引用メニューを表示します。  
  - ![\(New\)](images/new.png "New") 「引用ボタンを付ける」オプション（デフォルト：無効）  
    記事番号の横に引用ボタン「＞」を付けます。引用ボタンをクリックでレス文章を引用することができます。  
  - 「画像ファイル名を引用する」オプション（デフォルト：無効）  
    画像ファイルのリンクまたはサムネの上で右クリックすると画像ファイル名を引用できます。  
  - 「本文無しのときレスNo.を引用する」オプション（デフォルト：無効）  
    本文無し（ｷﾀ━━━(ﾟ∀ﾟ)━━━!!など含む）のときにレスNo.を引用できます。  
  - 「"ID･IP"を表示」オプション（デフォルト：無効）  
    引用メニューに"ID･IP"を追加します。IDやIPを引用することができます。  
    IDカウンター[（WebExtensions版）](http://toshiakisp.github.io/akahuku-firefox-sp/#others)・[（userscript版）](https://github.com/toshiakisp/idcounter-userscript/)または[futaba ID+IP popup](https://greasyfork.org/ja/scripts/8189-futaba-id-ip-popup/)との併用も可能です。  
  - 「"No."を表示」オプション（デフォルト：無効）  
    引用メニューに"No."を追加します。レスNo.を引用することができます。  
  - 「非引用部分のみ引用する」オプション（デフォルト：無効）  
    レス文章の引用されていない部分のみを引用することができます。  
  - 「引用符と文章の間の空白を削除」オプション（デフォルト：有効）  
    引用したときに引用符と文章の間に空白が挿入されたり、引用符だけの行が挿入されることがある環境で不要な挿入を抑止します。  

## インストール
**GitHub**  
[![インストールボタン](images/install_button.png "クリックでアドオンをインストール")](https://github.com/akoya-tomo/koshian_quote_futaba_kai/releases/download/v1.8.0/koshian_quote_futaba_kai-1.8.0-fx.xpi)  

※「接続エラーのため、アドオンをダウンロードできませんでした。」と表示されてインストール出来ない時はリンクを右クリックしてxpiファイルをダウンロードし、メニューのツール→アドオン（またはCtrl+Shift+A）で表示されたアドオンマネージャーのページにxpiファイルをドラッグ＆ドロップして下さい。  

## 追加機能の補足
* レス本文の文字列を選択して右クリックすると選択文字列が優先されて引用されます。
* 動画のサムネの上で右クリックすると動画が再生されます。  
  再生したくないときは動画ファイルのリンクの上で右クリックしてください。  
* 引用ボタンでは選択文字列の引用はできません。  
  選択文字列の引用はふたば標準の引用ポップアップボタンまたは右クリックの引用メニューをご利用ください。  

## 注意事項
* 本アドオンを有効にしたときはオリジナル版を無効にするか削除して下さい。  
* オリジナル版とは別アドオンなので設定は初期値に戻ります。  
  再度設定をお願い致します。  
* オプションの設定を変更したときは開いているスレを一度更新することで設定が反映されます。  
* [KOSHIAN 引用をポップアップで表示 改](https://github.com/akoya-tomo/koshian_popup_quote_kai/) **v1.6以上**と組み合わせてご使用ください。  

## 既知の不具合
* 引用したときに引用符と文章の間に空白が挿入されたり、引用符だけの行が挿入されることがある
  - 作者の環境で発生しないので原因不明ですが、応急対策として「引用符と文章の間の空白を削除」オプションを追加しました。  
    AAなどの意図的な先頭の空白も削除されるので、不具合が発生しない環境ではオプションを無効にしてください。  
    このオプションが有効でも不具合が発生するようでしたらご連絡ください。別の対策に変更します。  
* ~~[Gesturefy](https://addons.mozilla.org/ja/firefox/addon/gesturefy/)でホイールジェスチャーやロッカージェスチャーに右ボタンを割り当てしているとホイールジェスチャー・ロッカージェスチャー終了時に引用メニューが表示されることがある~~
  - v1.6.1で修正しました。  

## 更新履歴
* v1.8.0 2020-01-30
  - 「引用メニューを使用する」オプションを追加
  - 「No.をクリックで引用する」オプションを削除し、「引用ボタンを付ける」オプションを追加
* v1.7.2 2019-11-19
  - レスNo.のメニュー化によりID・IPが引用できない不具合を修正
* v1.7.1 2019-11-15
  - 改行だけの行を引用から除外するように修正
  - KOSHIAN 自動リンク生成（改）のプレビューボタンの引用からの除外処理を修正
  - コード整理
* v1.7.0 2019-11-13
  - レスNo.のメニュー化によりレスNo.が引用できない不具合を修正
  - レスNo.がメニュー化されているときは投稿時間をクリックで引用するように修正
* v1.6.2 2019-09-11
  - コピー操作でKOSHIAN 返信フォームを固定 改で閉じた返信フォームが開かない不具合を修正
* v1.6.1 2019-07-02
  - Gesturefyでホイール・ロッカージェスチャー終了時に引用メニューが表示されることがある不具合を修正
  - リロードの監視を修正
* v1.6.0 2019-05-09
  - ふたばのリロードの仕様変更に対応
* v1.5.0 2018-09-02
  - 「引用符と文章の間の空白を削除」オプションを追加
  - [KOSHIAN 自動リンク生成](https://addons.mozilla.org/ja/firefox/addon/koshian-autolink-futaba/)（[改](https://github.com/akoya-tomo/koshian_autolink_futaba_kai/)）の表示ボタンを引用しないように修正
  - 塩のプレビュー上でファイル名が正常に取得できない不具合を修正
  - 「No.をクリックで引用する」有効時のレスNo.の色を変更
* v1.4.0 2018-06-28
  - 引用ポップアップ内で「No.をクリックで引用する」が動作するように修正
  - 「No.をクリックで引用する」機能のボタン生成の高速化
* v1.3.0 2018-06-12
  - 「No.をクリックで引用する」オプション追加
  - 「非引用部分のみ引用する」オプション有効時に最後の1文字が引用されない不具合修正
* v1.2.0 2018-06-08
  - 「非引用部分のみ引用する」オプション追加
* v1.1.1 2018-05-08
  - 引用メニューの動作不具合修正
* v1.1.0 2018-05-08
  - 「"ID･IP"を表示」「"No."を表示」オプション追加
  - 引用ポップアップしたレスのレスNo.が引用できない不具合修正
  - 引用メニューの表示位置を微調整
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
