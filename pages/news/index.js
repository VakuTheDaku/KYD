import Image from 'next/image';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';

export default function News() {
  const [data, setData] = useState();
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news`)
      .then((result) => {
        if (result.data.success === true) {
          const currDate = new Date();
          const yesterday = new Date(currDate);
          yesterday.setDate(currDate.getDate() - 1);

          const todaynews = result.data.news
            .filter((news) => {
              const publishedDate = new Date(news.publishedAt);
              if (publishedDate.getDate() === currDate.getDate()) {
                return news;
              }
            })
            .map((result) => {
              return {
                title: result.title,
                img: result.urlToImage,
                url: result.url,
              };
            });
          const yesterdaynews = result.data.news
            .filter((news) => {
              const publishedDate = new Date(news.publishedAt);
              if (publishedDate.getDate() === yesterday.getDate()) {
                return news;
              }
            })
            .map((result) => {
              return {
                title: result.title,
                img: result.urlToImage,
                url: result.url,
              };
            });
          const othernews = result.data.news
            .filter((news) => {
              const publishedDate = new Date(news.publishedAt);
              if (
                publishedDate.getDate() !== currDate.getDate() &&
                publishedDate.getDate() !== yesterday.getDate()
              ) {
                return news;
              }
            })
            .map((result) => {
              return {
                title: result.title,
                img: result.urlToImage,
                url: result.url,
              };
            })
            .slice(0, 5);
          setData([
            {
              title: 'TODAY',
              news: todaynews,
            },
            {
              title: 'YESTERDAY',
              news: yesterdaynews,
            },
            {
              title: 'PREVIOUS DAYS',
              news: othernews,
            },
          ]);
        } else {
          console.log(result);
          toast.error('Something went wrong while fetching news');
        }
      });
  }, []);

  return (
    <div className=" bg-black min-h-screen grid place-items-center">
      <div className="flex flex-col">
        {data &&
          data.length > 0 &&
          data.map((item, index) => (
            <div key={index} className="flex flex-col mt-3">
              <div className="text-sm text-white">
                {item.news.length > 0 && item.title}
              </div>
              <div className="flex flex-col">
                {item.news.map((news, index) => (
                  <div
                    key={index}
                    className="flex flex-row items-center mt-2 pb-2 hover:cursor-pointer border-b-2 border-gray-200 border-opacity-20 h-20"
                    onClick={() => window.open(news.url, '_blank')}
                  >
                    <Image
                      alt="news"
                      width={150}
                      height={150}
                      src={news.img}
                      loader={() => news.img}
                      className="rounded-lg w-16"
                    />
                    <div className="text-base p-3 text-white hover:text-[blue]">
                      {news.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
