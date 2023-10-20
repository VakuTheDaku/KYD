import { fetchNews } from '@/utils/news';

const OpenAI = require('openai');

export default async (req, res) => {
    if (req.method === 'GET') {
        try {
            // Replace 'YOUR_API_KEY' with your actual OpenAI API key
            const apiKey = process.env.OPENAI_API_KEY;

            const openai = new OpenAI({ key: apiKey });

            // Retrieve the news articles from the request body
            const news = await fetchNews(2)
            const articles = [];
            news.slice(0, 20).forEach(article => {
                articles.push(article.title)
            });
            
            const response = await openai.completions.create({
                'model': "text-davinci-003",
                'prompt': `${articles.join('\n')} Analyse these articles and according to the news, prepare a reputation chart for GMX, coinbase, binance and DYDX.`,
                'max_tokens': 400,
            });

            const insights = response.choices[0].text;
        
            res.status(200).json({ success: true, insights });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'An error occurred' });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
};
