// これらは重要であり、先頭に記述する必要があります
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { join } from 'path';

// 本番用のとり高速なSSR（開発用では必要なし）
enableProdMode();
// Expressサーバー
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

// NOTE:このファイルはwebpackから動的に生成されるため、require()のままにしておきます
const { AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./dist/server/main');

// Expressエンジン
import { ngExpressEngine } from '@nguniversal/express-engine';
// 遅延読み込み用モジュールマップをインポート
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [ provideModuleMap(LAZY_MODULE_MAP) ]
}));

// TODO: データのリクエストをセキュアに実装する
app.get('/api/*', (req, res) => {
  res.status(404).send('data requests are not supporded');
});

//ブランザーからの静的なサーバーファイル
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

// すべての通常ルートはUniversalエンジンを使用します
app.get('*', (req, res) => {
  res.render('index', { req })
});

//Nodeサーバーの立ち上げ
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost/${PORT}`)
})
