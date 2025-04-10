import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

export default async function handler(req, res) {
  const { sign = 'ox' } = req.query;

  const signMap = {
    rat: '쥐띠', ox: '소띠', tiger: '호랑이띠', rabbit: '토끼띠',
    dragon: '용띠', snake: '뱀띠', horse: '말띠', goat: '양띠',
    monkey: '원숭이띠', rooster: '닭띠', dog: '개띠', pig: '돼지띠'
  };

  const signKor = signMap[sign] || '소띠';

  try {
    const response = await fetch('https://search.naver.com/search.naver?where=m&sm=mtp_hty.top&query=띠별+운세', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const blocks = [...doc.querySelectorAll('div')].filter(el => el.textContent.includes(signKor));
    let result = blocks.length > 0 ? blocks[0].textContent.trim().split(signKor)[1]?.trim() : null;

    if (!result) result = '운세를 불러올 수 없습니다.';

    res.status(200).json({ fortune: result, sign: signKor });
  } catch (error) {
    res.status(500).json({ error: '서버 오류 발생', detail: error.toString() });
  }
}