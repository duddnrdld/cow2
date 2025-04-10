import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

export default async function handler(req, res) {
  try {
    const response = await fetch('https://fortune.nate.com/contents/freeunse/freeunseframe.nate?freeUnseId=today03', {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const items = doc.querySelectorAll('.todayView .item');
    let result = '운세를 찾을 수 없습니다.';

    items.forEach(item => {
      const title = item.querySelector('strong.tit')?.textContent;
      const desc = item.querySelector('.txt')?.textContent;
      if (title && title.includes('소띠')) {
        result = desc.trim();
      }
    });

    res.status(200).json({ fortune: result, sign: '소띠' });
  } catch (err) {
    res.status(500).json({ error: '크롤링 실패', detail: err.toString() });
  }
}
