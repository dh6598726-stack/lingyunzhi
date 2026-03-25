// Vercel Serverless Function: 实时新闻抓取器
export default async function handler(req, res) {
  try {
    // 这里我们抓取开源中国 (OSChina) 的最新资讯作为演示
    const RSS_URL = "https://www.oschina.net/news/rss";
    const API_CONVERTER = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

    const response = await fetch(API_CONVERTER);
    const data = await response.json();

    // 严谨处理：如果抓取失败则返回提示
    if (!data.items) throw new Error("无法获取内容");

    // 仅保留最关键的 8 条新闻，减少传输体积
    const news = data.items.slice(0, 8).map(item => ({
      title: item.title,
      link: item.link,
      date: item.pubDate.split(' ')[0] // 只要日期部分
    }));

    // 设置跨域头，确保你的网页可以安全调用
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ error: "抓取失败: " + error.message });
  }
}