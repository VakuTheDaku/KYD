import axios from "axios";

export const fetchNews = async (days) => {
    const today = new Date();
    const twoDaysBefore = new Date(today);
    twoDaysBefore.setDate(today.getDate() - days);
  
    const fromDate = twoDaysBefore.toISOString().slice(0, 10);
    const topics = ['exchanges', 'perpetual+exchanges', 'dydx', 'gmx', 'cat+exchanges', 'ftx'];
    const topicsQueryString = topics.join(' OR ');
    const url = `https://newsapi.org/v2/everything?q=${topicsQueryString}&from=${fromDate}&sortBy=popularity&domains=cointelegraph.com,coindesk.com,blockworks.co,coinbureau.com&apiKey=${process.env.NEWSAPI_KEY}`;
  
    try {
      const response = await axios.get(url);
      return response.data.articles;
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  };
  