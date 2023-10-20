import { fetchNews } from "@/utils/news";

export default async function handler(
    req,
    res
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed!' });
    }

    try {
        //2 days news
        const news = await fetchNews(2)

        return res.status(200).json({ success: true, news: news });

    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message })
    }

}
