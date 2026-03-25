export default async function handler(req, res) {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const RSS_URL = "https://www.oschina.net/news/rss";
    const API_CONVERTER = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;
    
    const response = await fetch(API_CONVERTER);
    const data = await response.json();

    if (!data || !data.items) {
        throw new Error("抓取目标源被限流");
    }

    const news = data.items.slice(0, 6).map(item => ({
      title: item.title,
      link: item.link,
      date: item.pubDate.split(' ')[0]
    }));

    res.status(200).json(news);
  } catch (error) {
    // 【终极容错】：如果外部新闻源挂了，直接返回备用数据，证明咱们自己的 Vercel 没挂！
    res.status(200).json([
      { title: "✅ Vercel 动态接口已成功连通！", link: "#", date: "刚刚" },
      { title: "⚠️ 当前外部新闻源 (rss2json) 响应超时，请稍后再试。", link: "#", date: "刚刚" },
      { title: "💡 建议：您可以随时在 api/get-news.js 中更换更稳定的新闻接口", link: "#", date: "刚刚" }
    ]);
  }
}